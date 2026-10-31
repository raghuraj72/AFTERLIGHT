# AFTERLIGHT — Architectural Specification

```
                                +--------------------------------------------+
                                |             AFTERLIGHT CLIENT              |
                                | (React, Vite, TypeScript, Tailwind, Canvas)|
                                +----------------------+---------------------+
                                                       | REST / JSON
                                                       v
+------------------------------------------------------+-----------------------------------------------------+
|                                          FASTAPI BACKEND RUNTIME                                           |
|                                                                                                            |
|  +-------------------+   +--------------------+   +-----------------------+   +-------------------------+  |
|  | File Tree Scanner |   |  AST Code Analyzer |   | Dependency Inspector  |   | Git History Archaeology |  |
|  | (Safe traversal)  |   | (Python AST, Calls)|   | (Reqs, package.json)  |   | (Commits, Milestones)   |  |
|  +---------+---------+   +---------+----------+   +-----------+-----------+   +------------+------------+  |
|            |                       |                          |                            |               |
|            +-----------------------+------------+-------------+----------------------------+               |
|                                                 |                                                          |
|                                                 v                                                          |
|                             +---------------------------------------+                                      |
|                             |        ARCHAEOLOGY CORE ENGINE        |                                      |
|                             |  - Ghost Code Detection               |                                      |
|                             |  - Explainable Health Scoring Formula |                                      |
|                             |  - 7-Category Revival Engine          |                                      |
|                             +-------------------+-------------------+                                      |
|                                                 |                                                          |
|                                                 v                                                          |
|                             +---------------------------------------+                                      |
|                             |          RAG RETRIEVAL ENGINE         |                                      |
|                             |  - Semantic Code Chunking             |                                      |
|                             |  - Citation Extractor (file & lines)  |                                      |
|                             +-------------------+-------------------+                                      |
|                                                 |                                                          |
|                                                 v                                                          |
|                             +---------------------------------------+                                      |
|                             |         AI REASONING PROVIDER         |                                      |
|                             |  - Gemma via Local Ollama Inference   |                                      |
|                             |  - Deterministic AST Grounding (Fail) |                                      |
|                             +---------------------------------------+                                      |
|                                                 |                                                          |
|                                                 v                                                          |
|                             +---------------------------------------+                                      |
|                             |          PERSISTENCE STORAGE          |                                      |
|                             |  - data/investigations.json           |                                      |
|                             |  - Optional MongoDB Atlas Connector   |                                      |
|                             +---------------------------------------+                                      |
+------------------------------------------------------------------------------------------------------------+
```

## Core Subsystems

### 1. Abstract Syntax Tree (AST) Analysis
Python files are parsed using Python's native `ast` module. The engine constructs a full node-link graph mapping every function definition, import, and call site.
- **Orphan Detection:** Cross-references all declared function symbols against the entire repository call graph. If call count == 0 and the function is not an exposed route, it is flagged as an `orphaned_function`.
- **Cryptographic Scanning:** Identifies invocations of broken hashing algorithms (`hashlib.md5`, `hashlib.sha1`).
- **Unused Import Analysis:** Extracts imported symbols and scans body AST nodes for reference tokens.

### 2. Explainable Health Scoring
Rather than relying on black-box heuristics, the health score is calculated transparently:
$$\text{Health Score} = 0.25 \cdot S_{\text{doc}} + 0.20 \cdot S_{\text{test}} + 0.20 \cdot S_{\text{dep}} + 0.20 \cdot S_{\text{clean}} + 0.15 \cdot S_{\text{vitality}}$$

### 3. RAG Retrieval & Citation Grounding
Code chunks are partitioned by functional boundaries and indexed alongside Git commit messages. When querying Gemma, relevant chunks and milestones are injected into the prompt with a strict requirement to cite exact file paths and line ranges. If local Ollama inference is unavailable, the fallback reasoner synthesizes the answer directly from the parsed AST evidence.
