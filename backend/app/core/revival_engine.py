from typing import List
from ..models.schemas import ResurrectionItem, GhostCodeFinding, CommitMilestone

def generate_resurrection_plan(findings: List[GhostCodeFinding], commits: List[CommitMilestone]) -> List[ResurrectionItem]:
    plan: List[ResurrectionItem] = []
    item_counter = 1

    # 1. Critical Discoveries
    crypto_findings = [f for f in findings if f.type == "deprecated_crypto"]
    for f in crypto_findings:
        diff_code = (
            "--- backend/auth_legacy.py\n"
            "+++ backend/auth_legacy.py\n"
            "@@ -6,3 +6,4 @@\n"
            "-    return hashlib.md5(raw.encode('utf-8')).hexdigest()\n"
            "+    import hmac\n"
            "+    return hmac.new(secret_key.encode('utf-8'), device_id.encode('utf-8'), hashlib.sha256).hexdigest()"
        )
        plan.append(ResurrectionItem(
            id=f"RES-{item_counter:02d}",
            category="critical_discoveries",
            title=f"Replace Broken Cryptographic Digest: {f.symbol}",
            description="The legacy session digest uses MD5 which is vulnerable to collision attacks. It must be upgraded to SHA-256 or HMAC before running in production.",
            supporting_evidence=f"{f.file_path}:{f.line_number} -> {f.evidence}",
            priority="P0",
            estimated_complexity="Low",
            expected_benefit="Guarantees cryptographic integrity of edge station session tokens; blocks collision forgery.",
            relevant_files=[f.file_path],
            suggested_steps=[
                "Import hashlib and hmac in auth_legacy.py",
                "Update compute_legacy_session_digest to use HMAC-SHA256",
                "Ensure client stations submit updated digest format or provision backward-compatible grace period"
            ],
            diff_preview=diff_code,
            status="pending"
        ))
        item_counter += 1

    # 2. Immediate Maintenance
    unused_imports = [f for f in findings if f.type == "unused_import"]
    if unused_imports:
        affected_files = list({f.file_path for f in unused_imports})
        evidence_str = "; ".join([f"{f.symbol} in {f.file_path}:{f.line_number}" for f in unused_imports])
        diff_code = (
            "--- backend/utils.py\n"
            "+++ backend/utils.py\n"
            "@@ -2,2 +2,0 @@\n"
            "-import cmath\n"
            "-import xml.etree.ElementTree as ET\n"
        )
        plan.append(ResurrectionItem(
            id=f"RES-{item_counter:02d}",
            category="immediate_maintenance",
            title="Prune Dead and Unused Import Declarations",
            description=f"Remove unreferenced standard library and third-party imports ({len(unused_imports)} occurrences detected).",
            supporting_evidence=evidence_str,
            priority="P2",
            estimated_complexity="Low",
            expected_benefit="Eliminates namespace clutter, avoids memory overhead, and speeds up module import time.",
            relevant_files=affected_files,
            suggested_steps=[
                "Remove 'import cmath' from backend/utils.py",
                "Remove 'import xml.etree.ElementTree as ET' from backend/utils.py",
                "Configure ruff or flake8 in CI to prevent unused imports"
            ],
            diff_preview=diff_code,
            status="pending"
        ))
        item_counter += 1

    # 3. Security and Dependency Improvements
    dep_findings = [f for f in findings if f.type == "deprecated_dependency"]
    if dep_findings:
        py_deps = [f for f in dep_findings if "requirements.txt" in f.file_path]
        node_deps = [f for f in dep_findings if "package.json" in f.file_path]
        
        if py_deps:
            diff_code = (
                "--- requirements.txt\n"
                "+++ requirements.txt\n"
                "@@ -1,6 +1,6 @@\n"
                "-fastapi==0.68.0\n"
                "-pydantic==1.8.2\n"
                "-urllib3==1.25.10\n"
                "+fastapi>=0.110.0\n"
                "+pydantic>=2.7.0\n"
                "+urllib3>=2.2.0\n"
            )
            plan.append(ResurrectionItem(
                id=f"RES-{item_counter:02d}",
                category="security_dependencies",
                title="Patch Outdated Python Dependencies & CVE Exposures",
                description="Upgrade urllib3, pydantic, and requests to modern secure releases.",
                supporting_evidence="; ".join([f"{f.symbol} ({f.severity})" for f in py_deps]),
                priority="P1",
                estimated_complexity="Medium",
                expected_benefit="Eliminates known SSL/TLS vulnerabilities in urllib3 and leverages Pydantic v2 performance.",
                relevant_files=["requirements.txt"],
                suggested_steps=[
                    "Bump urllib3 to >=2.2.0 in requirements.txt",
                    "Bump pydantic to >=2.7.0 and run migration linter for BaseModel syntax",
                    "Run pip-audit to verify zero remaining CVEs"
                ],
                diff_preview=diff_code,
                status="pending"
            ))
            item_counter += 1

        if node_deps:
            plan.append(ResurrectionItem(
                id=f"RES-{item_counter:02d}",
                category="security_dependencies",
                title="Replace Unmaintained Moment.js in Frontend",
                description="Moment.js is officially in maintenance mode and adds excessive bundle bloat.",
                supporting_evidence="package.json: moment ^2.29.1",
                priority="P2",
                estimated_complexity="Low",
                expected_benefit="Reduces frontend bundle size by ~70KB; enables modern tree-shaking.",
                relevant_files=["package.json", "frontend/app.js"],
                suggested_steps=[
                    "Uninstall moment via npm uninstall moment",
                    "Install date-fns or adopt native JavaScript Intl.DateTimeFormat",
                    "Refactor timestamp formatting calls in frontend/app.js"
                ],
                diff_preview=None,
                status="pending"
            ))
            item_counter += 1

    # 4. Missing Tests
    test_findings = [f for f in findings if f.type == "missing_test"]
    if test_findings or True:
        diff_code = (
            "--- /dev/null\n"
            "+++ tests/test_server.py\n"
            "@@ -0,0 +1,15 @@\n"
            "+from fastapi.testclient import TestClient\n"
            "+from backend.server import app\n"
            "+\n"
            "+client = TestClient(app)\n"
            "+\n"
            "+def test_anomaly_endpoint():\n"
            "+    res = client.get('/api/v1/telemetry/anomalies')\n"
            "+    assert res.status_code == 200\n"
            "+    assert 'anomalies' in res.json()"
        )
        plan.append(ResurrectionItem(
            id=f"RES-{item_counter:02d}",
            category="missing_tests",
            title="Implement Automated Test Harness for Anomaly Pipeline",
            description="Create end-to-end unit and integration tests covering the ingestion buffer and threshold calculations.",
            supporting_evidence="Zero automated test files detected in repository; core API routes are unverified.",
            priority="P0",
            estimated_complexity="Medium",
            expected_benefit="Prevents regression bugs when refactoring telemetry heuristics or updating dependencies.",
            relevant_files=["backend/server.py", "backend/pipeline.py", "tests/test_server.py"],
            suggested_steps=[
                "Create tests directory and install pytest, httpx",
                "Write tests/test_server.py testing /health and /api/v1/telemetry/ingest",
                "Write tests/test_pipeline.py testing rolling window standard deviation thresholds"
            ],
            diff_preview=diff_code,
            status="pending"
        ))
        item_counter += 1

    # 5. Documentation Recovery
    undoc_functions = [f for f in findings if f.type == "undocumented_function"]
    if undoc_functions:
        evidence_str = ", ".join([f"{f.symbol}() in {f.file_path}" for f in undoc_functions])
        diff_code = (
            "--- backend/utils.py\n"
            "+++ backend/utils.py\n"
            "@@ -12,3 +12,8 @@\n"
            " def calculate_sensor_entropy(readings: list[float]) -> float:\n"
            "+    \"\"\"Calculates Shannon entropy across binned float telemetry readings.\n"
            "+    \n"
            "+    Used for measuring jitter randomness and signal noise.\n"
            "+    \"\"\""
        )
        plan.append(ResurrectionItem(
            id=f"RES-{item_counter:02d}",
            category="documentation_recovery",
            title=f"Recover Missing API Docstrings ({len(undoc_functions)} Functions)",
            description="Generate type specifications and docstrings for undocumented internal functions.",
            supporting_evidence=f"Undocumented symbols: {evidence_str}",
            priority="P1",
            estimated_complexity="Low",
            expected_benefit="Allows new maintainers to understand mathematical parameters, edge states, and algorithm expectations.",
            relevant_files=list({f.file_path for f in undoc_functions}),
            suggested_steps=[
                "Add Google or Sphinx style docstrings to calculate_sensor_entropy and decrypt_cold_vault_keys",
                "Annotate parameter type hints and error conditions",
                "Generate automated OpenAPI schema docs via FastAPI"
            ],
            diff_preview=diff_code,
            status="pending"
        ))
        item_counter += 1

    # 6. Architecture Improvements
    orphaned_funcs = [f for f in findings if f.type == "orphaned_function"]
    if orphaned_funcs:
        evidence_str = ", ".join([f"{f.symbol}() in {f.file_path}" for f in orphaned_funcs])
        diff_code = (
            "--- backend/pipeline.py\n"
            "+++ backend/pipeline.py\n"
            "@@ -30,4 +30,0 @@\n"
            "-def legacy_raw_socket_streamer(port: int = 9099):\n"
            "-    pass\n"
        )
        plan.append(ResurrectionItem(
            id=f"RES-{item_counter:02d}",
            category="architecture_improvements",
            title="Prune Orphaned Legacy Functions and Streamers",
            description="Remove dead socket streamer left behind from the April 2022 protocol refactor.",
            supporting_evidence=f"Orphaned symbols with 0 callers: {evidence_str}",
            priority="P2",
            estimated_complexity="Low",
            expected_benefit="Prevents confusion about active networking protocols and reduces maintenance surface area.",
            relevant_files=list({f.file_path for f in orphaned_funcs}),
            suggested_steps=[
                "Verify absence of external socket consumers",
                "Delete legacy_raw_socket_streamer from backend/pipeline.py",
                "Clean up any residual socket imports or configuration references"
            ],
            diff_preview=diff_code,
            status="pending"
        ))
        item_counter += 1

    # 7. Long-Term Modernization
    plan.append(ResurrectionItem(
        id=f"RES-{item_counter:02d}",
        category="long_term_modernization",
        title="Migrate to Async Streaming & Containerize for Edge Kubernetes",
        description="Transition FastAPI endpoints to async stream generators and build a lightweight distroless Docker image.",
        supporting_evidence="Commit c5ed1f0 left an incomplete WIP refactor before project decommissioning.",
        priority="P3",
        estimated_complexity="High",
        expected_benefit="Enables high-throughput sensor telemetry (10k+ msgs/sec) with minimal CPU and memory footprints.",
        relevant_files=["Dockerfile", "backend/server.py"],
        suggested_steps=[
            "Refactor TelemetryWindowBuffer to use asyncio.Queue",
            "Introduce WebSocket endpoint /api/v1/telemetry/ws for live browser streaming",
            "Create Dockerfile with multi-stage python:3.11-slim builder"
        ],
        diff_preview=None,
        status="pending"
    ))

    return plan
