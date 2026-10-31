import subprocess
import os
from typing import List, Tuple, Optional
from ..models.schemas import CommitMilestone

def reconstruct_git_history(repo_path: str) -> Tuple[List[CommitMilestone], Optional[str]]:
    git_dir = os.path.join(repo_path, ".git")
    if not os.path.exists(git_dir):
        return [], None

    # Format: HASH|SHORT|AUTHOR|EMAIL|ISO_DATE|SUBJECT
    cmd = [
        "git", "log", 
        "--pretty=format:%H|%h|%an|%ae|%ad|%s", 
        "--date=iso-strict"
    ]
    try:
        res = subprocess.run(cmd, cwd=repo_path, capture_output=True, text=True, check=True)
        lines = [l.strip() for l in res.stdout.splitlines() if l.strip()]
    except Exception as e:
        return [], None

    commits: List[CommitMilestone] = []
    last_commit_date = None

    for idx, line in enumerate(lines):
        parts = line.split("|", 5)
        if len(parts) < 6:
            continue
        c_hash, c_short, author, email, date, msg = parts

        if idx == 0:
            last_commit_date = date

        # Get changed files for this commit
        changed_files = []
        try:
            stat_res = subprocess.run(
                ["git", "diff-tree", "--no-commit-id", "--name-only", "-r", c_hash],
                cwd=repo_path, capture_output=True, text=True
            )
            changed_files = [f.strip() for f in stat_res.stdout.splitlines() if f.strip()]
        except Exception:
            pass

        # Determine architectural milestone
        is_milestone = False
        reason = None

        lower_msg = msg.lower()
        if idx == len(lines) - 1:
            is_milestone = True
            reason = "Genesis Commit: Initial repository scaffolding and architecture creation."
        elif idx == 0:
            is_milestone = True
            reason = "Final Recorded Activity: Last known development modification before abandonment."
        elif "feat(security)" in lower_msg or "security" in lower_msg or "auth" in lower_msg:
            is_milestone = True
            reason = "Security Architecture: Implementation of session vault and authentication primitives."
        elif "refactor" in lower_msg or "pipeline" in lower_msg:
            is_milestone = True
            reason = "Core Pipeline Refactor: Migration from raw sockets to telemetry batch buffer."
        elif "feat(web)" in lower_msg:
            is_milestone = True
            reason = "Interface Expansion: Integration of real-time monitoring visualizer."

        commits.append(CommitMilestone(
            hash=c_hash,
            short_hash=c_short,
            author=author,
            email=email,
            date=date,
            message=msg,
            changed_files=changed_files,
            is_architectural_milestone=is_milestone,
            milestone_reason=reason
        ))

    return commits, last_commit_date
