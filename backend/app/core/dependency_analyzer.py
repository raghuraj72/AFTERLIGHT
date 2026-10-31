import os
import json
from typing import List
from ..models.schemas import GhostCodeFinding

DEPRECATED_PYTHON_PKGS = {
    "urllib3": {
        "legacy_max": "1.26.0",
        "severity": "high",
        "explanation": "Outdated urllib3 (<1.26) subject to known CVEs and incompatibility with modern OpenSSL.",
        "action": "Upgrade to urllib3>=2.0.0 or requests>=2.31.0."
    },
    "pydantic": {
        "legacy_max": "1.9.0",
        "severity": "medium",
        "explanation": "Pydantic v1.8 is legacy. Modern ecosystem uses Pydantic v2 with Rust core for 5-20x speedup.",
        "action": "Migrate model definitions to Pydantic v2."
    },
    "requests": {
        "legacy_max": "2.25.0",
        "severity": "medium",
        "explanation": "Requests 2.22 is unmaintained and contains deprecated SSL adapter fallbacks.",
        "action": "Upgrade requests to >=2.31.0."
    }
}

DEPRECATED_NODE_PKGS = {
    "moment": {
        "severity": "medium",
        "explanation": "Moment.js is in maintenance-only mode. The Moment team recommends against using it in new projects.",
        "action": "Migrate to modern tree-shakeable libraries like date-fns, Luxon, or native Intl API."
    },
    "chart.js": {
        "severity": "low",
        "explanation": "Chart.js v2 has breaking changes compared to Chart.js v4 with modern ESM packaging.",
        "action": "Upgrade to Chart.js v4 or Recharts/ECharts."
    }
}

def analyze_dependencies(repo_path: str, files_list: List[str], start_id: int = 20) -> List[GhostCodeFinding]:
    findings: List[GhostCodeFinding] = []
    current_id = start_id

    # 1. Check requirements.txt
    req_path = os.path.join(repo_path, "requirements.txt")
    if os.path.exists(req_path):
        try:
            with open(req_path, "r", encoding="utf-8", errors="ignore") as f:
                for line_idx, line in enumerate(f, 1):
                    clean = line.strip()
                    if not clean or clean.startswith("#"):
                        continue
                    
                    for pkg, info in DEPRECATED_PYTHON_PKGS.items():
                        if pkg in clean.lower():
                            findings.append(GhostCodeFinding(
                                id=f"GC-{current_id:02d}",
                                file_path="requirements.txt",
                                line_number=line_idx,
                                symbol=clean,
                                type="deprecated_dependency",
                                severity=info["severity"],
                                evidence=clean,
                                explanation=info["explanation"],
                                confidence=0.96,
                                recommended_action=info["action"]
                            ))
                            current_id += 1
        except Exception:
            pass

    # 2. Check package.json
    pkg_json_path = os.path.join(repo_path, "package.json")
    if os.path.exists(pkg_json_path):
        try:
            with open(pkg_json_path, "r", encoding="utf-8", errors="ignore") as f:
                lines = f.readlines()
            
            with open(pkg_json_path, "r", encoding="utf-8", errors="ignore") as f:
                data = json.load(f)

            deps = {**data.get("dependencies", {}), **data.get("devDependencies", {})}
            for pkg, version in deps.items():
                if pkg in DEPRECATED_NODE_PKGS:
                    info = DEPRECATED_NODE_PKGS[pkg]
                    
                    # Find line number
                    line_no = 1
                    evidence_line = f'"{pkg}": "{version}"'
                    for idx, l in enumerate(lines, 1):
                        if pkg in l:
                            line_no = idx
                            evidence_line = l.strip()
                            break

                    findings.append(GhostCodeFinding(
                        id=f"GC-{current_id:02d}",
                        file_path="package.json",
                        line_number=line_no,
                        symbol=f"{pkg} ({version})",
                        type="deprecated_dependency",
                        severity=info["severity"],
                        evidence=evidence_line,
                        explanation=info["explanation"],
                        confidence=0.95,
                        recommended_action=info["action"]
                    ))
                    current_id += 1
        except Exception:
            pass

    return findings
