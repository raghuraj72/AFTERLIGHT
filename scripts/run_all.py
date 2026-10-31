import os
import sys
import subprocess
import time

def main():
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    venv_python = os.path.join(root_dir, ".venv", "Scripts", "python.exe")
    if not os.path.exists(venv_python):
        venv_python = sys.executable

    print("================================================================")
    print("      AFTERLIGHT — THE DIGITAL ARCHAEOLOGIST")
    print("     'Some code deserves a second life.'")
    print("================================================================")
    print("[1/2] Initializing GHOST_ARCHIVE_DEMO...")
    setup_script = os.path.join(root_dir, "scripts", "setup_demo_repo.py")
    subprocess.run([venv_python, setup_script], cwd=root_dir)

    print("\n[2/2] Launching Backend & Frontend services...")
    print(" - Backend API:  http://localhost:8000")
    print(" - Frontend Web: http://localhost:5173\n")

    env = os.environ.copy()
    env["PYTHONPATH"] = root_dir

    backend_proc = subprocess.Popen(
        [venv_python, "-m", "uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"],
        cwd=root_dir,
        env=env
    )

    frontend_proc = subprocess.Popen(
        ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"],
        cwd=os.path.join(root_dir, "frontend"),
        shell=True
    )

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nStopping AFTERLIGHT services...")
        backend_proc.terminate()
        frontend_proc.terminate()

if __name__ == "__main__":
    main()
