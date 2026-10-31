import json
import os
import time
from typing import List, Dict, Any
from ..models.schemas import GhostCodeFinding

def run_synthetic_benchmark(repo_path: str, detected_findings: List[GhostCodeFinding], execution_duration_ms: float) -> Dict[str, Any]:
    gt_path = os.path.join(repo_path, "ground_truth.json")
    if not os.path.exists(gt_path):
        return {
            "status": "unavailable",
            "reason": "No ground_truth.json found in repository root."
        }

    try:
        with open(gt_path, "r", encoding="utf-8") as f:
            gt_data = json.load(f)
    except Exception as e:
        return {"status": "error", "message": str(e)}

    expected_findings = gt_data.get("expected_findings", [])
    total_expected = len(expected_findings)

    # Match detected findings with expected findings
    matched_gt_ids = set()
    matched_detected_ids = set()

    for d in detected_findings:
        d_file = d.file_path.replace("\\", "/")
        for gt in expected_findings:
            gt_file = gt["file"].replace("\\", "/")
            # Match by file and symbol/evidence or type
            file_match = (d_file == gt_file) or (gt_file in d_file)
            symbol_match = (
                gt["symbol"].lower() in d.symbol.lower() or 
                gt["symbol"].lower() in d.evidence.lower() or
                d.symbol.lower() in gt["evidence"].lower() or
                d.type == gt["type"]
            )
            if file_match and symbol_match:
                matched_gt_ids.add(gt["id"])
                matched_detected_ids.add(d.id)
                break

    tp = len(matched_gt_ids)
    fp = max(0, len(detected_findings) - len(matched_detected_ids))
    fn = max(0, total_expected - tp)

    precision = round(tp / (tp + fp), 3) if (tp + fp) > 0 else 1.0
    recall = round(tp / (tp + fn), 3) if (tp + fn) > 0 else 1.0
    f1 = round(2 * (precision * recall) / (precision + recall), 3) if (precision + recall) > 0 else 0.0

    # Citation coverage: percentage of findings that have concrete line numbers & evidence
    findings_with_citations = sum(1 for d in detected_findings if d.line_number is not None and d.evidence)
    citation_coverage = round((findings_with_citations / max(1, len(detected_findings))) * 100, 1)

    return {
        "status": "completed",
        "benchmark_type": "Synthetic Evaluation Dataset (GHOST_ARCHIVE_DEMO)",
        "total_ground_truth_targets": total_expected,
        "true_positives": tp,
        "false_positives": fp,
        "false_negatives": fn,
        "precision": precision,
        "recall": recall,
        "f1_score": f1,
        "citation_coverage_pct": citation_coverage,
        "execution_time_ms": round(execution_duration_ms, 2),
        "target_matches": list(matched_gt_ids),
        "evaluation_timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    }
