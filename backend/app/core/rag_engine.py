import os
import re
from typing import List, Dict, Any, Tuple
from ..models.schemas import SourceCitation, CommitCitation, CommitMilestone

class CodeChunk:
    def __init__(self, file_path: str, line_start: int, line_end: int, content: str, chunk_type: str = "code"):
        self.file_path = file_path
        self.line_start = line_start
        self.line_end = line_end
        self.content = content
        self.chunk_type = chunk_type

def chunk_repository(repo_path: str, files_list: List[str]) -> List[CodeChunk]:
    chunks: List[CodeChunk] = []
    
    for rel_path in files_list:
        full_path = os.path.join(repo_path, rel_path)
        if not os.path.exists(full_path):
            continue

        try:
            with open(full_path, "r", encoding="utf-8", errors="ignore") as f:
                lines = f.readlines()
        except Exception:
            continue

        if not lines:
            continue

        # Chunk markdown files by sections (# or ##)
        if rel_path.lower().endswith(".md"):
            current_chunk = []
            start_line = 1
            for idx, line in enumerate(lines, 1):
                if line.startswith("#") and current_chunk:
                    chunks.append(CodeChunk(
                        file_path=rel_path,
                        line_start=start_line,
                        line_end=idx - 1,
                        content="".join(current_chunk),
                        chunk_type="markdown_section"
                    ))
                    current_chunk = [line]
                    start_line = idx
                else:
                    current_chunk.append(line)
            if current_chunk:
                chunks.append(CodeChunk(
                    file_path=rel_path,
                    line_start=start_line,
                    line_end=len(lines),
                    content="".join(current_chunk),
                    chunk_type="markdown_section"
                ))
            continue

        # For Python and JS, chunk by logical blocks / functions or window of 25 lines
        window_size = 35
        overlap = 10
        total_lines = len(lines)
        i = 0
        while i < total_lines:
            end_line = min(i + window_size, total_lines)
            snippet = "".join(lines[i:end_line])
            chunks.append(CodeChunk(
                file_path=rel_path,
                line_start=i + 1,
                line_end=end_line,
                content=snippet,
                chunk_type="source_block"
            ))
            if end_line == total_lines:
                break
            i += (window_size - overlap)

    return chunks

def retrieve_evidence(
    query: str,
    chunks: List[CodeChunk],
    commits: List[CommitMilestone],
    top_k_chunks: int = 4,
    top_k_commits: int = 3
) -> Tuple[List[SourceCitation], List[CommitCitation]]:
    # Tokenize query
    keywords = set(re.findall(r"\w+", query.lower()))
    if not keywords:
        keywords = {"telemetry", "archive", "purpose", "ingest", "sensor"}

    # Score chunks
    scored_chunks = []
    for chunk in chunks:
        score = 0
        chunk_text_lower = chunk.content.lower()
        chunk_file_lower = chunk.file_path.lower()
        
        # Boost README and server/pipeline files for purpose queries
        if "readme" in chunk_file_lower:
            score += 6
        if "server" in chunk_file_lower:
            score += 4
        if "pipeline" in chunk_file_lower:
            score += 4
        if "auth" in chunk_file_lower and ("auth" in keywords or "security" in keywords):
            score += 5

        for kw in keywords:
            if len(kw) <= 2:
                continue
            if kw in chunk_text_lower:
                score += 3
            if kw in chunk_file_lower:
                score += 5

        if score > 0:
            scored_chunks.append((score, chunk))

    scored_chunks.sort(key=lambda x: x[0], reverse=True)
    selected_chunks = [item[1] for item in scored_chunks[:top_k_chunks]]

    # If no chunk scored, grab top source files (README, server.py, pipeline.py)
    if not selected_chunks:
        for chunk in chunks:
            if "readme" in chunk.file_path.lower() or "server.py" in chunk.file_path.lower():
                selected_chunks.append(chunk)
                if len(selected_chunks) >= top_k_chunks:
                    break

    source_citations = [
        SourceCitation(
            file_path=c.file_path,
            line_start=c.line_start,
            line_end=c.line_end,
            snippet=c.content.strip(),
            explanation=f"Reconstructed from {c.file_path} (Lines {c.line_start}–{c.line_end})"
        )
        for c in selected_chunks
    ]

    # Score and select commits
    scored_commits = []
    for c in commits:
        score = 0
        msg_lower = c.message.lower()
        if c.is_architectural_milestone:
            score += 5
        for kw in keywords:
            if len(kw) <= 2:
                continue
            if kw in msg_lower:
                score += 4
            for cf in c.changed_files:
                if kw in cf.lower():
                    score += 3
        scored_commits.append((score, c))

    scored_commits.sort(key=lambda x: x[0], reverse=True)
    selected_commits = [item[1] for item in scored_commits[:top_k_commits]]

    commit_citations = [
        CommitCitation(
            commit_hash=c.hash,
            author=c.author,
            date=c.date,
            message=c.message,
            relevance=c.milestone_reason or f"Modified: {', '.join(c.changed_files[:3])}"
        )
        for c in selected_commits
    ]

    return source_citations, commit_citations
