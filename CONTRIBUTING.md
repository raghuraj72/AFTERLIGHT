# Contributing to AFTERLIGHT

We welcome community contributions to AFTERLIGHT! Follow these guidelines:

## Development Workflow
1. Fork and clone the repository.
2. Create a virtual environment and install backend dependencies:
   ```bash
   python -m venv .venv
   source .venv/bin/activate
   pip install -r backend/requirements.txt
   ```
3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```
4. Run automated tests before submitting a PR:
   ```bash
   pytest backend/tests -v
   cd frontend && npm run build
   ```

## Code Guidelines
- Preserve typing consistency in TypeScript and Pydantic schemas.
- Ensure all AI reasoning features cite concrete files and line numbers.
- Ground detection heuristics in measurable source code artifacts.
