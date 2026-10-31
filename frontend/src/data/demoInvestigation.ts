import { InvestigationResult, BenchmarkResult, FileContentResponse, AiAnswerResponse } from '../types';

export const DEMO_INVESTIGATION: InvestigationResult = {
  "id": "GHOST_ARCHIVE_DEMO",
  "repo_name": "GHOST_ARCHIVE_DEMO",
  "repo_path": "C:\\Users\\RAGHURAJ P SINGH\\OneDrive\\Desktop\\AFTERLIGHT\\ghost_archive_demo",
  "is_demo": true,
  "analyzed_at": "2026-10-31 18:29:20 UTC",
  "last_commit_date": "2022-11-05T13:12:00+05:30",
  "total_files": 10,
  "total_lines_of_code": 161,
  "languages": {
    "Text": 7,
    "JSON": 10,
    "Markdown": 7,
    "Python": 101,
    "JavaScript": 36
  },
  "files_list": [
    "DEPRECATION_NOTICE.txt",
    "package.json",
    "README.md",
    "requirements.txt",
    "backend/auth_legacy.py",
    "backend/pipeline.py",
    "backend/server.py",
    "backend/utils.py",
    "frontend/app.js",
    "frontend/data_feed.js"
  ],
  "findings": [
    {
      "id": "GC-01",
      "file_path": "backend/auth_legacy.py",
      "line_number": 8,
      "line_start": 8,
      "line_end": 8,
      "symbol": "hashlib.md5",
      "type": "deprecated_crypto",
      "evidence_type": "source_code",
      "severity": "high",
      "evidence": "return hashlib.md5(raw.encode(\"utf-8\")).hexdigest()",
      "explanation": "Use of cryptographically broken hash function hashlib.md5. Susceptible to collision attacks.",
      "confidence": 0.98,
      "confidence_rationale": "AST Call node specifically references hashlib.md5 attribute in session computation.",
      "limitations": "Static analysis cannot inspect dynamic salt generation or hardware crypto offloading.",
      "recommended_action": "Migrate to hashlib.sha256() or Argon2 / HMAC for authentication tokens."
    },
    {
      "id": "GC-02",
      "file_path": "backend/auth_legacy.py",
      "line_number": 14,
      "line_start": 14,
      "line_end": 18,
      "symbol": "decrypt_cold_vault_keys",
      "type": "undocumented_function",
      "evidence_type": "source_code",
      "severity": "medium",
      "evidence": "def decrypt_cold_vault_keys(vault_path: str) -> Optional[bytes]:",
      "explanation": "Function 'decrypt_cold_vault_keys' lacks a docstring, parameter specification, and contract description.",
      "confidence": 0.9,
      "confidence_rationale": "ast.get_docstring() evaluated to None on FunctionDef node.",
      "limitations": "Inline single-line comments were present but lack structured docstring format.",
      "recommended_action": "Document parameter contracts, return types, and expected edge behavior."
    },
    {
      "id": "GC-03",
      "file_path": "backend/auth_legacy.py",
      "line_number": 5,
      "line_start": 5,
      "line_end": 5,
      "symbol": "FIXME Marker",
      "type": "todo_marker",
      "evidence_type": "source_code",
      "severity": "medium",
      "evidence": "# FIXME: Deprecated MD5 session hash. Migrate to SHA256 before production deployment.",
      "explanation": "Unresolved FIXME comment found: '# FIXME: Deprecated MD5 session hash. Migrate to SHA256 before production deployment.'. Indicates incomplete or deferred implementation.",
      "confidence": 0.99,
      "confidence_rationale": "Lexical line scan matched exact comment keyword.",
      "limitations": "Comment may be historical commentary rather than active blocker.",
      "recommended_action": "Resolve deferred FIXME task or formalize into project issue tracking."
    },
    {
      "id": "GC-04",
      "file_path": "backend/pipeline.py",
      "line_number": 29,
      "line_start": 29,
      "line_end": 38,
      "symbol": "legacy_raw_socket_streamer",
      "type": "undocumented_function",
      "evidence_type": "source_code",
      "severity": "medium",
      "evidence": "def legacy_raw_socket_streamer(port: int = 9099):",
      "explanation": "Function 'legacy_raw_socket_streamer' lacks a docstring, parameter specification, and contract description.",
      "confidence": 0.9,
      "confidence_rationale": "ast.get_docstring() evaluated to None on FunctionDef node.",
      "limitations": "Inline single-line comments were present but lack structured docstring format.",
      "recommended_action": "Document parameter contracts, return types, and expected edge behavior."
    },
    {
      "id": "GC-05",
      "file_path": "backend/pipeline.py",
      "line_number": 32,
      "line_start": 32,
      "line_end": 32,
      "symbol": "TODO Marker",
      "type": "todo_marker",
      "evidence_type": "source_code",
      "severity": "low",
      "evidence": "# TODO: remove after validating fast batch buffer integration.",
      "explanation": "Unresolved TODO comment found: '# TODO: remove after validating fast batch buffer integration.'. Indicates incomplete or deferred implementation.",
      "confidence": 0.99,
      "confidence_rationale": "Lexical line scan matched exact comment keyword.",
      "limitations": "Comment may be historical commentary rather than active blocker.",
      "recommended_action": "Resolve deferred TODO task or formalize into project issue tracking."
    },
    {
      "id": "GC-06",
      "file_path": "backend/utils.py",
      "line_number": 2,
      "line_start": 2,
      "line_end": 2,
      "symbol": "cmath",
      "type": "unused_import",
      "evidence_type": "source_code",
      "severity": "low",
      "evidence": "import cmath  # UNUSED_IMPORT",
      "explanation": "Module 'cmath' is imported but never referenced anywhere in this file.",
      "confidence": 0.95,
      "confidence_rationale": "AST Name traversal found 0 references to 'cmath' in file body after import line.",
      "limitations": "Dynamic imports via getattr() or globals() would not be reflected in lexical AST Name nodes.",
      "recommended_action": "Remove obsolete import 'cmath' to clean namespace and reduce load time."
    },
    {
      "id": "GC-07",
      "file_path": "backend/utils.py",
      "line_number": 3,
      "line_start": 3,
      "line_end": 3,
      "symbol": "ET",
      "type": "unused_import",
      "evidence_type": "source_code",
      "severity": "low",
      "evidence": "import xml.etree.ElementTree as ET  # UNUSED_IMPORT",
      "explanation": "Module 'ET' is imported but never referenced anywhere in this file.",
      "confidence": 0.95,
      "confidence_rationale": "AST Name traversal found 0 references to 'ET' in file body after import line.",
      "limitations": "Dynamic imports via getattr() or globals() would not be reflected in lexical AST Name nodes.",
      "recommended_action": "Remove obsolete import 'ET' to clean namespace and reduce load time."
    },
    {
      "id": "GC-08",
      "file_path": "backend/utils.py",
      "line_number": 11,
      "line_start": 11,
      "line_end": 26,
      "symbol": "calculate_sensor_entropy",
      "type": "undocumented_function",
      "evidence_type": "source_code",
      "severity": "medium",
      "evidence": "def calculate_sensor_entropy(readings: list[float]) -> float:",
      "explanation": "Function 'calculate_sensor_entropy' lacks a docstring, parameter specification, and contract description.",
      "confidence": 0.9,
      "confidence_rationale": "ast.get_docstring() evaluated to None on FunctionDef node.",
      "limitations": "Inline single-line comments were present but lack structured docstring format.",
      "recommended_action": "Document parameter contracts, return types, and expected edge behavior."
    },
    {
      "id": "GC-09",
      "file_path": "frontend/app.js",
      "line_number": 15,
      "line_start": 15,
      "line_end": 15,
      "symbol": "TODO Marker",
      "type": "todo_marker",
      "evidence_type": "source_code",
      "severity": "low",
      "evidence": "// TODO: remove canvas fallback once WebGL feed stabilizes",
      "explanation": "Unresolved TODO comment found: '// TODO: remove canvas fallback once WebGL feed stabilizes'. Indicates incomplete or deferred implementation.",
      "confidence": 0.99,
      "confidence_rationale": "Lexical line scan matched exact comment keyword.",
      "limitations": "Comment may be historical commentary rather than active blocker.",
      "recommended_action": "Resolve deferred TODO task or formalize into project issue tracking."
    },
    {
      "id": "GC-10",
      "file_path": "backend/auth_legacy.py",
      "line_number": 14,
      "line_start": 14,
      "line_end": 18,
      "symbol": "decrypt_cold_vault_keys",
      "type": "orphaned_function",
      "evidence_type": "source_code",
      "severity": "medium",
      "evidence": "def decrypt_cold_vault_keys(vault_path: str) -> Optional[bytes]:",
      "explanation": "Function 'decrypt_cold_vault_keys' is declared in 'backend/auth_legacy.py' but has zero internal callers across the repository.",
      "confidence": 0.9,
      "confidence_rationale": "Global cross-file AST call graph search for identifier 'decrypt_cold_vault_keys' returned 0 call sites.",
      "limitations": "Function might be called by an uninspected external consumer or dynamic reflection.",
      "recommended_action": "Confirm if 'decrypt_cold_vault_keys' is intended as an external public API or safe to prune."
    },
    {
      "id": "GC-11",
      "file_path": "backend/pipeline.py",
      "line_number": 29,
      "line_start": 29,
      "line_end": 38,
      "symbol": "legacy_raw_socket_streamer",
      "type": "orphaned_function",
      "evidence_type": "source_code",
      "severity": "medium",
      "evidence": "def legacy_raw_socket_streamer(port: int = 9099):",
      "explanation": "Function 'legacy_raw_socket_streamer' is declared in 'backend/pipeline.py' but has zero internal callers across the repository.",
      "confidence": 0.9,
      "confidence_rationale": "Global cross-file AST call graph search for identifier 'legacy_raw_socket_streamer' returned 0 call sites.",
      "limitations": "Function might be called by an uninspected external consumer or dynamic reflection.",
      "recommended_action": "Confirm if 'legacy_raw_socket_streamer' is intended as an external public API or safe to prune."
    },
    {
      "id": "GC-12",
      "file_path": "backend/utils.py",
      "line_number": 5,
      "line_start": 5,
      "line_end": 9,
      "symbol": "normalize_reading",
      "type": "orphaned_function",
      "evidence_type": "source_code",
      "severity": "medium",
      "evidence": "def normalize_reading(val: float, min_val: float, max_val: float) -> float:",
      "explanation": "Function 'normalize_reading' is declared in 'backend/utils.py' but has zero internal callers across the repository.",
      "confidence": 0.9,
      "confidence_rationale": "Global cross-file AST call graph search for identifier 'normalize_reading' returned 0 call sites.",
      "limitations": "Function might be called by an uninspected external consumer or dynamic reflection.",
      "recommended_action": "Confirm if 'normalize_reading' is intended as an external public API or safe to prune."
    },
    {
      "id": "GC-13",
      "file_path": "backend/server.py",
      "line_number": 30,
      "line_start": 30,
      "line_end": 33,
      "symbol": "get_anomalies",
      "type": "missing_test",
      "evidence_type": "source_code",
      "severity": "high",
      "evidence": "@app.get(\"/api/v1/telemetry/anomalies\")",
      "explanation": "Critical anomaly detection endpoint lacks automated unit tests or integration coverage.",
      "confidence": 0.92,
      "confidence_rationale": "Repository file list contains 0 test_*.py or spec files matching the endpoint.",
      "limitations": "Manual end-to-end testing might have been performed during edge deployments.",
      "recommended_action": "Create tests/test_server.py using pytest & TestClient to assert response schemas and edge cases."
    },
    {
      "id": "GC-14",
      "file_path": "requirements.txt",
      "line_number": 3,
      "line_start": 3,
      "line_end": 3,
      "symbol": "pydantic==1.8.2",
      "type": "deprecated_dependency",
      "evidence_type": "dependency_manifest",
      "severity": "medium",
      "evidence": "pydantic==1.8.2",
      "explanation": "Pydantic v1.8 is legacy. Modern ecosystem uses Pydantic v2 with Rust core for 5-20x speedup.",
      "confidence": 0.96,
      "confidence_rationale": "Pinned to v1.8.2; v2.0+ was released in 2023 with breaking API changes.",
      "limitations": "Migration requires updating validator syntax.",
      "recommended_action": "Migrate model definitions to Pydantic v2."
    },
    {
      "id": "GC-15",
      "file_path": "requirements.txt",
      "line_number": 4,
      "line_start": 4,
      "line_end": 4,
      "symbol": "requests==2.22.0",
      "type": "deprecated_dependency",
      "evidence_type": "dependency_manifest",
      "severity": "medium",
      "evidence": "requests==2.22.0",
      "explanation": "Requests 2.22 is unmaintained and contains deprecated SSL adapter fallbacks.",
      "confidence": 0.96,
      "confidence_rationale": "Version 2.22 was released in 2019; lacks recent HTTP connection pool fixes.",
      "limitations": "Underlying urllib3 upgrade may be needed concurrently.",
      "recommended_action": "Upgrade requests to >=2.31.0."
    },
    {
      "id": "GC-16",
      "file_path": "requirements.txt",
      "line_number": 6,
      "line_start": 6,
      "line_end": 6,
      "symbol": "urllib3==1.25.10",
      "type": "deprecated_dependency",
      "evidence_type": "dependency_manifest",
      "severity": "high",
      "evidence": "urllib3==1.25.10",
      "explanation": "Outdated urllib3 (<1.26) subject to known CVEs and incompatibility with modern OpenSSL.",
      "confidence": 0.96,
      "confidence_rationale": "Direct version pin in requirements.txt is below the security threshold (1.26.0).",
      "limitations": "Does not verify whether the vulnerable code paths are invoked at runtime.",
      "recommended_action": "Upgrade to urllib3>=2.0.0 or requests>=2.31.0."
    },
    {
      "id": "GC-17",
      "file_path": "package.json",
      "line_number": 6,
      "line_start": 6,
      "line_end": 6,
      "symbol": "chart.js (^2.9.4)",
      "type": "deprecated_dependency",
      "evidence_type": "dependency_manifest",
      "severity": "low",
      "evidence": "\"chart.js\": \"^2.9.4\",",
      "explanation": "Chart.js v2 has breaking changes compared to Chart.js v4 with modern ESM packaging.",
      "confidence": 0.95,
      "confidence_rationale": "Chart.js v2 was superseded by v3/v4 with performance rewrites.",
      "limitations": "Chart.js v2 canvas drawing code still operates if unsupported features are unused.",
      "recommended_action": "Upgrade to Chart.js v4 or Recharts/ECharts."
    },
    {
      "id": "GC-18",
      "file_path": "package.json",
      "line_number": 8,
      "line_start": 8,
      "line_end": 8,
      "symbol": "moment (^2.29.1)",
      "type": "deprecated_dependency",
      "evidence_type": "dependency_manifest",
      "severity": "medium",
      "evidence": "\"moment\": \"^2.29.1\"",
      "explanation": "Moment.js is in maintenance-only mode. The Moment team recommends against using it in new projects.",
      "confidence": 0.95,
      "confidence_rationale": "Official maintainers declared Moment.js legacy in September 2020.",
      "limitations": "Bundle size penalty (~70KB) rather than critical runtime CVE.",
      "recommended_action": "Migrate to modern tree-shakeable libraries like date-fns, Luxon, or native Intl API."
    }
  ],
  "commits": [
    {
      "hash": "c5ed1f04d840b443f3850f6c38e1b402dca3a2a9",
      "short_hash": "c5ed1f0",
      "author": "Sarah Lin",
      "email": "sarah.lin@aetherstream.dev",
      "date": "2022-11-05T13:12:00+05:30",
      "message": "WIP: abandoned refactor to v2 protocol before project decommissioning",
      "changed_files": [
        "DEPRECATION_NOTICE.txt"
      ],
      "is_architectural_milestone": true,
      "milestone_reason": "Final Recorded Activity: Last known development modification before abandonment."
    },
    {
      "hash": "43b799304142bf444094a0b240b4f9ff70b33934",
      "short_hash": "43b7993",
      "author": "Alex Chen",
      "email": "alex.chen@aetherstream.dev",
      "date": "2022-08-19T17:50:00+05:30",
      "message": "chore(legacy): temporary hotfix bypass for legacy auth; mark TODO for vault removal",
      "changed_files": [
        "backend/auth_legacy.py"
      ],
      "is_architectural_milestone": true,
      "milestone_reason": "Security Architecture: Implementation of session vault and authentication primitives."
    },
    {
      "hash": "6486e1a1c44d7338cfec41f3ccfd26c2d2a9e768",
      "short_hash": "6486e1a",
      "author": "Sarah Lin",
      "email": "sarah.lin@aetherstream.dev",
      "date": "2022-04-03T09:20:00+05:30",
      "message": "refactor(pipeline): transition to fast batch buffer; deprecate old raw socket streamer",
      "changed_files": [
        "backend/pipeline.py"
      ],
      "is_architectural_milestone": true,
      "milestone_reason": "Core Pipeline Refactor: Migration from raw sockets to telemetry batch buffer."
    },
    {
      "hash": "bcecd259658a27ab8d3fc05b9f01b5b89f3672be",
      "short_hash": "bcecd25",
      "author": "Dave Miller",
      "email": "dave.m@aetherstream.dev",
      "date": "2022-01-10T16:45:00+05:30",
      "message": "feat(web): add dashboard live-feed visualizer with canvas radar",
      "changed_files": [
        "frontend/app.js",
        "frontend/data_feed.js",
        "package.json"
      ],
      "is_architectural_milestone": true,
      "milestone_reason": "Interface Expansion: Integration of real-time monitoring visualizer."
    },
    {
      "hash": "c0640988ff08556ff598b2b2c732e0f1b2890608",
      "short_hash": "c064098",
      "author": "Alex Chen",
      "email": "alex.chen@aetherstream.dev",
      "date": "2021-09-15T11:05:00+05:30",
      "message": "feat(security): implement session handshake and token vault",
      "changed_files": [
        "backend/auth_legacy.py",
        "backend/server.py"
      ],
      "is_architectural_milestone": true,
      "milestone_reason": "Security Architecture: Implementation of session vault and authentication primitives."
    },
    {
      "hash": "8533af9fecd8de375652353ac222eef9d684cb8a",
      "short_hash": "8533af9",
      "author": "Sarah Lin",
      "email": "sarah.lin@aetherstream.dev",
      "date": "2021-06-20T14:32:00+05:30",
      "message": "feat(ingest): add rolling window buffer and anomaly detection heuristic",
      "changed_files": [
        "backend/pipeline.py"
      ],
      "is_architectural_milestone": false,
      "milestone_reason": null
    },
    {
      "hash": "38eadad44eacb8d59f87b4296720e032a1ffd956",
      "short_hash": "38eadad",
      "author": "Sarah Lin",
      "email": "sarah.lin@aetherstream.dev",
      "date": "2021-04-12T10:14:00+05:30",
      "message": "Init repo: ChronoLog Edge Telemetry Ingestion Core",
      "changed_files": [],
      "is_architectural_milestone": true,
      "milestone_reason": "Genesis Commit: Initial repository scaffolding and architecture creation."
    }
  ],
  "architecture": {
    "nodes": [
      {
        "id": "mod:DEPRECATION_NOTICE.txt",
        "label": "DEPRECATION_NOTICE.txt",
        "type": "module",
        "file_path": "DEPRECATION_NOTICE.txt",
        "ghost_status": false,
        "ghost_finding_id": null,
        "loc": 0
      },
      {
        "id": "mod:package.json",
        "label": "package.json",
        "type": "module",
        "file_path": "package.json",
        "ghost_status": false,
        "ghost_finding_id": null,
        "loc": 0
      },
      {
        "id": "mod:README.md",
        "label": "README.md",
        "type": "module",
        "file_path": "README.md",
        "ghost_status": false,
        "ghost_finding_id": null,
        "loc": 0
      },
      {
        "id": "mod:requirements.txt",
        "label": "requirements.txt",
        "type": "module",
        "file_path": "requirements.txt",
        "ghost_status": false,
        "ghost_finding_id": null,
        "loc": 0
      },
      {
        "id": "mod:backend/auth_legacy.py",
        "label": "auth_legacy.py",
        "type": "module",
        "file_path": "backend/auth_legacy.py",
        "ghost_status": false,
        "ghost_finding_id": null,
        "loc": 0
      },
      {
        "id": "fn:backend/auth_legacy.py:compute_legacy_session_digest",
        "label": "compute_legacy_session_digest()",
        "type": "function",
        "file_path": "backend/auth_legacy.py",
        "ghost_status": false,
        "ghost_finding_id": null,
        "loc": 3
      },
      {
        "id": "fn:backend/auth_legacy.py:verify_station_token",
        "label": "verify_station_token()",
        "type": "function",
        "file_path": "backend/auth_legacy.py",
        "ghost_status": false,
        "ghost_finding_id": null,
        "loc": 3
      },
      {
        "id": "fn:backend/auth_legacy.py:decrypt_cold_vault_keys",
        "label": "decrypt_cold_vault_keys()",
        "type": "function",
        "file_path": "backend/auth_legacy.py",
        "ghost_status": false,
        "ghost_finding_id": null,
        "loc": 5
      },
      {
        "id": "mod:backend/pipeline.py",
        "label": "pipeline.py",
        "type": "module",
        "file_path": "backend/pipeline.py",
        "ghost_status": false,
        "ghost_finding_id": null,
        "loc": 0
      },
      {
        "id": "fn:backend/pipeline.py:legacy_raw_socket_streamer",
        "label": "legacy_raw_socket_streamer()",
        "type": "function",
        "file_path": "backend/pipeline.py",
        "ghost_status": false,
        "ghost_finding_id": null,
        "loc": 10
      },
      {
        "id": "mod:backend/server.py",
        "label": "server.py",
        "type": "module",
        "file_path": "backend/server.py",
        "ghost_status": false,
        "ghost_finding_id": null,
        "loc": 0
      },
      {
        "id": "fn:backend/server.py:health",
        "label": "health()",
        "type": "function",
        "file_path": "backend/server.py",
        "ghost_status": false,
        "ghost_finding_id": null,
        "loc": 2
      },
      {
        "id": "fn:backend/server.py:ingest_telemetry",
        "label": "ingest_telemetry()",
        "type": "function",
        "file_path": "backend/server.py",
        "ghost_status": false,
        "ghost_finding_id": null,
        "loc": 6
      },
      {
        "id": "fn:backend/server.py:get_anomalies",
        "label": "get_anomalies()",
        "type": "function",
        "file_path": "backend/server.py",
        "ghost_status": false,
        "ghost_finding_id": null,
        "loc": 3
      },
      {
        "id": "mod:backend/utils.py",
        "label": "utils.py",
        "type": "module",
        "file_path": "backend/utils.py",
        "ghost_status": false,
        "ghost_finding_id": null,
        "loc": 0
      },
      {
        "id": "fn:backend/utils.py:normalize_reading",
        "label": "normalize_reading()",
        "type": "function",
        "file_path": "backend/utils.py",
        "ghost_status": false,
        "ghost_finding_id": null,
        "loc": 5
      },
      {
        "id": "fn:backend/utils.py:calculate_sensor_entropy",
        "label": "calculate_sensor_entropy()",
        "type": "function",
        "file_path": "backend/utils.py",
        "ghost_status": false,
        "ghost_finding_id": null,
        "loc": 16
      },
      {
        "id": "mod:frontend/app.js",
        "label": "app.js",
        "type": "module",
        "file_path": "frontend/app.js",
        "ghost_status": false,
        "ghost_finding_id": null,
        "loc": 0
      },
      {
        "id": "mod:frontend/data_feed.js",
        "label": "data_feed.js",
        "type": "module",
        "file_path": "frontend/data_feed.js",
        "ghost_status": false,
        "ghost_finding_id": null,
        "loc": 0
      }
    ],
    "edges": [
      {
        "source": "mod:backend/auth_legacy.py",
        "target": "mod:typing.py",
        "relationship": "imports"
      },
      {
        "source": "mod:backend/auth_legacy.py",
        "target": "fn:backend/auth_legacy.py:compute_legacy_session_digest",
        "relationship": "defines"
      },
      {
        "source": "mod:backend/auth_legacy.py",
        "target": "fn:backend/auth_legacy.py:verify_station_token",
        "relationship": "defines"
      },
      {
        "source": "mod:backend/auth_legacy.py",
        "target": "fn:backend/auth_legacy.py:decrypt_cold_vault_keys",
        "relationship": "defines"
      },
      {
        "source": "mod:backend/pipeline.py",
        "target": "mod:typing.py",
        "relationship": "imports"
      },
      {
        "source": "mod:backend/pipeline.py",
        "target": "mod:typing.py",
        "relationship": "imports"
      },
      {
        "source": "mod:backend/pipeline.py",
        "target": "mod:typing.py",
        "relationship": "imports"
      },
      {
        "source": "mod:backend/pipeline.py",
        "target": "fn:backend/pipeline.py:legacy_raw_socket_streamer",
        "relationship": "defines"
      },
      {
        "source": "mod:backend/server.py",
        "target": "mod:fastapi.py",
        "relationship": "imports"
      },
      {
        "source": "mod:backend/server.py",
        "target": "mod:fastapi.py",
        "relationship": "imports"
      },
      {
        "source": "mod:backend/server.py",
        "target": "mod:fastapi.py",
        "relationship": "imports"
      },
      {
        "source": "mod:backend/server.py",
        "target": "mod:pydantic.py",
        "relationship": "imports"
      },
      {
        "source": "mod:backend/server.py",
        "target": "mod:typing.py",
        "relationship": "imports"
      },
      {
        "source": "mod:backend/server.py",
        "target": "mod:typing.py",
        "relationship": "imports"
      },
      {
        "source": "mod:backend/server.py",
        "target": "mod:typing.py",
        "relationship": "imports"
      },
      {
        "source": "mod:backend/server.py",
        "target": "mod:typing.py",
        "relationship": "imports"
      },
      {
        "source": "mod:backend/server.py",
        "target": "mod:pipeline.py",
        "relationship": "imports"
      },
      {
        "source": "mod:backend/server.py",
        "target": "mod:auth_legacy.py",
        "relationship": "imports"
      },
      {
        "source": "mod:backend/server.py",
        "target": "mod:auth_legacy.py",
        "relationship": "imports"
      },
      {
        "source": "mod:backend/server.py",
        "target": "fn:backend/server.py:health",
        "relationship": "defines"
      },
      {
        "source": "mod:backend/server.py",
        "target": "fn:backend/server.py:ingest_telemetry",
        "relationship": "defines"
      },
      {
        "source": "mod:backend/server.py",
        "target": "fn:backend/server.py:get_anomalies",
        "relationship": "defines"
      },
      {
        "source": "mod:backend/utils.py",
        "target": "fn:backend/utils.py:normalize_reading",
        "relationship": "defines"
      },
      {
        "source": "mod:backend/utils.py",
        "target": "fn:backend/utils.py:calculate_sensor_entropy",
        "relationship": "defines"
      }
    ]
  },
  "health": {
    "overall_score": 35,
    "documentation_score": 60,
    "test_score": 10,
    "dependency_score": 20,
    "clean_code_score": 10,
    "commit_vitality_score": 80,
    "formula_explanation": "Overall Health = (0.25 \u00d7 DocScore) + (0.20 \u00d7 TestScore) + (0.20 \u00d7 DepScore) + (0.20 \u00d7 CleanScore) + (0.15 \u00d7 VitalityScore)",
    "inputs_breakdown": {
      "readme_detected": true,
      "undocumented_functions_count": 3,
      "test_files_count": 0,
      "missing_tests_flagged": 1,
      "deprecated_dependencies_count": 5,
      "deprecated_crypto_count": 1,
      "orphaned_functions_count": 3,
      "total_commits_evaluated": 7,
      "distinct_contributors": 3
    }
  },
  "resurrection_plan": [
    {
      "id": "RES-01",
      "category": "critical_discoveries",
      "title": "Replace Broken Cryptographic Digest: hashlib.md5",
      "description": "The legacy session digest uses MD5 which is vulnerable to collision attacks. It must be upgraded to SHA-256 or HMAC before running in production.",
      "supporting_evidence": "backend/auth_legacy.py:8 -> return hashlib.md5(raw.encode(\"utf-8\")).hexdigest()",
      "priority": "P0",
      "estimated_complexity": "Low",
      "expected_benefit": "Guarantees cryptographic integrity of edge station session tokens; blocks collision forgery.",
      "relevant_files": [
        "backend/auth_legacy.py"
      ],
      "suggested_steps": [
        "Import hashlib and hmac in auth_legacy.py",
        "Update compute_legacy_session_digest to use HMAC-SHA256",
        "Ensure client stations submit updated digest format or provision backward-compatible grace period"
      ],
      "diff_preview": "--- backend/auth_legacy.py\n+++ backend/auth_legacy.py\n@@ -6,3 +6,4 @@\n-    return hashlib.md5(raw.encode('utf-8')).hexdigest()\n+    import hmac\n+    return hmac.new(secret_key.encode('utf-8'), device_id.encode('utf-8'), hashlib.sha256).hexdigest()",
      "status": "pending"
    },
    {
      "id": "RES-02",
      "category": "immediate_maintenance",
      "title": "Prune Dead and Unused Import Declarations",
      "description": "Remove unreferenced standard library and third-party imports (2 occurrences detected).",
      "supporting_evidence": "cmath in backend/utils.py:2; ET in backend/utils.py:3",
      "priority": "P2",
      "estimated_complexity": "Low",
      "expected_benefit": "Eliminates namespace clutter, avoids memory overhead, and speeds up module import time.",
      "relevant_files": [
        "backend/utils.py"
      ],
      "suggested_steps": [
        "Remove 'import cmath' from backend/utils.py",
        "Remove 'import xml.etree.ElementTree as ET' from backend/utils.py",
        "Configure ruff or flake8 in CI to prevent unused imports"
      ],
      "diff_preview": "--- backend/utils.py\n+++ backend/utils.py\n@@ -2,2 +2,0 @@\n-import cmath\n-import xml.etree.ElementTree as ET\n",
      "status": "pending"
    },
    {
      "id": "RES-03",
      "category": "security_dependencies",
      "title": "Patch Outdated Python Dependencies & CVE Exposures",
      "description": "Upgrade urllib3, pydantic, and requests to modern secure releases.",
      "supporting_evidence": "pydantic==1.8.2 (medium); requests==2.22.0 (medium); urllib3==1.25.10 (high)",
      "priority": "P1",
      "estimated_complexity": "Medium",
      "expected_benefit": "Eliminates known SSL/TLS vulnerabilities in urllib3 and leverages Pydantic v2 performance.",
      "relevant_files": [
        "requirements.txt"
      ],
      "suggested_steps": [
        "Bump urllib3 to >=2.2.0 in requirements.txt",
        "Bump pydantic to >=2.7.0 and run migration linter for BaseModel syntax",
        "Run pip-audit to verify zero remaining CVEs"
      ],
      "diff_preview": "--- requirements.txt\n+++ requirements.txt\n@@ -1,6 +1,6 @@\n-fastapi==0.68.0\n-pydantic==1.8.2\n-urllib3==1.25.10\n+fastapi>=0.110.0\n+pydantic>=2.7.0\n+urllib3>=2.2.0\n",
      "status": "pending"
    },
    {
      "id": "RES-04",
      "category": "security_dependencies",
      "title": "Replace Unmaintained Moment.js in Frontend",
      "description": "Moment.js is officially in maintenance mode and adds excessive bundle bloat.",
      "supporting_evidence": "package.json: moment ^2.29.1",
      "priority": "P2",
      "estimated_complexity": "Low",
      "expected_benefit": "Reduces frontend bundle size by ~70KB; enables modern tree-shaking.",
      "relevant_files": [
        "package.json",
        "frontend/app.js"
      ],
      "suggested_steps": [
        "Uninstall moment via npm uninstall moment",
        "Install date-fns or adopt native JavaScript Intl.DateTimeFormat",
        "Refactor timestamp formatting calls in frontend/app.js"
      ],
      "diff_preview": null,
      "status": "pending"
    },
    {
      "id": "RES-05",
      "category": "missing_tests",
      "title": "Implement Automated Test Harness for Anomaly Pipeline",
      "description": "Create end-to-end unit and integration tests covering the ingestion buffer and threshold calculations.",
      "supporting_evidence": "Zero automated test files detected in repository; core API routes are unverified.",
      "priority": "P0",
      "estimated_complexity": "Medium",
      "expected_benefit": "Prevents regression bugs when refactoring telemetry heuristics or updating dependencies.",
      "relevant_files": [
        "backend/server.py",
        "backend/pipeline.py",
        "tests/test_server.py"
      ],
      "suggested_steps": [
        "Create tests directory and install pytest, httpx",
        "Write tests/test_server.py testing /health and /api/v1/telemetry/ingest",
        "Write tests/test_pipeline.py testing rolling window standard deviation thresholds"
      ],
      "diff_preview": "--- /dev/null\n+++ tests/test_server.py\n@@ -0,0 +1,15 @@\n+from fastapi.testclient import TestClient\n+from backend.server import app\n+\n+client = TestClient(app)\n+\n+def test_anomaly_endpoint():\n+    res = client.get('/api/v1/telemetry/anomalies')\n+    assert res.status_code == 200\n+    assert 'anomalies' in res.json()",
      "status": "pending"
    },
    {
      "id": "RES-06",
      "category": "documentation_recovery",
      "title": "Recover Missing API Docstrings (3 Functions)",
      "description": "Generate type specifications and docstrings for undocumented internal functions.",
      "supporting_evidence": "Undocumented symbols: decrypt_cold_vault_keys() in backend/auth_legacy.py, legacy_raw_socket_streamer() in backend/pipeline.py, calculate_sensor_entropy() in backend/utils.py",
      "priority": "P1",
      "estimated_complexity": "Low",
      "expected_benefit": "Allows new maintainers to understand mathematical parameters, edge states, and algorithm expectations.",
      "relevant_files": [
        "backend/auth_legacy.py",
        "backend/pipeline.py",
        "backend/utils.py"
      ],
      "suggested_steps": [
        "Add Google or Sphinx style docstrings to calculate_sensor_entropy and decrypt_cold_vault_keys",
        "Annotate parameter type hints and error conditions",
        "Generate automated OpenAPI schema docs via FastAPI"
      ],
      "diff_preview": "--- backend/utils.py\n+++ backend/utils.py\n@@ -12,3 +12,8 @@\n def calculate_sensor_entropy(readings: list[float]) -> float:\n+    \"\"\"Calculates Shannon entropy across binned float telemetry readings.\n+    \n+    Used for measuring jitter randomness and signal noise.\n+    \"\"\"",
      "status": "pending"
    },
    {
      "id": "RES-07",
      "category": "architecture_improvements",
      "title": "Prune Orphaned Legacy Functions and Streamers",
      "description": "Remove dead socket streamer left behind from the April 2022 protocol refactor.",
      "supporting_evidence": "Orphaned symbols with 0 callers: decrypt_cold_vault_keys() in backend/auth_legacy.py, legacy_raw_socket_streamer() in backend/pipeline.py, normalize_reading() in backend/utils.py",
      "priority": "P2",
      "estimated_complexity": "Low",
      "expected_benefit": "Prevents confusion about active networking protocols and reduces maintenance surface area.",
      "relevant_files": [
        "backend/auth_legacy.py",
        "backend/pipeline.py",
        "backend/utils.py"
      ],
      "suggested_steps": [
        "Verify absence of external socket consumers",
        "Delete legacy_raw_socket_streamer from backend/pipeline.py",
        "Clean up any residual socket imports or configuration references"
      ],
      "diff_preview": "--- backend/pipeline.py\n+++ backend/pipeline.py\n@@ -30,4 +30,0 @@\n-def legacy_raw_socket_streamer(port: int = 9099):\n-    pass\n",
      "status": "pending"
    },
    {
      "id": "RES-08",
      "category": "long_term_modernization",
      "title": "Migrate to Async Streaming & Containerize for Edge Kubernetes",
      "description": "Transition FastAPI endpoints to async stream generators and build a lightweight distroless Docker image.",
      "supporting_evidence": "Commit c5ed1f0 left an incomplete WIP refactor before project decommissioning.",
      "priority": "P3",
      "estimated_complexity": "High",
      "expected_benefit": "Enables high-throughput sensor telemetry (10k+ msgs/sec) with minimal CPU and memory footprints.",
      "relevant_files": [
        "Dockerfile",
        "backend/server.py"
      ],
      "suggested_steps": [
        "Refactor TelemetryWindowBuffer to use asyncio.Queue",
        "Introduce WebSocket endpoint /api/v1/telemetry/ws for live browser streaming",
        "Create Dockerfile with multi-stage python:3.11-slim builder"
      ],
      "diff_preview": null,
      "status": "pending"
    }
  ],
  "missions": [
    {
      "id": "GH-01",
      "title": "The Mystery of the Broken Hash",
      "difficulty": "Novice",
      "description": "A cryptographic relic from the past remains active in the authentication pipeline. Investigate the security vulnerability and trace the file where it resides.",
      "clue": "Inspect backend/auth_legacy.py for hash functions commonly broken by collision attacks (MD5/SHA1).",
      "target_finding_id": "GC-01",
      "completed": false,
      "badge": "Cryptographic Sleuth"
    },
    {
      "id": "GH-02",
      "title": "The Forgotten Socket Streamer",
      "difficulty": "Adept",
      "description": "During a historical refactor, an entire raw socket function was orphaned. Find the abandoned function that has zero remaining callers.",
      "clue": "Search pipeline.py for functions declared with 'def legacy_' that are never invoked by server.py.",
      "target_finding_id": "GC-10",
      "completed": false,
      "badge": "Architecture Detective"
    },
    {
      "id": "GH-03",
      "title": "The Vulnerable Dependency Phantom",
      "difficulty": "Master",
      "description": "A package in requirements.txt is severely outdated and exposes the application to TLS vulnerabilities.",
      "clue": "Look for a major HTTP transport library pinned to version 1.25.x.",
      "target_finding_id": "GC-16",
      "completed": false,
      "badge": "Vulnerability Exorcist"
    },
    {
      "id": "GH-04",
      "title": "The Unshielded Anomaly Heuristic",
      "difficulty": "Adept",
      "description": "A critical API route computes statistical anomalies for weather stations without a single automated unit test.",
      "clue": "Inspect server.py endpoints for missing test harnesses in tests/.",
      "target_finding_id": "GC-13",
      "completed": false,
      "badge": "Guardian of Code"
    }
  ],
  "hypothesis_timeline": [
    {
      "id": "HYP-01",
      "epoch": "Genesis & Core Telemetry Buffer (April 2021)",
      "observed_fact": "Commit 38eadad initialized repository with README.md declaring 'ChronoLog / AetherStream Edge Telemetry Core' and backend/utils.py math helpers.",
      "inferred_hypothesis": "The project was originally architected as an edge daemon running on Alpine Linux ARM64 hardware to capture micro-meteorological sensor metrics (temperature, pressure, humidity) at weather stations.",
      "source_files": [
        "README.md",
        "backend/utils.py",
        "requirements.txt"
      ],
      "commit_hashes": [
        "38eadad44eacb8d59f87b4296720e032a1ffd956"
      ],
      "uncertainty_notes": "Exact remote station hardware models and physical sensor buses (I2C/SPI) are not explicitly documented.",
      "confidence": 0.98
    },
    {
      "id": "HYP-02",
      "epoch": "Rolling Window Anomaly Engine (June 2021)",
      "observed_fact": "TelemetryWindowBuffer implemented in backend/pipeline.py computes running mean, variance, and flags points exceeding 2.5 standard deviations.",
      "inferred_hypothesis": "The edge service evaluated meteorological signal stability locally, buffering only anomalous spikes for priority transmission to avoid saturating low-bandwidth satellite / edge links.",
      "source_files": [
        "backend/pipeline.py"
      ],
      "commit_hashes": [
        "8533af9fecd8de375652353ac222eef9d684cb8a"
      ],
      "uncertainty_notes": "Fixed threshold_sigma=2.5 lacks auto-calibration logic or automated test verification.",
      "confidence": 0.95
    },
    {
      "id": "HYP-03",
      "epoch": "Network Handshake & Technical Debt Ingestion (Sept 2021 - Jan 2022)",
      "observed_fact": "FastAPI routing added in backend/server.py with station token verification. Insecure MD5 session hashing implemented in backend/auth_legacy.py with an unresolved FIXME comment. Canvas live visualizer added in frontend/app.js.",
      "inferred_hypothesis": "As contributors Alex Chen and Dave Miller joined, network connectivity and operator monitoring screens were rapidly integrated. The MD5 hashing and unverified cold vault key function were temporary prototype placeholders that were never properly modernized.",
      "source_files": [
        "backend/auth_legacy.py",
        "backend/server.py",
        "frontend/app.js"
      ],
      "commit_hashes": [
        "43b799304142bf444094a0b240b4f9ff70b33934",
        "bcecd259658a27ab8d3fc05b9f01b5b89f3672be"
      ],
      "uncertainty_notes": "Whether the cold vault recovery function was ever invoked out-of-band by operator CLI scripts is uncertain.",
      "confidence": 0.94
    },
    {
      "id": "HYP-04",
      "epoch": "Protocol Refactor & Project Abandonment (April 2022 - Nov 2022)",
      "observed_fact": "Commit 6486e1a added fast batch processing while orphaning legacy_raw_socket_streamer. Final commit c5ed1f0 left DEPRECATION_NOTICE.txt confirming project decommissioning and team reassignment.",
      "inferred_hypothesis": "An architectural migration to high-throughput batch buffers was in progress when corporate/team priorities shifted, resulting in the code being abandoned in an unmaintained, partially-migrated state.",
      "source_files": [
        "backend/pipeline.py",
        "DEPRECATION_NOTICE.txt"
      ],
      "commit_hashes": [
        "c5ed1f04d840b443f3850f6c38e1b402dca3a2a9",
        "c5ed1f04d840b443f3850f6c38e1b402dca3a2a9"
      ],
      "uncertainty_notes": "Zero residual uncertainty on abandonment; confirmed by official deprecation notice file and 4+ years of Git dormancy.",
      "confidence": 0.99
    }
  ],
  "offline_mode": true,
  "active_ai_model": "Gemma 2B (Local Ollama) & Deterministic Fallback"
};

export const DEMO_BENCHMARK: BenchmarkResult = {
  "benchmark_type": "synthetic_ghost_archive",
  "status": "completed",
  "total_ground_truth_targets": 10,
  "total_expected": 10,
  "total_detected": 8,
  "true_positives": 7,
  "false_positives": 1,
  "false_negatives": 3,
  "precision": 0.917,
  "recall": 0.733,
  "f1_score": 0.815,
  "citation_coverage_pct": 100.0,
  "source_citation_coverage": 1.0,
  "commit_citation_coverage": 1.0,
  "execution_time_ms": 396.4,
  "latency_ms": 396.4,
  "target_matches": [
    "GT-01",
    "GT-02",
    "GT-03",
    "GT-04",
    "GT-05",
    "GT-06",
    "GT-07"
  ],
  "evaluation_timestamp": "2026-10-31 18:29:20 UTC",
  "details": "Automated synthetic benchmark evaluation against GHOST_ARCHIVE_DEMO ground truth."
};

export const DEMO_FILE_CONTENTS: Record<string, FileContentResponse> = {
  "README.md": {
    "file_path": "README.md",
    "total_lines": 10,
    "content": "# ChronoLog / AetherStream Edge Telemetry Core\n\n> Notice: Internal prototype for atmospheric weather stations and forensic telemetry buffering.\n\n## Overview\nA lightweight telemetry ingestion service that captures micro-meteorological sensor metrics,\nevaluates temporal rolling window anomalies, and archives structured signals for offline research.\n\n## Status\nPrototype phase. Edge deployment target: Alpine Linux on ARM64 nodes.\n",
    "lines": [
      "# ChronoLog / AetherStream Edge Telemetry Core",
      "",
      "> Notice: Internal prototype for atmospheric weather stations and forensic telemetry buffering.",
      "",
      "## Overview",
      "A lightweight telemetry ingestion service that captures micro-meteorological sensor metrics,",
      "evaluates temporal rolling window anomalies, and archives structured signals for offline research.",
      "",
      "## Status",
      "Prototype phase. Edge deployment target: Alpine Linux on ARM64 nodes."
    ]
  },
  "requirements.txt": {
    "file_path": "requirements.txt",
    "total_lines": 6,
    "content": "fastapi==0.68.0\nuvicorn==0.15.0\npydantic==1.8.2\nrequests==2.22.0\nnumpy==1.19.5\nurllib3==1.25.10\n",
    "lines": [
      "fastapi==0.68.0",
      "uvicorn==0.15.0",
      "pydantic==1.8.2",
      "requests==2.22.0",
      "numpy==1.19.5",
      "urllib3==1.25.10"
    ]
  },
  "package.json": {
    "file_path": "package.json",
    "total_lines": 10,
    "content": "{\n  \"name\": \"chronolog-edge-visualizer\",\n  \"version\": \"0.2.0\",\n  \"description\": \"Live canvas feed and radar monitor for atmospheric sensors\",\n  \"dependencies\": {\n    \"chart.js\": \"^2.9.4\",\n    \"axios\": \"^0.21.1\",\n    \"moment\": \"^2.29.1\"\n  }\n}\n",
    "lines": [
      "{",
      "  \"name\": \"chronolog-edge-visualizer\",",
      "  \"version\": \"0.2.0\",",
      "  \"description\": \"Live canvas feed and radar monitor for atmospheric sensors\",",
      "  \"dependencies\": {",
      "    \"chart.js\": \"^2.9.4\",",
      "    \"axios\": \"^0.21.1\",",
      "    \"moment\": \"^2.29.1\"",
      "  }",
      "}"
    ]
  },
  "DEPRECATION_NOTICE.txt": {
    "file_path": "DEPRECATION_NOTICE.txt",
    "total_lines": 1,
    "content": "NOTICE: Project ChronoLog decommissioned in Nov 2022. Team transferred to Cloud telemetry unit.",
    "lines": [
      "NOTICE: Project ChronoLog decommissioned in Nov 2022. Team transferred to Cloud telemetry unit."
    ]
  },
  "backend/auth_legacy.py": {
    "file_path": "backend/auth_legacy.py",
    "total_lines": 21,
    "content": "import hashlib\nimport secrets\nfrom typing import Optional\n\n# FIXME: Deprecated MD5 session hash. Migrate to SHA256 before production deployment.\ndef compute_legacy_session_digest(device_id: str, secret_key: str) -> str:\n    raw = f\"{device_id}::{secret_key}\"\n    return hashlib.md5(raw.encode(\"utf-8\")).hexdigest()\n\ndef verify_station_token(provided_token: str, expected_token: str) -> bool:\n    \"\"\"Constant-time string comparison for device authentication.\"\"\"\n    return secrets.compare_digest(provided_token, expected_token)\n\ndef decrypt_cold_vault_keys(vault_path: str) -> Optional[bytes]:\n    # UNDOCUMENTED_FUNCTION: Secret recovery function left during cloud sync design.\n    # Never connected to router endpoints.\n    # WARNING: Relies on local unencrypted path.\n    return None\n\n# Hotfix 2022-08-19: Temporary dev token bypass\nDEV_DEBUG_OVERRIDE = False  # DO NOT ENABLE IN PRODUCTION\n",
    "lines": [
      "import hashlib",
      "import secrets",
      "from typing import Optional",
      "",
      "# FIXME: Deprecated MD5 session hash. Migrate to SHA256 before production deployment.",
      "def compute_legacy_session_digest(device_id: str, secret_key: str) -> str:",
      "    raw = f\"{device_id}::{secret_key}\"",
      "    return hashlib.md5(raw.encode(\"utf-8\")).hexdigest()",
      "",
      "def verify_station_token(provided_token: str, expected_token: str) -> bool:",
      "    \"\"\"Constant-time string comparison for device authentication.\"\"\"",
      "    return secrets.compare_digest(provided_token, expected_token)",
      "",
      "def decrypt_cold_vault_keys(vault_path: str) -> Optional[bytes]:",
      "    # UNDOCUMENTED_FUNCTION: Secret recovery function left during cloud sync design.",
      "    # Never connected to router endpoints.",
      "    # WARNING: Relies on local unencrypted path.",
      "    return None",
      "",
      "# Hotfix 2022-08-19: Temporary dev token bypass",
      "DEV_DEBUG_OVERRIDE = False  # DO NOT ENABLE IN PRODUCTION"
    ]
  },
  "backend/pipeline.py": {
    "file_path": "backend/pipeline.py",
    "total_lines": 38,
    "content": "from typing import List, Dict, Any\nimport time\n\nclass TelemetryWindowBuffer:\n    \"\"\"Rolling memory window to track atmospheric pressure, temperature, and humidity.\"\"\"\n    def __init__(self, capacity: int = 50):\n        self.capacity = capacity\n        self.readings: List[Dict[str, Any]] = []\n\n    def push(self, telemetry_point: Dict[str, Any]):\n        self.readings.append(telemetry_point)\n        if len(self.readings) > self.capacity:\n            self.readings.pop(0)\n\n    def detect_anomalies(self, threshold_sigma: float = 2.5) -> List[Dict[str, Any]]:\n        \"\"\"Identifies values exceeding running standard deviation threshold.\"\"\"\n        if len(self.readings) < 5:\n            return []\n        temps = [r.get(\"temp\", 0.0) for r in self.readings]\n        avg = sum(temps) / len(temps)\n        variance = sum((t - avg) ** 2 for t in temps) / len(temps)\n        std_dev = variance ** 0.5\n        anomalies = []\n        for r in self.readings:\n            if abs(r.get(\"temp\", 0.0) - avg) > (threshold_sigma * std_dev):\n                anomalies.append({**r, \"deviation\": abs(r.get(\"temp\", 0.0) - avg)})\n        return anomalies\n\ndef legacy_raw_socket_streamer(port: int = 9099):\n    # ORPHANED_MODULE_FUNCTION: Was used in early prototype to blast binary packets over raw TCP.\n    # No callers remain after HTTP API adoption.\n    # TODO: remove after validating fast batch buffer integration.\n    pass\n\n    def batch_process(self, chunk: List[Dict[str, Any]]):\n        \"\"\"Processes an incoming micro-batch of telemetry.\"\"\"\n        for item in chunk:\n            self.push(item)\n",
    "lines": [
      "from typing import List, Dict, Any",
      "import time",
      "",
      "class TelemetryWindowBuffer:",
      "    \"\"\"Rolling memory window to track atmospheric pressure, temperature, and humidity.\"\"\"",
      "    def __init__(self, capacity: int = 50):",
      "        self.capacity = capacity",
      "        self.readings: List[Dict[str, Any]] = []",
      "",
      "    def push(self, telemetry_point: Dict[str, Any]):",
      "        self.readings.append(telemetry_point)",
      "        if len(self.readings) > self.capacity:",
      "            self.readings.pop(0)",
      "",
      "    def detect_anomalies(self, threshold_sigma: float = 2.5) -> List[Dict[str, Any]]:",
      "        \"\"\"Identifies values exceeding running standard deviation threshold.\"\"\"",
      "        if len(self.readings) < 5:",
      "            return []",
      "        temps = [r.get(\"temp\", 0.0) for r in self.readings]",
      "        avg = sum(temps) / len(temps)",
      "        variance = sum((t - avg) ** 2 for t in temps) / len(temps)",
      "        std_dev = variance ** 0.5",
      "        anomalies = []",
      "        for r in self.readings:",
      "            if abs(r.get(\"temp\", 0.0) - avg) > (threshold_sigma * std_dev):",
      "                anomalies.append({**r, \"deviation\": abs(r.get(\"temp\", 0.0) - avg)})",
      "        return anomalies",
      "",
      "def legacy_raw_socket_streamer(port: int = 9099):",
      "    # ORPHANED_MODULE_FUNCTION: Was used in early prototype to blast binary packets over raw TCP.",
      "    # No callers remain after HTTP API adoption.",
      "    # TODO: remove after validating fast batch buffer integration.",
      "    pass",
      "",
      "    def batch_process(self, chunk: List[Dict[str, Any]]):",
      "        \"\"\"Processes an incoming micro-batch of telemetry.\"\"\"",
      "        for item in chunk:",
      "            self.push(item)"
    ]
  },
  "backend/server.py": {
    "file_path": "backend/server.py",
    "total_lines": 32,
    "content": "from fastapi import FastAPI, HTTPException, Header\nfrom pydantic import BaseModel\nfrom typing import Optional, List, Dict, Any\nfrom .pipeline import TelemetryWindowBuffer\nfrom .auth_legacy import verify_station_token, compute_legacy_session_digest\n\napp = FastAPI(title=\"ChronoLog Edge Ingest\", version=\"0.4.1\")\nbuffer = TelemetryWindowBuffer(capacity=100)\n\nclass TelemetryPayload(BaseModel):\n    station_id: str\n    timestamp: float\n    temperature: float\n    humidity: float\n    barometric_pressure: float\n\n@app.get(\"/health\")\ndef health():\n    return {\"status\": \"alive\", \"engine\": \"ChronoLog-0.4.1\"}\n\n@app.post(\"/api/v1/telemetry/ingest\")\ndef ingest_telemetry(payload: TelemetryPayload, x_station_token: Optional[str] = Header(None)):\n    if not x_station_token or not verify_station_token(x_station_token, \"EDGE_SECRET_KEY_PROD_1\"):\n        raise HTTPException(status_code=401, detail=\"Unauthorized edge station\")\n    data = payload.dict()\n    buffer.push(data)\n    return {\"accepted\": True, \"buffered_count\": len(buffer.readings)}\n\n@app.get(\"/api/v1/telemetry/anomalies\")\ndef get_anomalies():\n    # MISSING_TEST: No unit test exists for anomaly detection threshold logic!\n    return {\"anomalies\": buffer.detect_anomalies()}\n",
    "lines": [
      "from fastapi import FastAPI, HTTPException, Header",
      "from pydantic import BaseModel",
      "from typing import Optional, List, Dict, Any",
      "from .pipeline import TelemetryWindowBuffer",
      "from .auth_legacy import verify_station_token, compute_legacy_session_digest",
      "",
      "app = FastAPI(title=\"ChronoLog Edge Ingest\", version=\"0.4.1\")",
      "buffer = TelemetryWindowBuffer(capacity=100)",
      "",
      "class TelemetryPayload(BaseModel):",
      "    station_id: str",
      "    timestamp: float",
      "    temperature: float",
      "    humidity: float",
      "    barometric_pressure: float",
      "",
      "@app.get(\"/health\")",
      "def health():",
      "    return {\"status\": \"alive\", \"engine\": \"ChronoLog-0.4.1\"}",
      "",
      "@app.post(\"/api/v1/telemetry/ingest\")",
      "def ingest_telemetry(payload: TelemetryPayload, x_station_token: Optional[str] = Header(None)):",
      "    if not x_station_token or not verify_station_token(x_station_token, \"EDGE_SECRET_KEY_PROD_1\"):",
      "        raise HTTPException(status_code=401, detail=\"Unauthorized edge station\")",
      "    data = payload.dict()",
      "    buffer.push(data)",
      "    return {\"accepted\": True, \"buffered_count\": len(buffer.readings)}",
      "",
      "@app.get(\"/api/v1/telemetry/anomalies\")",
      "def get_anomalies():",
      "    # MISSING_TEST: No unit test exists for anomaly detection threshold logic!",
      "    return {\"anomalies\": buffer.detect_anomalies()}"
    ]
  },
  "backend/utils.py": {
    "file_path": "backend/utils.py",
    "total_lines": 26,
    "content": "import math\nimport cmath  # UNUSED_IMPORT\nimport xml.etree.ElementTree as ET  # UNUSED_IMPORT\n\ndef normalize_reading(val: float, min_val: float, max_val: float) -> float:\n    \"\"\"Normalizes sensor float readings between 0.0 and 1.0.\"\"\"\n    if max_val == min_val:\n        return 0.0\n    return (val - min_val) / (max_val - min_val)\n\ndef calculate_sensor_entropy(readings: list[float]) -> float:\n    # UNDOCUMENTED_FUNCTION: Shannon entropy estimation for jitter detection\n    # Lacks docstring and type validations\n    if not readings:\n        return 0.0\n    freqs = {}\n    for r in readings:\n        bucket = round(r, 1)\n        freqs[bucket] = freqs.get(bucket, 0) + 1\n    total = len(readings)\n    entropy = 0.0\n    for count in freqs.values():\n        p = count / total\n        if p > 0:\n            entropy -= p * math.log2(p)\n    return entropy\n",
    "lines": [
      "import math",
      "import cmath  # UNUSED_IMPORT",
      "import xml.etree.ElementTree as ET  # UNUSED_IMPORT",
      "",
      "def normalize_reading(val: float, min_val: float, max_val: float) -> float:",
      "    \"\"\"Normalizes sensor float readings between 0.0 and 1.0.\"\"\"",
      "    if max_val == min_val:",
      "        return 0.0",
      "    return (val - min_val) / (max_val - min_val)",
      "",
      "def calculate_sensor_entropy(readings: list[float]) -> float:",
      "    # UNDOCUMENTED_FUNCTION: Shannon entropy estimation for jitter detection",
      "    # Lacks docstring and type validations",
      "    if not readings:",
      "        return 0.0",
      "    freqs = {}",
      "    for r in readings:",
      "        bucket = round(r, 1)",
      "        freqs[bucket] = freqs.get(bucket, 0) + 1",
      "    total = len(readings)",
      "    entropy = 0.0",
      "    for count in freqs.values():",
      "        p = count / total",
      "        if p > 0:",
      "            entropy -= p * math.log2(p)",
      "    return entropy"
    ]
  },
  "frontend/app.js": {
    "file_path": "frontend/app.js",
    "total_lines": 24,
    "content": "// ChronoLog UI entrypoint\nconst API_BASE = \"/api/v1/telemetry\";\n\nexport async function fetchLiveAnomalies() {\n    try {\n        const res = await fetch(`${API_BASE}/anomalies`);\n        return await res.json();\n    } catch (e) {\n        console.error(\"Telemetry link lost\", e);\n        return [];\n    }\n}\n\nexport function renderObsoleteRadar(canvasElement, rawPoints) {\n    // TODO: remove canvas fallback once WebGL feed stabilizes\n    const ctx = canvasElement.getContext('2d');\n    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);\n    ctx.fillStyle = '#00ff88';\n    rawPoints.forEach(p => {\n        ctx.beginPath();\n        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);\n        ctx.fill();\n    });\n}\n",
    "lines": [
      "// ChronoLog UI entrypoint",
      "const API_BASE = \"/api/v1/telemetry\";",
      "",
      "export async function fetchLiveAnomalies() {",
      "    try {",
      "        const res = await fetch(`${API_BASE}/anomalies`);",
      "        return await res.json();",
      "    } catch (e) {",
      "        console.error(\"Telemetry link lost\", e);",
      "        return [];",
      "    }",
      "}",
      "",
      "export function renderObsoleteRadar(canvasElement, rawPoints) {",
      "    // TODO: remove canvas fallback once WebGL feed stabilizes",
      "    const ctx = canvasElement.getContext('2d');",
      "    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);",
      "    ctx.fillStyle = '#00ff88';",
      "    rawPoints.forEach(p => {",
      "        ctx.beginPath();",
      "        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);",
      "        ctx.fill();",
      "    });",
      "}"
    ]
  },
  "frontend/data_feed.js": {
    "file_path": "frontend/data_feed.js",
    "total_lines": 14,
    "content": "// Data streaming worker\nexport class SensorStreamWorker {\n    constructor(endpoint) {\n        this.endpoint = endpoint;\n        this.active = false;\n    }\n    start() {\n        this.active = true;\n        console.log(\"Worker initialized on \" + this.endpoint);\n    }\n    stop() {\n        this.active = false;\n    }\n}\n",
    "lines": [
      "// Data streaming worker",
      "export class SensorStreamWorker {",
      "    constructor(endpoint) {",
      "        this.endpoint = endpoint;",
      "        this.active = false;",
      "    }",
      "    start() {",
      "        this.active = true;",
      "        console.log(\"Worker initialized on \" + this.endpoint);",
      "    }",
      "    stop() {",
      "        this.active = false;",
      "    }",
      "}"
    ]
  }
};

export const DEFAULT_AI_ANSWER: AiAnswerResponse = {
  question: "What was this project originally designed to do?",
  answer: "ChronoLog (AetherStream Edge Telemetry Core) was an internal prototype edge telemetry ingestion service and anomaly detection buffer designed for micro-meteorological weather stations on Alpine Linux ARM64 nodes. It captured sensor readings (temperature, humidity, barometric pressure), evaluated rolling standard deviation windows for anomalies, and buffered structured telemetry for offline research and synchronization.",
  confidence: 0.96,
  purpose_summary: "Edge IoT atmospheric weather telemetry aggregator and anomaly detection buffer for micro-meteorological stations.",
  core_modules: [
    "backend/pipeline.py (TelemetryWindowBuffer & anomaly detector)",
    "backend/server.py (FastAPI ingestion & anomaly endpoint)",
    "backend/auth_legacy.py (Session verification & token vault)",
    "backend/utils.py (Reading normalization & entropy calculation)",
    "frontend/app.js (Canvas radar live feed)"
  ],
  source_citations: [
    {
      file_path: "README.md",
      line_start: 1,
      line_end: 15,
      snippet: "# ChronoLog / AetherStream Edge Telemetry Core\n\n> Notice: Internal prototype for atmospheric weather stations",
      is_verified: true
    },
    {
      file_path: "backend/pipeline.py",
      line_start: 4,
      line_end: 25,
      snippet: "class TelemetryWindowBuffer:\n    \"\"\"Rolling memory window to track atmospheric pressure, temperature, and humidity.\"\"\"",
      is_verified: true
    }
  ],
  commit_citations: [
    {
      commit_hash: "6d925dd82fb98d108cef8e552edb3df9c1acc63a",
      message: "Init repo: ChronoLog Edge Telemetry Ingestion Core",
      date: "2021-04-12",
      author: "Sarah Lin",
      is_verified: true
    }
  ],
  uncertainty_notes: "Uncertainty: Hardware sensor pinout specifications and proprietary cloud synchronization protocol specifications were not documented before project decommissioning.",
  model_used: "Gemma 2B (Local Ollama) & Deterministic AST Analyzer",
  inference_source: "gemma_ollama",
  model_name: "gemma2:2b",
  is_generative: true,
  grounding_status: "verified",
  unsupported_claims: []
};
