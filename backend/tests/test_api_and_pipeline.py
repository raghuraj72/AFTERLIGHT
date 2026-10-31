import pytest
import os
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.config import settings
from backend.app.core.scanner import scan_repository
from backend.app.core.ast_analyzer import analyze_source_code
from backend.app.core.git_archaeology import reconstruct_git_history
from backend.app.core.evaluator import run_synthetic_benchmark

client = TestClient(app)

def test_health_endpoint():
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert "AFTERLIGHT" in data["service"]

def test_demo_investigation_pipeline():
    res = client.post("/api/investigate/demo")
    assert res.status_code == 200
    data = res.json()
    inv = data["investigation"]
    assert inv["repo_name"] == "GHOST_ARCHIVE_DEMO"
    assert inv["is_demo"] is True
    assert inv["total_files"] >= 7
    assert len(inv["findings"]) >= 6
    assert len(inv["commits"]) == 7
    assert inv["health"]["overall_score"] > 0
    assert len(inv["resurrection_plan"]) >= 5
    assert len(inv["missions"]) >= 3

    # Check benchmark results
    benchmark = data["benchmark"]
    assert benchmark["status"] == "completed"
    assert benchmark["precision"] >= 0.70
    assert benchmark["recall"] >= 0.70
    assert benchmark["citation_coverage_pct"] >= 90.0

def test_ai_question_answering_purpose():
    # Ask the demonstration question
    res = client.post("/api/ai/ask", json={
        "investigation_id": "GHOST_ARCHIVE_DEMO",
        "question": "What was this project originally designed to do?"
    })
    assert res.status_code == 200
    data = res.json()
    assert "telemetry" in data["answer"].lower() or "weather" in data["answer"].lower() or "chronolog" in data["answer"].lower()
    assert len(data["source_citations"]) > 0
    assert len(data["commit_citations"]) > 0
    # Citations must have actual files
    assert any("pipeline.py" in c["file_path"] or "server.py" in c["file_path"] or "README.md" in c["file_path"] for c in data["source_citations"])

def test_file_content_viewer_security():
    # Valid file
    res = client.get("/api/files/content?inv_id=GHOST_ARCHIVE_DEMO&file_path=backend/auth_legacy.py")
    assert res.status_code == 200
    data = res.json()
    assert "compute_legacy_session_digest" in data["content"]
    assert data["total_lines"] > 0

    # Path traversal attempt
    res_malicious = client.get("/api/files/content?inv_id=GHOST_ARCHIVE_DEMO&file_path=../../../../windows/system32/cmd.exe")
    assert res_malicious.status_code in (403, 404)

def test_markdown_report_generation():
    res = client.get("/api/investigations/GHOST_ARCHIVE_DEMO/report/markdown")
    assert res.status_code == 200
    assert "AFTERLIGHT ARCHAEOLOGY REPORT" in res.text
    assert "GHOST_ARCHIVE_DEMO" in res.text
    assert "Resurrection Roadmap" in res.text
