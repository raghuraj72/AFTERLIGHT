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
        md.append(f"- **Confidence:** {int(f.confidence * 100)}% ({f.confidence_rationale or 'AST verified'})")
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
        md.append(f"- **Precision:** {benchmark.get('precision') * 100:.1f}%")
        md.append(f"- **Recall:** {benchmark.get('recall') * 100:.1f}%")
        md.append(f"- **F1 Score:** {benchmark.get('f1_score'):.3f}")
        md.append(f"- **Citation Coverage:** {benchmark.get('citation_coverage_pct')}%")
        md.append(f"- **Analysis Execution Time:** {benchmark.get('execution_time_ms')} ms\n")

    md.append("---\n*Generated autonomously by AFTERLIGHT — The Digital Archaeologist.*")
    return "\n".join(md)

def generate_html_report(result: InvestigationResult, benchmark: Dict[str, Any] = None) -> str:
    """Generates a print-ready HTML report designed for high-fidelity PDF export via browser Print."""
    findings_html = "".join([
        f"""
        <div class="card finding">
            <div class="badge {f.severity}">{f.severity.upper()}</div>
            <h3>{f.symbol} <span class="tag">({f.type})</span></h3>
            <p><strong>Location:</strong> <code>{f.file_path}:{f.line_number}</code></p>
            <div class="evidence"><code>{f.evidence}</code></div>
            <p><strong>Analysis:</strong> {f.explanation}</p>
            <p><strong>Action:</strong> {f.recommended_action}</p>
        </div>
        """
        for f in result.findings
    ])

    commits_html = "".join([
        f"""
        <div class="commit-row">
            <span class="hash">{c.short_hash}</span>
            <span class="date">{c.date[:10]}</span>
            <span class="author">{c.author}</span>
            <span class="msg">{c.message}</span>
            {"<span class='star'>★ Milestone</span>" if c.is_architectural_milestone else ""}
        </div>
        """
        for c in result.commits
    ])

    plan_html = "".join([
        f"""
        <div class="card plan">
            <div class="badge {r.priority.lower()}">{r.priority}</div>
            <h3>{r.title}</h3>
            <p><strong>Category:</strong> {r.category} | <strong>Complexity:</strong> {r.estimated_complexity}</p>
            <p>{r.description}</p>
            <p class="benefit"><strong>Expected Benefit:</strong> {r.expected_benefit}</p>
        </div>
        """
        for r in result.resurrection_plan
    ])

    bench_html = ""
    if benchmark and benchmark.get("status") == "completed":
        bench_html = f"""
        <section>
            <h2>Synthetic Evaluation Benchmark (GHOST_ARCHIVE_DEMO)</h2>
            <div class="bench-grid">
                <div class="metric"><span class="val">{benchmark.get('precision') * 100:.1f}%</span><span class="lbl">Precision</span></div>
                <div class="metric"><span class="val">{benchmark.get('recall') * 100:.1f}%</span><span class="lbl">Recall</span></div>
                <div class="metric"><span class="val">{benchmark.get('f1_score'):.3f}</span><span class="lbl">F1 Score</span></div>
                <div class="metric"><span class="val">{benchmark.get('citation_coverage_pct')}%</span><span class="lbl">Citation Coverage</span></div>
                <div class="metric"><span class="val">{benchmark.get('execution_time_ms')} ms</span><span class="lbl">Latency</span></div>
            </div>
        </section>
        """

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>AFTERLIGHT Archaeology Dossier - {result.repo_name}</title>
    <style>
        body {{
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace;
            background: #0d1017;
            color: #e2e8f0;
            padding: 30px;
            line-height: 1.5;
        }}
        h1, h2, h3 {{ color: #f8fafc; font-family: monospace; }}
        h1 {{ border-bottom: 2px solid #06b6d4; padding-bottom: 10px; margin-bottom: 5px; }}
        .tagline {{ color: #f59e0b; font-style: italic; margin-bottom: 25px; }}
        .header-meta {{ display: flex; gap: 20px; font-size: 13px; color: #94a3b8; margin-bottom: 30px; }}
        .card {{ background: #131722; border: 1px solid #242b3d; border-radius: 10px; padding: 15px; margin-bottom: 15px; }}
        .evidence {{ background: #080a0f; border-left: 3px solid #06b6d4; padding: 8px 12px; margin: 8px 0; font-family: monospace; font-size: 12px; color: #22d3ee; }}
        .badge {{ display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; margin-bottom: 5px; }}
        .badge.critical, .badge.high {{ background: rgba(244, 63, 94, 0.2); color: #f43f5e; border: 1px solid rgba(244, 63, 94, 0.4); }}
        .badge.medium, .badge.p1 {{ background: rgba(245, 158, 11, 0.2); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.4); }}
        .badge.low, .badge.p2 {{ background: rgba(6, 182, 212, 0.2); color: #06b6d4; border: 1px solid rgba(6, 182, 212, 0.4); }}
        .commit-row {{ display: flex; gap: 15px; padding: 8px 0; border-bottom: 1px solid #1e293b; font-size: 13px; }}
        .hash {{ color: #8b5cf6; font-family: monospace; font-weight: bold; }}
        .star {{ color: #f59e0b; font-size: 11px; }}
        .bench-grid {{ display: flex; gap: 15px; margin-top: 10px; }}
        .metric {{ background: #131722; border: 1px solid #242b3d; border-radius: 8px; padding: 12px; text-align: center; flex: 1; }}
        .metric .val {{ font-size: 20px; font-weight: bold; color: #06b6d4; display: block; }}
        .metric .lbl {{ font-size: 11px; color: #94a3b8; text-transform: uppercase; }}
        @media print {{
            body {{ background: #fff !important; color: #000 !important; }}
            .card {{ border: 1px solid #ccc !important; background: #fafafa !important; }}
            .evidence {{ background: #eee !important; color: #000 !important; }}
            h1, h2, h3 {{ color: #000 !important; }}
        }}
    </style>
</head>
<body>
    <h1>AFTERLIGHT ARCHAEOLOGY DOSSIER: {result.repo_name}</h1>
    <div class="tagline">Some code deserves a second life. // Hacktoberfest 2026</div>
    <div class="header-meta">
        <span><strong>Analyzed:</strong> {result.analyzed_at}</span>
        <span><strong>Files:</strong> {result.total_files}</span>
        <span><strong>Health Score:</strong> {result.health.overall_score}/100</span>
        <span><strong>Ghost Findings:</strong> {len(result.findings)}</span>
    </div>

    {bench_html}

    <section>
        <h2>Ghost Code Findings</h2>
        {findings_html}
    </section>

    <section>
        <h2>Digital Time Machine (Git Timeline)</h2>
        {commits_html}
    </section>

    <section>
        <h2>Resurrection Roadmap</h2>
        {plan_html}
    </section>

    <footer style="margin-top: 40px; border-top: 1px solid #334155; padding-top: 15px; font-size: 11px; color: #64748b;">
        Generated autonomously by AFTERLIGHT — The Digital Archaeologist. Local Sandbox Security Verified.
    </footer>
</body>
</html>
"""
