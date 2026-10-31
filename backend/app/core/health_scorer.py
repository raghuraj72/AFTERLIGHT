from typing import List, Dict, Any, Optional
from datetime import datetime
from ..models.schemas import HealthScoreBreakdown, GhostCodeFinding, CommitMilestone

def calculate_repository_health(
    files_list: List[str],
    findings: List[GhostCodeFinding],
    commits: List[CommitMilestone],
    readme_content: str,
    total_loc: int
) -> HealthScoreBreakdown:
    # 1. Documentation Score
    doc_pts = 0
    has_readme = bool(readme_content and len(readme_content.strip()) > 50)
    if has_readme:
        doc_pts += 35
        if "## overview" in readme_content.lower() or "# overview" in readme_content.lower():
            doc_pts += 15
        if "status" in readme_content.lower() or "install" in readme_content.lower():
            doc_pts += 10
    
    undoc_count = sum(1 for f in findings if f.type == "undocumented_function")
    doc_penalty = min(40, undoc_count * 15)
    documentation_score = max(5, min(100, doc_pts + (40 - doc_penalty)))

    # 2. Test Score
    test_files = [f for f in files_list if "test" in f.lower()]
    missing_test_findings = sum(1 for f in findings if f.type == "missing_test")
    if not test_files:
        test_score = 15  # Critical lack of automated test harness
    else:
        test_ratio = len(test_files) / max(1, len(files_list))
        test_score = min(100, int(50 + test_ratio * 150))
    if missing_test_findings > 0:
        test_score = max(10, test_score - (missing_test_findings * 10))

    # 3. Dependency Score
    dep_score = 100
    dep_findings = [f for f in findings if f.type == "deprecated_dependency"]
    for d in dep_findings:
        if d.severity == "high":
            dep_score -= 25
        elif d.severity == "medium":
            dep_score -= 15
        else:
            dep_score -= 10
    dependency_score = max(10, min(100, dep_score))

    # 4. Clean Code Score
    clean_score = 100
    for f in findings:
        if f.type == "deprecated_crypto":
            clean_score -= 20
        elif f.type == "orphaned_function":
            clean_score -= 15
        elif f.type == "unused_import":
            clean_score -= 5
        elif f.type == "todo_marker":
            clean_score -= 5
    clean_code_score = max(10, min(100, clean_score))

    # 5. Commit Vitality Score
    vitality_pts = 0
    if len(commits) >= 5:
        vitality_pts += 35
    elif len(commits) > 0:
        vitality_pts += len(commits) * 7

    authors = {c.author for c in commits}
    if len(authors) >= 3:
        vitality_pts += 35
    elif len(authors) >= 2:
        vitality_pts += 20
    elif len(authors) == 1:
        vitality_pts += 10

    # Age deduction
    if commits:
        try:
            # Check commit date
            first_date = commits[0].date
            commit_year = int(first_date[:4])
            current_year = 2026
            years_dormant = current_year - commit_year
            if years_dormant >= 4:
                vitality_pts += 10  # Deep dormant archive
            elif years_dormant >= 2:
                vitality_pts += 20
            else:
                vitality_pts += 30
        except Exception:
            vitality_pts += 15
    commit_vitality_score = max(10, min(100, vitality_pts))

    # Weighted Overall Formula
    # Documentation: 25%, Tests: 20%, Dependencies: 20%, Clean Code: 20%, Vitality: 15%
    overall = round(
        (0.25 * documentation_score) +
        (0.20 * test_score) +
        (0.20 * dependency_score) +
        (0.20 * clean_code_score) +
        (0.15 * commit_vitality_score)
    )

    formula = (
        "Overall Health = (0.25 × DocScore) + (0.20 × TestScore) + (0.20 × DepScore) + "
        "(0.20 × CleanScore) + (0.15 × VitalityScore)"
    )

    inputs = {
        "readme_detected": has_readme,
        "undocumented_functions_count": undoc_count,
        "test_files_count": len(test_files),
        "missing_tests_flagged": missing_test_findings,
        "deprecated_dependencies_count": len(dep_findings),
        "deprecated_crypto_count": sum(1 for f in findings if f.type == "deprecated_crypto"),
        "orphaned_functions_count": sum(1 for f in findings if f.type == "orphaned_function"),
        "total_commits_evaluated": len(commits),
        "distinct_contributors": len(authors)
    }

    return HealthScoreBreakdown(
        overall_score=overall,
        documentation_score=documentation_score,
        test_score=test_score,
        dependency_score=dependency_score,
        clean_code_score=clean_code_score,
        commit_vitality_score=commit_vitality_score,
        formula_explanation=formula,
        inputs_breakdown=inputs
    )
