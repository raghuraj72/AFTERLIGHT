@echo off
title AFTERLIGHT - The Digital Archaeologist
echo ================================================================
echo       AFTERLIGHT - THE DIGITAL ARCHAEOLOGIST
echo      "Some code deserves a second life."
echo ================================================================
echo Starting backend on http://localhost:8000 and frontend on http://localhost:5173 ...

set PYTHONPATH=.
start "AFTERLIGHT Backend" .\.venv\Scripts\python.exe -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
cd frontend
start "AFTERLIGHT Frontend" npm run dev -- --host 0.0.0.0 --port 5173
echo Services launched! Open http://localhost:5173 in your browser.
pause
