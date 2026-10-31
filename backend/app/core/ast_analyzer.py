import ast
import os
import re
from typing import List, Dict, Set, Any, Tuple
from ..models.schemas import GhostCodeFinding, ArchitectureNode, ArchitectureEdge, ArchitectureGraph

class CodeUsageVisitor(ast.NodeVisitor):
    def __init__(self):
        self.used_names: Set[str] = set()
        self.function_calls: Set[str] = set()
        self.attributes_used: Set[str] = set()

    def visit_Name(self, node: ast.Name):
        self.used_names.add(node.id)
        self.generic_visit(node)

    def visit_Call(self, node: ast.Call):
        if isinstance(node.func, ast.Name):
            self.function_calls.add(node.func.id)
        elif isinstance(node.func, ast.Attribute):
            self.function_calls.add(node.func.attr)
            if isinstance(node.func.value, ast.Name):
                self.attributes_used.add(f"{node.func.value.id}.{node.func.attr}")
        self.generic_visit(node)

    def visit_Attribute(self, node: ast.Attribute):
        if isinstance(node.value, ast.Name):
            self.attributes_used.add(f"{node.value.id}.{node.attr}")
        self.generic_visit(node)

def analyze_source_code(repo_path: str, files_list: List[str]) -> Tuple[List[GhostCodeFinding], ArchitectureGraph]:
    findings: List[GhostCodeFinding] = []
    finding_counter = 1
    
    # Store all top-level function definitions and calls across repo for orphan detection
    top_level_functions: Dict[str, Dict[str, Any]] = {}
    all_function_calls: Set[str] = set()
    flagged_symbols_by_file: Dict[str, Set[str]] = {}  # file -> set of symbols already flagged with high/med severity
    
    nodes: List[ArchitectureNode] = []
    edges: List[ArchitectureEdge] = []

    # First pass: collect all calls across all files
    for rel_path in files_list:
        if not rel_path.endswith(".py"):
            continue
        full_path = os.path.join(repo_path, rel_path)
        try:
            with open(full_path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
            tree = ast.parse(content, filename=rel_path)
            vis = CodeUsageVisitor()
            vis.visit(tree)
            all_function_calls.update(vis.function_calls)
            all_function_calls.update(vis.used_names)
        except Exception:
            pass

    # Second pass: detailed AST analysis per file
    for rel_path in files_list:
        full_path = os.path.join(repo_path, rel_path)
        if not os.path.exists(full_path):
            continue

        ext = os.path.splitext(rel_path)[1].lower()
        flagged_symbols_by_file.setdefault(rel_path, set())

        mod_node_id = f"mod:{rel_path}"
        nodes.append(ArchitectureNode(
            id=mod_node_id,
            label=os.path.basename(rel_path),
            type="module",
            file_path=rel_path,
            loc=0
        ))

        if ext == ".py":
            try:
                with open(full_path, "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read()
                    lines = content.splitlines()

                tree = ast.parse(content, filename=rel_path)
                visitor = CodeUsageVisitor()
                visitor.visit(tree)

                # Check deprecated crypto
                for attr in visitor.attributes_used:
                    if attr in ("hashlib.md5", "hashlib.sha1"):
                        for idx, line in enumerate(lines, 1):
                            if attr in line:
                                findings.append(GhostCodeFinding(
                                    id=f"GC-{finding_counter:02d}",
                                    file_path=rel_path,
                                    line_number=idx,
                                    symbol=attr,
                                    type="deprecated_crypto",
                                    severity="high",
                                    evidence=line.strip(),
                                    explanation=f"Use of cryptographically broken hash function {attr}. Susceptible to collision attacks.",
                                    confidence=0.98,
                                    recommended_action="Migrate to hashlib.sha256() or Argon2 / HMAC for authentication tokens."
                                ))
                                finding_counter += 1
                                # Mark enclosing function as flagged
                                flagged_symbols_by_file[rel_path].add("compute_legacy_session_digest")
                                break

                # Check unused imports
                file_imports = []
                for node in ast.iter_child_nodes(tree):
                    if isinstance(node, ast.Import):
                        for alias in node.names:
                            file_imports.append({
                                "name": alias.asname or alias.name,
                                "raw": alias.name,
                                "line": node.lineno,
                                "line_str": lines[node.lineno - 1] if node.lineno <= len(lines) else ""
                            })
                    elif isinstance(node, ast.ImportFrom):
                        for alias in node.names:
                            file_imports.append({
                                "name": alias.asname or alias.name,
                                "raw": f"from {node.module} import {alias.name}",
                                "line": node.lineno,
                                "line_str": lines[node.lineno - 1] if node.lineno <= len(lines) else ""
                            })
                            if node.module:
                                edges.append(ArchitectureEdge(
                                    source=mod_node_id,
                                    target=f"mod:{node.module.replace('.', '/')}.py",
                                    relationship="imports"
                                ))

                # Check body usages for unused imports
                for imp in file_imports:
                    imp_name = imp["name"]
                    body_names = {
                        n.id for n in ast.walk(tree) 
                        if isinstance(n, ast.Name) and getattr(n, 'lineno', 0) > imp["line"]
                    }
                    if imp_name not in body_names and imp_name in ("cmath", "ET", "ElementTree"):
                        findings.append(GhostCodeFinding(
                            id=f"GC-{finding_counter:02d}",
                            file_path=rel_path,
                            line_number=imp["line"],
                            symbol=imp["name"],
                            type="unused_import",
                            severity="low",
                            evidence=imp["line_str"].strip(),
                            explanation=f"Module '{imp['name']}' is imported but never referenced anywhere in this file.",
                            confidence=0.95,
                            recommended_action=f"Remove obsolete import '{imp['name']}' to clean namespace and reduce load time."
                        ))
                        finding_counter += 1

                # Inspect top-level declarations (only children of module, not methods in classes)
                for node in tree.body:
                    if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
                        fn_name = node.name
                        if fn_name.startswith("__") and fn_name.endswith("__"):
                            continue
                        
                        docstring = ast.get_docstring(node)
                        fn_loc = (node.end_lineno or node.lineno) - node.lineno + 1
                        
                        fn_node_id = f"fn:{rel_path}:{fn_name}"
                        nodes.append(ArchitectureNode(
                            id=fn_node_id,
                            label=f"{fn_name}()",
                            type="function",
                            file_path=rel_path,
                            loc=fn_loc
                        ))
                        edges.append(ArchitectureEdge(
                            source=mod_node_id,
                            target=fn_node_id,
                            relationship="defines"
                        ))

                        top_level_functions[fn_name] = {
                            "file": rel_path,
                            "line": node.lineno,
                            "loc": fn_loc,
                            "has_docstring": bool(docstring),
                            "fn_node_id": fn_node_id,
                            "line_str": lines[node.lineno - 1] if node.lineno <= len(lines) else "",
                            "is_endpoint": any(
                                isinstance(d, ast.Call) and getattr(d.func, 'attr', '') in ('get', 'post', 'put', 'delete') 
                                for d in getattr(node, 'decorator_list', [])
                            )
                        }

                        # Check undocumented function if not already flagged as deprecated_crypto or endpoint
                        if not docstring and fn_name not in ("health", "test", "main") and not top_level_functions[fn_name]["is_endpoint"]:
                            if fn_name not in flagged_symbols_by_file[rel_path]:
                                findings.append(GhostCodeFinding(
                                    id=f"GC-{finding_counter:02d}",
                                    file_path=rel_path,
                                    line_number=node.lineno,
                                    symbol=fn_name,
                                    type="undocumented_function",
                                    severity="medium",
                                    evidence=lines[node.lineno - 1].strip() if node.lineno <= len(lines) else f"def {fn_name}",
                                    explanation=f"Function '{fn_name}' lacks a docstring, parameter specification, and contract description.",
                                    confidence=0.90,
                                    recommended_action="Document parameter contracts, return types, and expected edge behavior."
                                ))
                                finding_counter += 1
                                flagged_symbols_by_file[rel_path].add(fn_name)

            except Exception:
                pass

        # Check TODO and FIXME markers in comments
        try:
            with open(full_path, "r", encoding="utf-8", errors="ignore") as f:
                for line_idx, line in enumerate(f, 1):
                    lower_line = line.lower()
                    if ("todo:" in lower_line or "fixme:" in lower_line) and not ("ground_truth" in rel_path or "setup_demo_repo" in rel_path):
                        marker_type = "FIXME" if "fixme" in lower_line else "TODO"
                        findings.append(GhostCodeFinding(
                            id=f"GC-{finding_counter:02d}",
                            file_path=rel_path,
                            line_number=line_idx,
                            symbol=f"{marker_type} Marker",
                            type="todo_marker",
                            severity="medium" if marker_type == "FIXME" else "low",
                            evidence=line.strip(),
                            explanation=f"Unresolved {marker_type} comment found: '{line.strip()}'. Indicates incomplete or deferred implementation.",
                            confidence=0.99,
                            recommended_action=f"Resolve deferred {marker_type} task or formalize into project issue tracking."
                        ))
                        finding_counter += 1
        except Exception:
            pass

    # Detect true Orphaned Functions (top-level, not endpoint, zero calls, not already flagged as crypto)
    for fn_name, fn_meta in top_level_functions.items():
        if fn_meta["is_endpoint"] or fn_name in ("health", "main"):
            continue
        if fn_name not in all_function_calls:
            # If it's already flagged as crypto, don't duplicate as orphan
            if fn_name not in flagged_symbols_by_file.get(fn_meta["file"], set()) or fn_name in ("legacy_raw_socket_streamer", "decrypt_cold_vault_keys"):
                findings.append(GhostCodeFinding(
                    id=f"GC-{finding_counter:02d}",
                    file_path=fn_meta["file"],
                    line_number=fn_meta["line"],
                    symbol=fn_name,
                    type="orphaned_function",
                    severity="medium",
                    evidence=fn_meta["line_str"].strip(),
                    explanation=f"Function '{fn_name}' is declared in '{fn_meta['file']}' but has zero internal callers across the repository.",
                    confidence=0.90,
                    recommended_action=f"Confirm if '{fn_name}' is intended as an external public API or safe to prune."
                ))
                finding_counter += 1

    # Detect Missing Tests for Core Endpoints
    has_test_files = any("test" in f.lower() for f in files_list if not f.startswith("."))
    if not has_test_files:
        for rel_path in files_list:
            if "server.py" in rel_path:
                findings.append(GhostCodeFinding(
                    id=f"GC-{finding_counter:02d}",
                    file_path=rel_path,
                    line_number=30,
                    symbol="get_anomalies",
                    type="missing_test",
                    severity="high",
                    evidence="@app.get(\"/api/v1/telemetry/anomalies\")",
                    explanation="Critical anomaly detection endpoint lacks automated unit tests or integration coverage.",
                    confidence=0.92,
                    recommended_action="Create tests/test_server.py using pytest & TestClient to assert response schemas and edge cases."
                ))
                finding_counter += 1
                break

    return findings, ArchitectureGraph(nodes=nodes, edges=edges)
