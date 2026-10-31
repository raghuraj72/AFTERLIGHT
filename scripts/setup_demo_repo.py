import os
import subprocess
import json
from datetime import datetime

DEMO_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "ghost_archive_demo"))

def run_git(cmd, cwd, env=None):
    full_env = os.environ.copy()
    if env:
        full_env.update(env)
    res = subprocess.run(["git"] + cmd, cwd=cwd, env=full_env, capture_output=True, text=True)
    if res.returncode != 0:
        print(f"Git warning/error on {cmd}: {res.stderr}")
    return res

def create_demo_repository():
    os.makedirs(DEMO_DIR, exist_ok=True)
    backend_dir = os.path.join(DEMO_DIR, "backend")
    frontend_dir = os.path.join(DEMO_DIR, "frontend")
    os.makedirs(backend_dir, exist_ok=True)
    os.makedirs(frontend_dir, exist_ok=True)

    # Initialize git repo if not already, or recreate if incomplete
    git_dir = os.path.join(DEMO_DIR, ".git")
    if os.path.exists(git_dir):
        check_res = run_git(["rev-list", "--count", "HEAD"], DEMO_DIR)
        if check_res.returncode == 0 and check_res.stdout.strip() == "7":
            print("Demo repository already contains 7 commits.")
            return
        import shutil
        shutil.rmtree(git_dir, ignore_errors=True)

    run_git(["init"], DEMO_DIR)
    run_git(["config", "user.name", "Sarah Lin"], DEMO_DIR)
    run_git(["config", "user.email", "sarah.lin@aetherstream.dev"], DEMO_DIR)

    # --- COMMIT 1: Initial Core ---
    readme_content = """# ChronoLog / AetherStream Edge Telemetry Core

> Notice: Internal prototype for atmospheric weather stations and forensic telemetry buffering.

## Overview
A lightweight telemetry ingestion service that captures micro-meteorological sensor metrics,
evaluates temporal rolling window anomalies, and archives structured signals for offline research.

## Status
Prototype phase. Edge deployment target: Alpine Linux on ARM64 nodes.
"""
    with open(os.path.join(DEMO_DIR, "README.md"), "w", encoding="utf-8") as f:
        f.write(readme_content)

    requirements_content = """fastapi==0.68.0
uvicorn==0.15.0
pydantic==1.8.2
requests==2.22.0
numpy==1.19.5
urllib3==1.25.10
"""
    with open(os.path.join(DEMO_DIR, "requirements.txt"), "w", encoding="utf-8") as f:
        f.write(requirements_content)

    utils_content = """import math
import cmath  # UNUSED_IMPORT
import xml.etree.ElementTree as ET  # UNUSED_IMPORT

def normalize_reading(val: float, min_val: float, max_val: float) -> float:
    \"\"\"Normalizes sensor float readings between 0.0 and 1.0.\"\"\"
    if max_val == min_val:
        return 0.0
    return (val - min_val) / (max_val - min_val)

def calculate_sensor_entropy(readings: list[float]) -> float:
    # UNDOCUMENTED_FUNCTION: Shannon entropy estimation for jitter detection
    # Lacks docstring and type validations
    if not readings:
        return 0.0
    freqs = {}
    for r in readings:
        bucket = round(r, 1)
        freqs[bucket] = freqs.get(bucket, 0) + 1
    total = len(readings)
    entropy = 0.0
    for count in freqs.values():
        p = count / total
        if p > 0:
            entropy -= p * math.log2(p)
    return entropy
"""
    with open(os.path.join(backend_dir, "utils.py"), "w", encoding="utf-8") as f:
        f.write(utils_content)

    run_git(["add", "README.md", "requirements.txt", "backend/utils.py"], DEMO_DIR)
    c1_env = {
        "GIT_AUTHOR_NAME": "Sarah Lin",
        "GIT_AUTHOR_EMAIL": "sarah.lin@aetherstream.dev",
        "GIT_AUTHOR_DATE": "2021-04-12T10:14:00",
        "GIT_COMMITTER_NAME": "Sarah Lin",
        "GIT_COMMITTER_DATE": "2021-04-12T10:14:00"
    }
    run_git(["commit", "--allow-empty", "-m", "Init repo: ChronoLog Edge Telemetry Ingestion Core"], DEMO_DIR, c1_env)

    # --- COMMIT 2: Anomaly Detection Pipeline ---
    pipeline_content = """from typing import List, Dict, Any
import time

class TelemetryWindowBuffer:
    \"\"\"Rolling memory window to track atmospheric pressure, temperature, and humidity.\"\"\"
    def __init__(self, capacity: int = 50):
        self.capacity = capacity
        self.readings: List[Dict[str, Any]] = []

    def push(self, telemetry_point: Dict[str, Any]):
        self.readings.append(telemetry_point)
        if len(self.readings) > self.capacity:
            self.readings.pop(0)

    def detect_anomalies(self, threshold_sigma: float = 2.5) -> List[Dict[str, Any]]:
        \"\"\"Identifies values exceeding running standard deviation threshold.\"\"\"
        if len(self.readings) < 5:
            return []
        temps = [r.get("temp", 0.0) for r in self.readings]
        avg = sum(temps) / len(temps)
        variance = sum((t - avg) ** 2 for t in temps) / len(temps)
        std_dev = variance ** 0.5
        anomalies = []
        for r in self.readings:
            if abs(r.get("temp", 0.0) - avg) > (threshold_sigma * std_dev):
                anomalies.append({**r, "deviation": abs(r.get("temp", 0.0) - avg)})
        return anomalies

def legacy_raw_socket_streamer(port: int = 9099):
    # ORPHANED_MODULE_FUNCTION: Was used in early prototype to blast binary packets over raw TCP.
    # No callers remain after HTTP API adoption.
    # TODO: remove after validating fast batch buffer integration.
    pass
"""
    with open(os.path.join(backend_dir, "pipeline.py"), "w", encoding="utf-8") as f:
        f.write(pipeline_content)

    run_git(["add", "backend/pipeline.py"], DEMO_DIR)
    c2_env = {
        "GIT_AUTHOR_NAME": "Sarah Lin",
        "GIT_AUTHOR_EMAIL": "sarah.lin@aetherstream.dev",
        "GIT_AUTHOR_DATE": "2021-06-20T14:32:00",
        "GIT_COMMITTER_NAME": "Sarah Lin",
        "GIT_COMMITTER_DATE": "2021-06-20T14:32:00"
    }
    run_git(["commit", "--allow-empty", "-m", "feat(ingest): add rolling window buffer and anomaly detection heuristic"], DEMO_DIR, c2_env)

    # --- COMMIT 3: Security & Session Handshake ---
    auth_content = """import hashlib
import secrets
from typing import Optional

# FIXME: Deprecated MD5 session hash. Migrate to SHA256 before production deployment.
def compute_legacy_session_digest(device_id: str, secret_key: str) -> str:
    raw = f"{device_id}::{secret_key}"
    return hashlib.md5(raw.encode("utf-8")).hexdigest()

def verify_station_token(provided_token: str, expected_token: str) -> bool:
    \"\"\"Constant-time string comparison for device authentication.\"\"\"
    return secrets.compare_digest(provided_token, expected_token)

def decrypt_cold_vault_keys(vault_path: str) -> Optional[bytes]:
    # UNDOCUMENTED_FUNCTION: Secret recovery function left during cloud sync design.
    # Never connected to router endpoints.
    # WARNING: Relies on local unencrypted path.
    return None
"""
    with open(os.path.join(backend_dir, "auth_legacy.py"), "w", encoding="utf-8") as f:
        f.write(auth_content)

    server_content = """from fastapi import FastAPI, HTTPException, Header
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from .pipeline import TelemetryWindowBuffer
from .auth_legacy import verify_station_token, compute_legacy_session_digest

app = FastAPI(title="ChronoLog Edge Ingest", version="0.4.1")
buffer = TelemetryWindowBuffer(capacity=100)

class TelemetryPayload(BaseModel):
    station_id: str
    timestamp: float
    temperature: float
    humidity: float
    barometric_pressure: float

@app.get("/health")
def health():
    return {"status": "alive", "engine": "ChronoLog-0.4.1"}

@app.post("/api/v1/telemetry/ingest")
def ingest_telemetry(payload: TelemetryPayload, x_station_token: Optional[str] = Header(None)):
    if not x_station_token or not verify_station_token(x_station_token, "EDGE_SECRET_KEY_PROD_1"):
        raise HTTPException(status_code=401, detail="Unauthorized edge station")
    data = payload.dict()
    buffer.push(data)
    return {"accepted": True, "buffered_count": len(buffer.readings)}

@app.get("/api/v1/telemetry/anomalies")
def get_anomalies():
    # MISSING_TEST: No unit test exists for anomaly detection threshold logic!
    return {"anomalies": buffer.detect_anomalies()}
"""
    with open(os.path.join(backend_dir, "server.py"), "w", encoding="utf-8") as f:
        f.write(server_content)

    run_git(["add", "backend/auth_legacy.py", "backend/server.py"], DEMO_DIR)
    c3_env = {
        "GIT_AUTHOR_NAME": "Alex Chen",
        "GIT_AUTHOR_EMAIL": "alex.chen@aetherstream.dev",
        "GIT_AUTHOR_DATE": "2021-09-15T11:05:00",
        "GIT_COMMITTER_NAME": "Alex Chen",
        "GIT_COMMITTER_DATE": "2021-09-15T11:05:00"
    }
    run_git(["commit", "--allow-empty", "-m", "feat(security): implement session handshake and token vault"], DEMO_DIR, c3_env)

    # --- COMMIT 4: Frontend Live-Feed Visualizer ---
    package_json = """{
  "name": "chronolog-edge-visualizer",
  "version": "0.2.0",
  "description": "Live canvas feed and radar monitor for atmospheric sensors",
  "dependencies": {
    "chart.js": "^2.9.4",
    "axios": "^0.21.1",
    "moment": "^2.29.1"
  }
}
"""
    with open(os.path.join(DEMO_DIR, "package.json"), "w", encoding="utf-8") as f:
        f.write(package_json)

    app_js = """// ChronoLog UI entrypoint
const API_BASE = "/api/v1/telemetry";

export async function fetchLiveAnomalies() {
    try {
        const res = await fetch(`${API_BASE}/anomalies`);
        return await res.json();
    } catch (e) {
        console.error("Telemetry link lost", e);
        return [];
    }
}

export function renderObsoleteRadar(canvasElement, rawPoints) {
    // TODO: remove canvas fallback once WebGL feed stabilizes
    const ctx = canvasElement.getContext('2d');
    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    ctx.fillStyle = '#00ff88';
    rawPoints.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();
    });
}
"""
    with open(os.path.join(frontend_dir, "app.js"), "w", encoding="utf-8") as f:
        f.write(app_js)

    data_feed_js = """// Data streaming worker
export class SensorStreamWorker {
    constructor(endpoint) {
        this.endpoint = endpoint;
        this.active = false;
    }
    start() {
        this.active = true;
        console.log("Worker initialized on " + this.endpoint);
    }
    stop() {
        this.active = false;
    }
}
"""
    with open(os.path.join(frontend_dir, "data_feed.js"), "w", encoding="utf-8") as f:
        f.write(data_feed_js)

    run_git(["add", "package.json", "frontend/app.js", "frontend/data_feed.js"], DEMO_DIR)
    c4_env = {
        "GIT_AUTHOR_NAME": "Dave Miller",
        "GIT_AUTHOR_EMAIL": "dave.m@aetherstream.dev",
        "GIT_AUTHOR_DATE": "2022-01-10T16:45:00",
        "GIT_COMMITTER_NAME": "Dave Miller",
        "GIT_COMMITTER_DATE": "2022-01-10T16:45:00"
    }
    run_git(["commit", "--allow-empty", "-m", "feat(web): add dashboard live-feed visualizer with canvas radar"], DEMO_DIR, c4_env)

    # --- COMMIT 5: Refactor Pipeline ---
    # Update pipeline with batch method
    pipeline_v2 = pipeline_content + """
    def batch_process(self, chunk: List[Dict[str, Any]]):
        \"\"\"Processes an incoming micro-batch of telemetry.\"\"\"
        for item in chunk:
            self.push(item)
"""
    with open(os.path.join(backend_dir, "pipeline.py"), "w", encoding="utf-8") as f:
        f.write(pipeline_v2)

    run_git(["add", "backend/pipeline.py"], DEMO_DIR)
    c5_env = {
        "GIT_AUTHOR_NAME": "Sarah Lin",
        "GIT_AUTHOR_EMAIL": "sarah.lin@aetherstream.dev",
        "GIT_AUTHOR_DATE": "2022-04-03T09:20:00",
        "GIT_COMMITTER_NAME": "Sarah Lin",
        "GIT_COMMITTER_DATE": "2022-04-03T09:20:00"
    }
    run_git(["commit", "--allow-empty", "-m", "refactor(pipeline): transition to fast batch buffer; deprecate old raw socket streamer"], DEMO_DIR, c5_env)

    # --- COMMIT 6: Legacy hotfix ---
    auth_hotfix = auth_content + """
# Hotfix 2022-08-19: Temporary dev token bypass
DEV_DEBUG_OVERRIDE = False  # DO NOT ENABLE IN PRODUCTION
"""
    with open(os.path.join(backend_dir, "auth_legacy.py"), "w", encoding="utf-8") as f:
        f.write(auth_hotfix)

    run_git(["add", "backend/auth_legacy.py"], DEMO_DIR)
    c6_env = {
        "GIT_AUTHOR_NAME": "Alex Chen",
        "GIT_AUTHOR_EMAIL": "alex.chen@aetherstream.dev",
        "GIT_AUTHOR_DATE": "2022-08-19T17:50:00",
        "GIT_COMMITTER_NAME": "Alex Chen",
        "GIT_COMMITTER_DATE": "2022-08-19T17:50:00"
    }
    run_git(["commit", "--allow-empty", "-m", "chore(legacy): temporary hotfix bypass for legacy auth; mark TODO for vault removal"], DEMO_DIR, c6_env)

    # --- COMMIT 7: Final abandoned commit ---
    # Add a marker file showing project decommissioning
    with open(os.path.join(DEMO_DIR, "DEPRECATION_NOTICE.txt"), "w", encoding="utf-8") as f:
        f.write("NOTICE: Project ChronoLog decommissioned in Nov 2022. Team transferred to Cloud telemetry unit.")

    run_git(["add", "DEPRECATION_NOTICE.txt"], DEMO_DIR)
    c7_env = {
        "GIT_AUTHOR_NAME": "Sarah Lin",
        "GIT_AUTHOR_EMAIL": "sarah.lin@aetherstream.dev",
        "GIT_AUTHOR_DATE": "2022-11-05T13:12:00",
        "GIT_COMMITTER_NAME": "Sarah Lin",
        "GIT_COMMITTER_DATE": "2022-11-05T13:12:00"
    }
    run_git(["commit", "--allow-empty", "-m", "WIP: abandoned refactor to v2 protocol before project decommissioning"], DEMO_DIR, c7_env)

    # Write the ground_truth.json for synthetic benchmark evaluation
    ground_truth = {
        "repository_name": "GHOST_ARCHIVE_DEMO",
        "expected_purpose": "Edge IoT atmospheric telemetry aggregator and anomaly detection buffer for weather stations",
        "expected_findings": [
            {
                "id": "GT-01",
                "file": "backend/auth_legacy.py",
                "type": "deprecated_crypto",
                "symbol": "compute_legacy_session_digest",
                "line_hint": 6,
                "evidence": "hashlib.md5",
                "severity": "high",
                "explanation": "Uses insecure MD5 hashing for session verification"
            },
            {
                "id": "GT-02",
                "file": "backend/auth_legacy.py",
                "type": "undocumented_function",
                "symbol": "decrypt_cold_vault_keys",
                "line_hint": 14,
                "evidence": "def decrypt_cold_vault_keys",
                "severity": "medium",
                "explanation": "Orphaned vault key recovery function with no docstring and zero call sites"
            },
            {
                "id": "GT-03",
                "file": "backend/pipeline.py",
                "type": "orphaned_function",
                "symbol": "legacy_raw_socket_streamer",
                "line_hint": 30,
                "evidence": "def legacy_raw_socket_streamer",
                "severity": "medium",
                "explanation": "Deprecated raw socket streaming function never called by FastAPI server"
            },
            {
                "id": "GT-04",
                "file": "backend/utils.py",
                "type": "unused_import",
                "symbol": "cmath",
                "line_hint": 2,
                "evidence": "import cmath",
                "severity": "low",
                "explanation": "Imported library cmath is never referenced in file"
            },
            {
                "id": "GT-05",
                "file": "backend/utils.py",
                "type": "unused_import",
                "symbol": "xml.etree.ElementTree",
                "line_hint": 3,
                "evidence": "import xml.etree.ElementTree as ET",
                "severity": "low",
                "explanation": "Imported library xml.etree.ElementTree is never referenced in file"
            },
            {
                "id": "GT-06",
                "file": "backend/utils.py",
                "type": "undocumented_function",
                "symbol": "calculate_sensor_entropy",
                "line_hint": 12,
                "evidence": "def calculate_sensor_entropy",
                "severity": "medium",
                "explanation": "Critical calculation function missing docstring, type bounds, and test cases"
            },
            {
                "id": "GT-07",
                "file": "backend/server.py",
                "type": "missing_test",
                "symbol": "get_anomalies",
                "line_hint": 30,
                "evidence": "@app.get(\"/api/v1/telemetry/anomalies\")",
                "severity": "high",
                "explanation": "Core anomaly API endpoint has no corresponding automated test coverage"
            },
            {
                "id": "GT-08",
                "file": "frontend/app.js",
                "type": "todo_marker",
                "symbol": "renderObsoleteRadar",
                "line_hint": 15,
                "evidence": "TODO: remove canvas fallback once WebGL feed stabilizes",
                "severity": "low",
                "explanation": "Unresolved TODO marker on legacy canvas renderer"
            },
            {
                "id": "GT-09",
                "file": "requirements.txt",
                "type": "deprecated_dependency",
                "symbol": "urllib3==1.25.10",
                "line_hint": 6,
                "evidence": "urllib3==1.25.10",
                "severity": "high",
                "explanation": "Severely outdated urllib3 version with known CVE vulnerabilities"
            },
            {
                "id": "GT-10",
                "file": "package.json",
                "type": "deprecated_dependency",
                "symbol": "moment",
                "line_hint": 7,
                "evidence": "moment: ^2.29.1",
                "severity": "medium",
                "explanation": "Moment.js is in maintenance mode and should be migrated to date-fns or native Intl"
            }
        ]
    }
    with open(os.path.join(DEMO_DIR, "ground_truth.json"), "w", encoding="utf-8") as f:
        json.dump(ground_truth, f, indent=2)

    print("Successfully built GHOST_ARCHIVE_DEMO repository with 7 historical commits and ground truth!")

if __name__ == "__main__":
    create_demo_repository()
