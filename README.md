# AFTERLIGHT — THE DIGITAL ARCHAEOLOGIST
> **Tagline:** *"Some code deserves a second life."*  
> **Theme:** Hacktoberfest 2026 — Ghost in the Machine

[![Python](https://img.shields.io/badge/Python-3.11%2B-blue.svg)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110%2B-009688.svg)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-3178c6.svg)](https://typescriptlang.org)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg)](https://tailwindcss.com)
[![Gemma](https://img.shields.io/badge/AI-Gemma%20Open--Weight-8b5cf6.svg)](https://ai.google.dev/gemma)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🏛️ Overview

**AFTERLIGHT** is an open-source digital archaeology platform designed to excavate, analyze, and resurrect abandoned software repositories.

Across the software landscape, thousands of repositories are abandoned every year:
- Documentation decays or disappears.
- Original authors move on.
- Architectural context is lost.
- Cryptographic standards and dependencies become deprecated.
- Unreferenced and dead code accumulates.

AFTERLIGHT investigates these digital ruins. Using Abstract Syntax Tree (AST) static analysis, Git chronological archaeology, and Gemma open-weight retrieval-augmented generation (RAG), AFTERLIGHT uncovers buried architectural decisions, flags vulnerabilities, answers questions grounded strictly in source code, and drafts prioritized resurrection roadmaps.

---

## ✨ Key Capabilities

1. **Cinematic Interactive Introduction**
   - Immersive 5-scene opening sequence with real-time reactive canvas particles, Web Audio synthesizer ambiance, typing terminal effects, and one-click entry modes.
2. **Ghost Code Detector**
   - Discovers broken cryptography (`hashlib.md5`), orphaned functions (zero callers), undocumented procedures, unused imports, missing test harnesses, and legacy dependencies.
3. **Digital Time Machine**
   - Interactive Git history scrub reconstructing chronological milestones, author commits, changed files, and architectural turning points.
4. **AI Repository Explorer (Gemma)**
   - Answers the primary demonstration question: *"What was this project originally designed to do?"*
   - Returns evidence-grounded answers with **100% clickable source citations** (file path and line number) and historical commit references.
5. **Architecture Memory Map**
   - Interactive topology graph linking modules, functions, and import dependencies with zoom, pan, and inspector tools.
6. **Code Graveyard**
   - Atmospheric memorial showcasing decayed functions, obsolete packages, and unreferenced socket streamers with tombstone cards and decay metrics.
7. **Revival Engine (Resurrection Roadmap)**
   - Prioritized 7-part recovery plan (Critical, Maintenance, Security, Tests, Docs, Architecture, Modernization) with code diff previews and status tracking.
8. **Ghost Hunt Missions**
   - Gamified developer archaeology challenges: *"The Mystery of the Broken Hash"*, *"The Forgotten Socket Streamer"*, etc.
9. **Explainable Repository Health Score**
   - Transparent mathematical score derived from measurable inputs (documentation coverage, test harness, dependency freshness, clean code, commit vitality).
10. **Synthetic Benchmark Suite**
    - Built-in evaluation comparing detections against ground truth in `ghost_archive_demo` (**91.7% Precision, 100% Citation Coverage, <400ms latency**).

---

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+ & npm
- Git

### 1. Automated Start (Single Script)

**On Windows:**
```powershell
.\start_all.bat
```

**Or using Python:**
```bash
python scripts/run_all.py
```

### 2. Manual Installation

#### Backend Setup
```bash
# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .\.venv\Scripts\activate

# Install dependencies
pip install -r backend/requirements.txt

# Launch FastAPI backend
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Open your browser at **`http://localhost:5173`**.

---

## 🤖 Gemma & Ollama Setup

AFTERLIGHT natively supports open-weight AI inference using **Gemma** via Ollama:

1. Install [Ollama](https://ollama.ai).
2. Pull the Gemma model:
   ```bash
   ollama pull gemma2:2b
   # Or 7B if you have GPU capacity:
   ollama pull gemma2:7b
   ```
3. Start Ollama:
   ```bash
   ollama serve
   ```
4. AFTERLIGHT auto-detects running Ollama models at `http://localhost:11434`.

> **Note on Offline Archaeology Mode:** If Ollama or Gemma is not running, AFTERLIGHT automatically falls back to its deterministic AST grounding reasoner. The system **never fabricates responses** or hallucinates files that do not exist.

---

## 🧪 Synthetic Evaluation Results

Run the automated synthetic benchmark against `GHOST_ARCHIVE_DEMO`:
```bash
python evaluation/run_benchmark.py
```

**Measured Benchmark Metrics:**
- **Precision:** 91.7%
- **Recall:** 73.3%
- **F1 Score:** 0.815
- **Source Citation Coverage:** 100.0%
- **Execution Time:** ~396 ms

---

## 🔒 Security & Privacy

- **Path Traversal Protection:** All archive extractions and file views validate and sanitize relative paths (`..` is blocked).
- **Zero Remote Source Uploads:** Source code is analyzed strictly inside the local sandbox.
- **Explainable Scores:** No arbitrary "black-box" ratings; health formulas are publicly documented with exact inputs.

---

## 📜 License

Licensed under the [MIT License](LICENSE).
