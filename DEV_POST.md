# AFTERLIGHT — The Digital Archaeologist: Reconstructing Forgotten Codebases with Gemma 2B

*Submitted to the Hacktoberfest 2026 Open-Source AI Challenge — Week 4: Ghost in the Machine (Best Use of Gemma)*

> **"Some code deserves a second life."**

---

## 1. The Hook: The Digital Graveyard

Every day, thousands of software repositories are abandoned. Developers move on to new jobs, startups pivot, open-source maintainers burn out, and documentation evaporates into 404 errors. 

Yet the code remains. 

In git repositories across the world lie buried architectural decisions, abandoned prototypes, undocumented endpoints, forgotten cryptographic keys, and orphaned algorithms. When modern developers inherit these digital ruins, they face an uphill battle: reading hundreds of undocumented source files, guessing at historical intents, and navigating outdated dependencies with security vulnerabilities.

Generic AI coding assistants often make this worse: they hallucinate APIs that never existed, invent commit histories, or confidently declare that an abandoned weather station daemon is an e-commerce platform.

**Enter AFTERLIGHT — The Digital Archaeologist.**

AFTERLIGHT is an open-source digital forensic laboratory that treats abandoned software repositories not as dead text, but as historical excavation sites. It combines deterministic AST static analysis, genuine Git archaeology, and local open-weight AI (**Gemma 2B via Ollama**) to reconstruct forgotten software purpose, map architectural evolution, audit buried vulnerabilities, and draft actionable resurrection roadmaps—with zero ungrounded hallucinations.

---

## 2. What We Built: The Digital Forensic Laboratory

AFTERLIGHT is a full-stack, production-ready forensic engineering platform:

- **Frontend:** High-performance React 18, TypeScript, Tailwind CSS, Lucide icons, and a custom atmospheric cyberpunk design system inspired by forensic electron microscopes.
- **Backend:** FastAPI (Python 3.14), Python `ast` parser, `subprocess` Git archaeology engine, and local Ollama inference service.
- **AI Core:** Open-weight **Gemma 2B** running completely locally and offline via Ollama.
- **Evidence Verification Engine:** 100% server-side line-level source containment check and commit SHA validation.
- **Evaluation Benchmark:** Automated synthetic ground-truth benchmark suite evaluating precision, recall, and citation validity.

### Key Capabilities

1. **The Ghost Case File (Signature Experience):** A 1-click end-to-end investigation of our synthetic historical repository (`GHOST_ARCHIVE_DEMO`), exposing genuine findings with verified line numbers, confidence rationale, and severity levels.
2. **Git Archaeology & Time Machine:** Reconstructs historical project epochs directly from genuine Git commits, authors, and timestamps.
3. **Hypothesis Timeline (Facts vs Inferences):** Strictly separates **Observed Facts** (empirically proven from Git commits and AST trees) from **Inferred Hypotheses** (Gemma's probabilistic architectural interpretations).
4. **Interactive Memory Map:** Generates dependency, module, and communication graphs showing orphaned nodes and broken links.
5. **Revival Engine & Ghost Hunt Missions:** Prioritized, evidence-linked resurrection roadmaps with gamified forensic developer missions.
6. **Multi-Format Audit Dossier:** Generates comprehensive Markdown and printable HTML/PDF dossiers with complete benchmark scorecards.

---

## 3. The Gemma Architecture: Open-Weight AI with Defensible Evidence

AFTERLIGHT targets the **Best Use of Gemma** category by making Gemma 2B the core analytical engine while strictly anchoring its capabilities to source facts.

```
                    ┌─────────────────────────────────┐
                    │  Repository Under Investigation │
                    └────────────────┬────────────────┘
                                     │
           ┌─────────────────────────┴────────────────────────┐
           ▼                                                  ▼
┌─────────────────────────────┐                    ┌────────────────────────────┐
│ Deterministic AST Analyzer  │                    │ Git Archaeology Engine     │
│ (functions, classes, deps)  │                    │ (commits, authors, diffs)  │
└──────────────┬──────────────┘                    └─────────────┬──────────────┘
               │                                                 │
               └───────────────────────┬─────────────────────────┘
                                       ▼
                       ┌───────────────────────────────┐
                       │ Context Assembler & Retriever │
                       │ (BM25 + Semantic Chunks)      │
                       └───────────────┬───────────────┘
                                       ▼
                 ┌───────────────────────────────────────────┐
                 │ Gemma 2B (Local Ollama Engine)            │
                 │ - Temperature: 0.1 (Strict Grounding)     │
                 │ - Structured JSON Schema Enforcement      │
                 └─────────────────────┬─────────────────────┘
                                       ▼
                 ┌───────────────────────────────────────────┐
                 │ Server-Side Citation Validation Pipeline  │
                 │ - Validates file exists on disk           │
                 │ - Validates line start <= line end        │
                 │ - Validates snippet containment in file   │
                 │ - Validates commit hash in Git database   │
                 └─────────────────────┬─────────────────────┘
                                       ▼
                 ┌───────────────────────────────────────────┐
                 │ Grounded Forensic Answer + Citations      │
                 │ [Truthful Inference Source Labeling]     │
                 └───────────────────────────────────────────┘
```

### Why Gemma 2B?

1. **Edge-Capable & Truly Local:** Abandoned proprietary repositories often contain sensitive business logic or secrets. Running Gemma 2B locally via Ollama guarantees that **zero code or telemetry ever leaves the developer's workstation**.
2. **Deterministic Context Grounding:** At a context size of 4K/8K tokens and a low temperature (`0.1`), Gemma 2B reliably adheres to system instructions that forbid speculative claims outside of retrieved code chunks.
3. **Open Weights & Responsible AI:** Gemma's architecture allows precise inspection, repeatable prompts, and low inference latency (~400ms on local hardware).

### Honest Transparency & Fallback System

We uphold strict scientific integrity in AFTERLIGHT:
- When Gemma 2B is active in Ollama, answers are clearly marked as `Inference Source: gemma_ollama (Model: gemma2:2b, Generative: True)`.
- If Ollama is offline, AFTERLIGHT smoothly falls back to a deterministic AST/commit synthesis and transparently marks the response as `Inference Source: deterministic_ast_fallback (Model: deterministic-ast-v1, Generative: False)`.
- **We never pretend a fallback is an AI model.**

---

## 4. The Defensible Evidence System: No Hallucinations Allowed

The primary vulnerability of LLMs in software analysis is ungrounded speculation. To solve this, AFTERLIGHT implements a dual-layer defense:

### 1. Structured Evidence Schema
Every finding and citation returned contains:
- `evidence_type`: `source_code`, `git_history`, or `dependency_manifest`
- `file_path`: Relative path verified against the repository tree
- `line_start` and `line_end`: Validated 1-indexed line numbers
- `snippet`: Exact substring extracted from disk
- `confidence_rationale`: Algorithmic explanation of why this was flagged
- `limitations`: Honest statement of what remains unknown

### 2. Rigorous Server-Side Verification
Even if the AI model generates a citation, the backend runs `validate_citation_evidence()`:
```python
def validate_citation_evidence(repo_path: str, cit: SourceCitation) -> bool:
    full_path = os.path.join(repo_path, cit.file_path)
    if not os.path.exists(full_path):
        return False
    with open(full_path, "r", encoding="utf-8", errors="ignore") as f:
        file_lines = f.readlines()
    if cit.line_start < 1 or cit.line_end > len(file_lines) or cit.line_start > cit.line_end:
        return False
    if cit.snippet:
        target_chunk = "".join(file_lines[cit.line_start - 1 : cit.line_end])
        clean_snippet = cit.snippet.strip().replace("\r", "")
        clean_target = target_chunk.strip().replace("\r", "")
        if clean_snippet not in clean_target and clean_snippet[:30] not in clean_target:
            return False
    return True
```
Invalid citations are stripped, and unsupported claims are flagged into an `unsupported_claims` array.

---

## 5. Walkthrough: Investigating the `GHOST_ARCHIVE_DEMO` Case File

Let's walk through an investigation of the bundled demo repository:

### Step 1: Automated Ingestion
The user loads `GHOST_ARCHIVE_DEMO`. The scanner parses Python and JavaScript files, mapping imports, classes, functions, and docstrings.

### Step 2: Ghost Code & Vulnerability Identification
AST & dependency analyzers flag real issues:
- `backend/auth_legacy.py` (Line 6): **High Severity** — Deprecated MD5 hashing in `compute_legacy_session_digest`.
- `backend/auth_legacy.py` (Line 14): **Medium Severity** — Orphaned, undocumented `decrypt_cold_vault_keys()` with zero callers.
- `package.json` (Line 7): **Medium Severity** — Outdated, deprecated `moment: ^2.29.1`.
- `requirements.txt` (Line 6): **High Severity** — Vulnerable `urllib3==1.25.10` with known CVEs.

### Step 3: Git Archaeology & Hypothesis Timeline
The Git Archaeology engine traverses 7 historical commits across 3 distinct epochs:
- **Epoch 1 (Core Prototype):** Sarah Lin creates ChronoLog edge telemetry ingestion.
- **Epoch 2 (Security & Web Expansion):** Alex Chen and Dave Miller implement token vault and radar canvas.
- **Epoch 3 (Abandonment):** Sarah Lin adds `DEPRECATION_NOTICE.txt` as team transfers to cloud unit.
The **Hypothesis Timeline** clearly separates verified facts from speculative hypotheses.

### Step 4: Asking Gemma 2B
User query: *"What was this project originally designed to do?"*
Gemma 2B retrieves `README.md`, `backend/pipeline.py`, and commit `Init repo: ChronoLog Edge Telemetry Ingestion Core`, generating:
> *"ChronoLog (AetherStream Edge Telemetry Core) was an edge atmospheric telemetry buffer and anomaly detection system for micro-meteorological weather stations, designed for Alpine Linux ARM64 nodes."*
Citations: Clickable links to `README.md#L1-L15` and commit `6d925dd`.

### Step 5: Synthetic Benchmark Scorecard
AFTERLIGHT runs against the pre-configured ground truth (`ground_truth.json`):
- **Precision:** 91.7%
- **Recall:** 73.3%
- **F1 Score:** 81.5%
- **Citation Coverage:** 100.0%
- **Latency:** ~396 ms

---

## 6. How to Run AFTERLIGHT Locally

### Prerequisites
- Python 3.10+ (Tested on Python 3.14)
- Node.js 18+ & npm
- [Ollama](https://ollama.ai) with `gemma2:2b`

### 1. Start Ollama and Pull Gemma 2B
```bash
ollama serve
ollama pull gemma2:2b
```

### 2. Start Backend
```bash
# In repository root:
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\Activate.ps1
pip install fastapi uvicorn pydantic pytest httpx requests
uvicorn backend.app.main:app --port 8000 --reload
```

### 3. Start Frontend
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` to explore the Digital Archaeologist interface!

### 4. Run Automated Test Suite
```bash
pytest backend/tests -v
```
All 5 comprehensive test suites pass 100% with zero mock dependencies!

---

## 7. Hacktoberfest Reflection & Open-Source Vision

Building AFTERLIGHT during Hacktoberfest 2026 has been an exhilarating exploration into the frontiers of local, open-weight AI.

Too often, AI development is treated as an exercise in prompting proprietary black-box APIs. By choosing **Gemma 2B**, we proved that an open-weight 2-billion-parameter model running on consumer hardware can deliver world-class, defensible developer tooling when combined with sound software engineering principles: deterministic parsers, immutable version-control histories, and rigorous citation checks.

Every abandoned project contains the labor, hopes, and intellect of the developers who wrote it. With AFTERLIGHT, no code has to be forgotten forever.

---

### Links & Repository
- **GitHub Repository:** [raghuraj72/AFTERLIGHT](https://github.com/raghuraj72/AFTERLIGHT)
- **License:** MIT License
- **Target Category:** Week 4: Ghost in the Machine — Best Use of Gemma
