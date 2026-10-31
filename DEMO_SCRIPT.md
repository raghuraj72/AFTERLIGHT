# AFTERLIGHT — FIVE-MINUTE LIVE DEMONSTRATION SCRIPT
## Hacktoberfest 2026: Ghost in the Machine

This script guides presenters and hackathon judges through the exact 5-minute end-to-end evaluation journey.

---

### ⏱️ 0:00 – 0:35: THE CINEMATIC INTRO
1. Open the application at `http://localhost:5173`.
2. Experience the 5-scene immersive digital archaeology opening sequence:
   - **Scene 1:** Floating code fragments & the digital world.
   - **Scene 2:** The Digital Graveyard of abandoned repositories.
   - **Scene 3:** The Signal (cyan scanner moving across digital archives).
   - **Scene 4:** The Awakening (AFTERLIGHT logo reveal: *"Some code deserves a second life."*).
   - **Scene 5:** Three interactive entry options.
3. Click **EXPLORE LIVE DEMO** to begin the excavation.

---

### ⏱️ 0:35 – 1:15: THE FORGOTTEN REPOSITORY
1. The dashboard opens displaying `GHOST_ARCHIVE_DEMO` (ChronoLog Edge Telemetry Ingest Core).
2. Point out:
   - 7 source files excavated, 2 languages detected.
   - Initial Health Score: **62/100** (Degraded / At Risk).
   - Click "Explainable Metric" on the health gauge to show the exact mathematical formula and inputs.

---

### ⏱️ 1:15 – 2:00: THE DISCOVERY (GHOST CODE DETECTOR)
1. Navigate to the **Ghost Code** tab on the sidebar.
2. Observe the detected findings:
   - **`hashlib.md5`** in `backend/auth_legacy.py:6` (Deprecated Cryptography).
   - **`legacy_raw_socket_streamer`** in `backend/pipeline.py:30` (Orphaned function with 0 callers).
   - **`calculate_sensor_entropy`** in `backend/utils.py:12` (Undocumented function).
   - **`urllib3==1.25.10`** in `requirements.txt` (Known CVE vulnerability).
   - Missing test for `GET /api/v1/telemetry/anomalies`.
3. Click **"Inspect Code"** on `hashlib.md5`.
4. The Code Viewer Modal pops up with line 6 glowing in cyber cyan!

---

### ⏱️ 2:00 – 2:50: THE DIGITAL TIME MACHINE
1. Navigate to the **Digital Timeline** tab.
2. Scrub through the 7 chronological Git commits:
   - `38eadad` (Genesis commit by Sarah Lin).
   - `c064098` (Security handshake and session vault milestone).
   - `6486e1a` (Pipeline refactor to batch buffer).
   - `c5ed1f0` (Final abandoned commit before decommissioning in Nov 2022).
3. Click a commit to inspect verified metadata and changed files.

---

### ⏱️ 2:50 – 3:50: GEMMA RECONSTRUCTS THE MEMORY
1. Navigate to **AI Explorer**.
2. Notice the primary demonstration question:
   > *"What was this project originally designed to do?"*
3. Click **EXCAVATE**.
4. Review Gemma's response:
   - Purpose: Edge IoT telemetry aggregator and rolling anomaly detection buffer.
   - Highlights core modules (`backend/pipeline.py`, `backend/server.py`, `backend/auth_legacy.py`).
5. **Key Moment:** Click on the source citation chip `backend/pipeline.py (Lines 1-35)`.
6. The exact file immediately opens in the code modal!

---

### ⏱️ 3:50 – 4:40: THE REVIVAL ENGINE
1. Navigate to the **Revival Engine** tab.
2. Review the structured 7-category Resurrection Roadmap:
   - **P0 Critical:** Upgrade MD5 to HMAC-SHA256. Click "Preview Proposed Patch Diff" to view the code patch.
   - **P0 Tests:** Implement unit test harness for anomaly calculations.
   - **P1 Dependencies:** Update `urllib3` and `pydantic`.
   - **P2 Cleanup:** Prune unreferenced socket streamer.
3. Click **Accept** and **Done** on items to track modernization progress.

---

### ⏱️ 4:40 – 5:00: THE FINAL DOSSIER
1. Navigate to **Archaeology Reports**.
2. View the Synthetic Benchmark card:
   - **Precision: 91.7%**
   - **Citation Coverage: 100.0%**
   - **Latency: <400 ms**
3. Click **Export Markdown** to download the complete report.
4. Conclude:
   > *"AFTERLIGHT — Some code deserves a second life."*
