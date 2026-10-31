from typing import Dict, Any
from ..models.schemas import InvestigationResult

def generate_markdown_report(result: InvestigationResult, benchmark: Dict[str, Any] = None) -> str:
    md = []
    md.append(f"# AFTERLIGHT ARCHAEOLOGY REPORT: {result.repo_name}")
    md.append(f"> Tagline: *Some code deserves a second life.*")
    md.append(f"**Analyzed At:** {result.analyzed_at} | **Total Files:** {result.total_files} | **Total LOC:** {result.total_lines_of_code}\n")
    
    md.append("## 1. Executive Summary & Health Index")
    md.append(f"- **Overall Health Score:** {result.health.overall_score}/100")
    md.append(f"- **Documentation:** {result.health.documentation_score}/100")
    md.append(f"- **Test Coverage Indicator:** {result.health.test_score}/100")
    md.append(f"- **Dependency Freshness:** {result.health.dependency_score}/100")
    md.append(f"- **Clean Code Index:** {result.health.clean_code_score}/100")
    md.append(f"- **Commit Vitality:** {result.health.commit_vitality_score}/100\n")
    md.append(f"**Formula Explanation:** `{result.health.formula_explanation}`\n")

    md.append("## 2. Ghost Code Discoveries")
    for f in result.findings:
        md.append(f"### [{f.severity.upper()}] {f.symbol} ({f.type})")
        md.append(f"- **File:** `{f.file_path}:{f.line_number}`")
        md.append(f"- **Evidence:** `{f.evidence}`")
        md.append(f"- **Explanation:** {f.explanation}")
        md.append(f"- **Recommended Action:** {f.recommended_action}\n")

    md.append("## 3. Historical Digital Time Machine (Git Commits)")
    for c in result.commits:
        star = " ★ [ARCHITECTURAL MILESTONE]" if c.is_architectural_milestone else ""
        md.append(f"- **`{c.short_hash}`** ({c.date[:10]}) by **{c.author}**: *{c.message}*{star}")
        if c.milestone_reason:
            md.append(f"  - *Milestone Significance:* {c.milestone_reason}")

    md.append("\n## 4. Prioritized Resurrection Roadmap")
    for r in result.resurrection_plan:
        md.append(f"### [{r.priority}] {r.title} ({r.category})")
        md.append(f"- **Complexity:** {r.estimated_complexity} | **Status:** {r.status.upper()}")
        md.append(f"- **Expected Benefit:** {r.expected_benefit}")
        md.append(f"- **Supporting Evidence:** {r.supporting_evidence}")
        md.append("- **Implementation Steps:**")
        for s in r.suggested_steps:
            md.append(f"  1. {s}")
        if r.diff_preview:
            md.append("\n```diff")
            md.append(r.diff_preview)
            md.append("```\n")

    if benchmark and benchmark.get("status") == "completed":
        md.append("## 5. Synthetic Evaluation Benchmark Results")
        md.append(f"- **Precision:** {benchmark.get('precision') * 100}%")
        md.append(f"- **Recall:** {benchmark.get('recall') * 100}%")
        md.append(f"- **F1 Score:** {benchmark.get('f1_score')}")
        md.append(f"- **Citation Coverage:** {benchmark.get('citation_coverage_pct')}%")
        md.append(f"- **Analysis Execution Time:** {benchmark.get('execution_time_ms')} ms\n")

    md.append("---\n*Generated autonomously by AFTERLIGHT — The Digital Archaeologist.*")
    return "\n".join(md)
