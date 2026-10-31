import os
import shutil
import time
import uuid
import zipfile
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import PlainTextResponse

from .config import settings
from .models.schemas import (
    InvestigationResult, AskAiRequest, AiAnswerResponse, 
    UpdateResurrectionItemRequest
)
from .core.scanner import scan_repository
from .core.ast_analyzer import analyze_source_code
from .core.dependency_analyzer import analyze_dependencies
from .core.git_archaeology import reconstruct_git_history
from .core.health_scorer import calculate_repository_health
from .core.revival_engine import generate_resurrection_plan
from .core.missions import generate_ghost_hunt_missions
from .core.rag_engine import chunk_repository, retrieve_evidence
from .core.gemma_service import answer_repository_question, list_available_ollama_models
from .core.evaluator import run_synthetic_benchmark
from .core.report_generator import generate_markdown_report
from .storage.repository_store import (
    save_investigation, get_investigation, list_investigations,
    update_resurrection_status
)

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="AFTERLIGHT — Digital Archaeology Platform for Abandoned Software Repositories"
)

# Enable CORS for frontend Vite dev and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def run_investigation_pipeline(repo_path: str, repo_name: str, is_demo: bool = False) -> Tuple[InvestigationResult, Dict[str, Any]]:
    start_time = time.time()

    # 1. Scanner
    scan_meta = scan_repository(repo_path)
    files_list = scan_meta["files_list"]
    languages = scan_meta["languages"]
    total_files = scan_meta["total_files"]
    total_loc = scan_meta["total_lines_of_code"]
    readme_content = scan_meta["readme_content"]

    # 2. AST & Ghost Code
    ast_findings, architecture = analyze_source_code(repo_path, files_list)

    # 3. Dependency Analysis
    dep_findings = analyze_dependencies(repo_path, files_list, start_id=len(ast_findings) + 1)
    all_findings = ast_findings + dep_findings

    # 4. Git Archaeology
    commits, last_commit_date = reconstruct_git_history(repo_path)

    # 5. Health Scoring
    health = calculate_repository_health(files_list, all_findings, commits, readme_content, total_loc)

    # 6. Revival Roadmap
    resurrection_plan = generate_resurrection_plan(all_findings, commits)

    # 7. Ghost Hunt Missions
    missions = generate_ghost_hunt_missions(all_findings)

    duration_ms = (time.time() - start_time) * 1000

    inv_id = "GHOST_ARCHIVE_DEMO" if is_demo else str(uuid.uuid4())[:8]

    result = InvestigationResult(
        id=inv_id,
        repo_name=repo_name,
        repo_path=repo_path,
        is_demo=is_demo,
        analyzed_at=time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime()),
        last_commit_date=last_commit_date,
        total_files=total_files,
        total_lines_of_code=total_loc,
        languages=languages,
        files_list=files_list,
        findings=all_findings,
        commits=commits,
        architecture=architecture,
        health=health,
        resurrection_plan=resurrection_plan,
        missions=missions,
        offline_mode=True,
        active_ai_model="Gemma 2B / Local Ollama (Grounded)"
    )

    # 8. Save
    save_investigation(result)

    # 9. Synthetic Benchmark if ground truth exists
    benchmark = run_synthetic_benchmark(repo_path, all_findings, duration_ms)

    return result, benchmark

@app.get("/api/health")
async def health_check():
    ollama_models = await list_available_ollama_models()
    return {
        "status": "healthy",
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "ollama_available": len(ollama_models) > 0,
        "available_models": ollama_models,
        "timestamp": time.time()
    }

@app.post("/api/investigate/demo")
async def investigate_demo():
    """Runs investigation pipeline on preloaded GHOST_ARCHIVE_DEMO repository."""
    demo_path = settings.DEMO_REPO_PATH
    if not os.path.exists(demo_path):
        raise HTTPException(status_code=404, detail="Demo repository not found. Run scripts/setup_demo_repo.py first.")
    
    result, benchmark = run_investigation_pipeline(demo_path, "GHOST_ARCHIVE_DEMO", is_demo=True)
    return {
        "investigation": result,
        "benchmark": benchmark
    }

@app.post("/api/investigate/upload")
async def investigate_zip(file: UploadFile = File(...)):
    """Uploads and investigates a ZIP archive repository with sandbox security checks."""
    if not file.filename.endswith(".zip"):
        raise HTTPException(status_code=400, detail="Only .zip archives are supported.")

    upload_dir = os.path.join(settings.DATA_DIR, "uploads", str(uuid.uuid4())[:8])
    os.makedirs(upload_dir, exist_ok=True)
    zip_path = os.path.join(upload_dir, file.filename)

    with open(zip_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    extract_dir = os.path.join(upload_dir, "extracted")
    os.makedirs(extract_dir, exist_ok=True)

    # Unpack with path traversal security checks
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        for member in zip_ref.namelist():
            # Check for path traversal attacks
            filename = os.path.basename(member)
            if ".." in member or member.startswith("/"):
                continue
            zip_ref.extract(member, extract_dir)

    # Detect root directory if single top-level folder
    contents = os.listdir(extract_dir)
    target_path = extract_dir
    if len(contents) == 1 and os.path.isdir(os.path.join(extract_dir, contents[0])):
        target_path = os.path.join(extract_dir, contents[0])

    repo_name = os.path.splitext(file.filename)[0]
    result, benchmark = run_investigation_pipeline(target_path, repo_name, is_demo=False)
    return {
        "investigation": result,
        "benchmark": benchmark
    }

@app.post("/api/investigate/github")
async def investigate_github(repo_url: str = Form(...)):
    """Clones public GitHub repository into sandbox and runs archaeology analysis."""
    import subprocess
    clean_url = repo_url.strip()
    if not clean_url.startswith("https://github.com/"):
        raise HTTPException(status_code=400, detail="Invalid GitHub URL. Must start with https://github.com/")

    repo_name = clean_url.rstrip("/").split("/")[-1].replace(".git", "")
    clone_dir = os.path.join(settings.DATA_DIR, "clones", f"{repo_name}_{str(uuid.uuid4())[:6]}")
    os.makedirs(os.path.dirname(clone_dir), exist_ok=True)

    try:
        subprocess.run(["git", "clone", "--depth", "50", clean_url, clone_dir], check=True, timeout=60)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to clone repository: {str(e)}")

    result, benchmark = run_investigation_pipeline(clone_dir, repo_name, is_demo=False)
    return {
        "investigation": result,
        "benchmark": benchmark
    }

@app.get("/api/investigations")
async def get_investigations_list():
    return list_investigations()

@app.get("/api/investigations/{inv_id}")
async def get_investigation_details(inv_id: str):
    inv = get_investigation(inv_id)
    if not inv:
        # Check if demo requested and auto-run
        if inv_id == "GHOST_ARCHIVE_DEMO" and os.path.exists(settings.DEMO_REPO_PATH):
            inv, _ = run_investigation_pipeline(settings.DEMO_REPO_PATH, "GHOST_ARCHIVE_DEMO", is_demo=True)
            return inv
        raise HTTPException(status_code=404, detail="Investigation not found.")
    return inv

@app.post("/api/ai/ask")
async def ask_ai_question(request: AskAiRequest):
    """Retrieves relevant code chunks & Git commits, and generates an evidence-grounded answer."""
    inv = get_investigation(request.investigation_id)
    if not inv:
        raise HTTPException(status_code=404, detail="Investigation not found.")

    # 1. Chunk repository
    chunks = chunk_repository(inv.repo_path, inv.files_list)

    # 2. Retrieve evidence
    source_citations, commit_citations = retrieve_evidence(request.question, chunks, inv.commits)

    # 3. Call Gemma / Grounded Reasoning
    response = await answer_repository_question(
        request.question, source_citations, commit_citations, inv.repo_name
    )
    return response

@app.post("/api/investigations/{inv_id}/resurrection/{item_id}")
async def update_resurrection_item(inv_id: str, item_id: str, req: UpdateResurrectionItemRequest):
    success = update_resurrection_status(inv_id, item_id, req.status)
    if not success:
        raise HTTPException(status_code=404, detail="Item or investigation not found.")
    return {"success": True, "status": req.status}

@app.get("/api/investigations/{inv_id}/benchmark")
async def get_investigation_benchmark(inv_id: str):
    inv = get_investigation(inv_id)
    if not inv:
        raise HTTPException(status_code=404, detail="Investigation not found.")
    benchmark = run_synthetic_benchmark(inv.repo_path, inv.findings, 42.5)
    return benchmark

@app.get("/api/investigations/{inv_id}/report/markdown")
async def get_report_markdown(inv_id: str):
    inv = get_investigation(inv_id)
    if not inv:
        raise HTTPException(status_code=404, detail="Investigation not found.")
    benchmark = run_synthetic_benchmark(inv.repo_path, inv.findings, 42.5)
    md_content = generate_markdown_report(inv, benchmark)
    return PlainTextResponse(md_content, media_type="text/markdown")

@app.get("/api/files/content")
async def get_file_content(inv_id: str, file_path: str):
    inv = get_investigation(inv_id)
    if not inv:
        raise HTTPException(status_code=404, detail="Investigation not found.")

    # Prevent path traversal
    normalized_path = os.path.normpath(file_path).lstrip("\\/")
    full_path = os.path.join(inv.repo_path, normalized_path)
    
    if not full_path.startswith(os.path.abspath(inv.repo_path)):
        raise HTTPException(status_code=403, detail="Access denied: path traversal attempt.")

    if not os.path.exists(full_path):
        raise HTTPException(status_code=404, detail=f"File not found: {file_path}")

    try:
        with open(full_path, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()
            lines = content.splitlines()
        return {
            "file_path": file_path,
            "total_lines": len(lines),
            "content": content,
            "lines": lines
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not read file: {str(e)}")

# Mount compiled production frontend if available
dist_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist"))
if os.path.exists(dist_dir):
    from fastapi.staticfiles import StaticFiles
    app.mount("/", StaticFiles(directory=dist_dir, html=True), name="frontend")

