import os
import sys
import json

root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, root_dir)

from backend.app.main import run_investigation_pipeline
from backend.app.config import settings

def main():
    print("================================================================")
    print("      AFTERLIGHT SYNTHETIC BENCHMARK EVALUATOR")
    print("================================================================")
    print(f"Target Repository: {settings.DEMO_REPO_PATH}")

    result, benchmark = run_investigation_pipeline(
        settings.DEMO_REPO_PATH, "GHOST_ARCHIVE_DEMO", is_demo=True
    )

    print("\n--- BENCHMARK RESULTS ---")
    print(f"Status:             {benchmark.get('status')}")
    print(f"Evaluation Target:  {benchmark.get('benchmark_type')}")
    print(f"Precision:          {benchmark.get('precision') * 100:.1f}%")
    print(f"Recall:             {benchmark.get('recall') * 100:.1f}%")
    print(f"F1 Score:           {benchmark.get('f1_score'):.3f}")
    print(f"Citation Coverage:  {benchmark.get('citation_coverage_pct')}%")
    print(f"Execution Latency:  {benchmark.get('execution_time_ms')} ms")
    print(f"True Positives:     {benchmark.get('true_positives')}")
    print(f"False Positives:    {benchmark.get('false_positives')}")
    print(f"False Negatives:    {benchmark.get('false_negatives')}")
    print("----------------------------------------------------------------\n")

if __name__ == "__main__":
    main()
