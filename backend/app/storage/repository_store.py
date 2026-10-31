import os
import json
from typing import Dict, List, Optional
from ..config import settings
from ..models.schemas import InvestigationResult

STORE_FILE = os.path.join(settings.DATA_DIR, "investigations.json")

def load_all_investigations() -> Dict[str, Any]:
    if not os.path.exists(STORE_FILE):
        return {}
    try:
        with open(STORE_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {}

def save_investigation(result: InvestigationResult):
    data = load_all_investigations()
    data[result.id] = result.model_dump()
    os.makedirs(os.path.dirname(STORE_FILE), exist_ok=True)
    with open(STORE_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

def get_investigation(investigation_id: str) -> Optional[InvestigationResult]:
    data = load_all_investigations()
    item = data.get(investigation_id)
    if item:
        return InvestigationResult(**item)
    return None

def list_investigations() -> List[Dict[str, Any]]:
    data = load_all_investigations()
    summaries = []
    for inv_id, item in data.items():
        summaries.append({
            "id": inv_id,
            "repo_name": item.get("repo_name"),
            "analyzed_at": item.get("analyzed_at"),
            "is_demo": item.get("is_demo", False),
            "total_files": item.get("total_files"),
            "health_score": item.get("health", {}).get("overall_score", 0),
            "findings_count": len(item.get("findings", [])),
            "commits_count": len(item.get("commits", []))
        })
    return summaries

def update_resurrection_status(investigation_id: str, item_id: str, new_status: str) -> bool:
    data = load_all_investigations()
    if investigation_id not in data:
        return False
    
    plan = data[investigation_id].get("resurrection_plan", [])
    updated = False
    for r in plan:
        if r.get("id") == item_id:
            r["status"] = new_status
            updated = True
            break
            
    if updated:
        with open(STORE_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
    return updated
