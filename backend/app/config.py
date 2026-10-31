import os
from pydantic import BaseModel

class Settings(BaseModel):
    APP_NAME: str = "AFTERLIGHT — THE DIGITAL ARCHAEOLOGIST"
    APP_VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    GEMMA_MODEL: str = os.getenv("GEMMA_MODEL", "gemma2:2b")
    MONGODB_URI: str = os.getenv("MONGODB_URI", "")
    SENTRY_DSN: str = os.getenv("SENTRY_DSN", "")
    SERPAPI_KEY: str = os.getenv("SERPAPI_KEY", "")
    GITHUB_TOKEN: str = os.getenv("GITHUB_TOKEN", "")
    DATA_DIR: str = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "data"))
    DEMO_REPO_PATH: str = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "ghost_archive_demo"))

settings = Settings()
os.makedirs(settings.DATA_DIR, exist_ok=True)
