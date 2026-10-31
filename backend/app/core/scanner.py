import os
from typing import Dict, List, Tuple

IGNORE_DIRS = {
    ".git", "__pycache__", ".venv", "venv", "node_modules", 
    ".pytest_cache", ".idea", ".vscode", "dist", "build", ".mypy_cache"
}

EXTENSION_LANGUAGE_MAP = {
    ".py": "Python",
    ".js": "JavaScript",
    ".jsx": "JavaScript",
    ".ts": "TypeScript",
    ".tsx": "TypeScript",
    ".json": "JSON",
    ".md": "Markdown",
    ".html": "HTML",
    ".css": "CSS",
    ".txt": "Text",
    ".yml": "YAML",
    ".yaml": "YAML",
    ".sh": "Shell",
    ".go": "Go",
    ".rs": "Rust",
    ".java": "Java",
    ".c": "C",
    ".cpp": "C++",
}

IGNORE_FILES = {"ground_truth.json", "package-lock.json", ".gitignore"}

def scan_repository(repo_path: str) -> Dict[str, Any]:
    if not os.path.exists(repo_path):
        raise ValueError(f"Repository path does not exist: {repo_path}")

    files_list = []
    languages: Dict[str, int] = {}
    total_loc = 0
    readme_content = ""

    for root, dirs, files in os.walk(repo_path):
        # Filter out ignored dirs
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS and not d.startswith(".")]

        for file in files:
            if file in IGNORE_FILES:
                continue
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, repo_path).replace("\\", "/")

            # Check for README
            if file.lower().startswith("readme") and not readme_content:
                try:
                    with open(full_path, "r", encoding="utf-8", errors="ignore") as f:
                        readme_content = f.read()
                except Exception:
                    pass

            # Calculate lines of code
            ext = os.path.splitext(file)[1].lower()
            lang = EXTENSION_LANGUAGE_MAP.get(ext, "Other")
            
            loc = 0
            try:
                with open(full_path, "r", encoding="utf-8", errors="ignore") as f:
                    lines = f.readlines()
                    loc = len([l for l in lines if l.strip()])
            except Exception:
                pass

            total_loc += loc
            languages[lang] = languages.get(lang, 0) + loc
            files_list.append(rel_path)

    return {
        "files_list": files_list,
        "languages": languages,
        "total_files": len(files_list),
        "total_lines_of_code": total_loc,
        "readme_content": readme_content
    }
