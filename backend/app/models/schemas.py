from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any
from datetime import datetime

class SourceCitation(BaseModel):
    file_path: str
    line_start: Optional[int] = None
    line_end: Optional[int] = None
    snippet: Optional[str] = None
    explanation: Optional[str] = None
    is_verified: bool = True

class CommitCitation(BaseModel):
    commit_hash: str
    author: str
    date: str
    message: str
    relevance: Optional[str] = None
    is_verified: bool = True

class GhostCodeFinding(BaseModel):
    id: str
    file_path: str
    line_number: Optional[int] = None
    line_start: Optional[int] = None
    line_end: Optional[int] = None
    symbol: str
    type: str  # deprecated_crypto, orphaned_function, undocumented_function, unused_import, missing_test, todo_marker, deprecated_dependency
    evidence_type: str = "source_code"  # source_code, git_history, dependency_manifest, model_hypothesis
    severity: str  # critical, high, medium, low
    evidence: str
    explanation: str
    confidence: float = Field(..., ge=0.0, le=1.0)
    confidence_rationale: Optional[str] = None
    limitations: Optional[str] = None
    recommended_action: str

class CommitMilestone(BaseModel):
    hash: str
    short_hash: str
    author: str
    email: str
    date: str
    message: str
    changed_files: List[str] = []
    is_architectural_milestone: bool = False
    milestone_reason: Optional[str] = None

class ArchitectureNode(BaseModel):
    id: str
    label: str
    type: str  # module, function, class, package, entry_point
    file_path: Optional[str] = None
    ghost_status: bool = False
    ghost_finding_id: Optional[str] = None
    loc: int = 0

class ArchitectureEdge(BaseModel):
    source: str
    target: str
    relationship: str  # imports, calls, defines

class ArchitectureGraph(BaseModel):
    nodes: List[ArchitectureNode] = []
    edges: List[ArchitectureEdge] = []

class HealthScoreBreakdown(BaseModel):
    overall_score: int  # 0 to 100
    documentation_score: int
    test_score: int
    dependency_score: int
    clean_code_score: int
    commit_vitality_score: int
    formula_explanation: str
    inputs_breakdown: Dict[str, Any]

class ResurrectionItem(BaseModel):
    id: str
    category: str  # critical_discoveries, immediate_maintenance, security_dependencies, missing_tests, documentation_recovery, architecture_improvements, long_term_modernization
    title: str
    description: str
    supporting_evidence: str
    priority: str  # P0, P1, P2, P3
    estimated_complexity: str  # Low, Medium, High
    expected_benefit: str
    relevant_files: List[str] = []
    suggested_steps: List[str] = []
    diff_preview: Optional[str] = None
    status: str = "pending"  # pending, accepted, rejected, completed

class GhostHuntMission(BaseModel):
    id: str
    title: str
    difficulty: str  # Novice, Adept, Master
    description: str
    clue: str
    target_finding_id: str
    completed: bool = False
    badge: str

class HypothesisItem(BaseModel):
    id: str
    epoch: str
    observed_fact: str
    inferred_hypothesis: str
    source_files: List[str] = []
    commit_hashes: List[str] = []
    uncertainty_notes: str
    confidence: float

class AiAnswerResponse(BaseModel):
    question: str
    answer: str
    confidence: float
    purpose_summary: Optional[str] = None
    core_modules: List[str] = []
    source_citations: List[SourceCitation] = []
    commit_citations: List[CommitCitation] = []
    uncertainty_notes: Optional[str] = None
    model_used: str
    inference_source: str = "deterministic_ast_fallback"  # "gemma_ollama" or "deterministic_ast_fallback"
    model_name: str = "deterministic-ast-v1"
    is_generative: bool = False
    grounding_status: str = "verified"  # verified, partial, unverified
    unsupported_claims: List[str] = []

class InvestigationResult(BaseModel):
    id: str
    repo_name: str
    repo_path: str
    is_demo: bool = False
    analyzed_at: str
    last_commit_date: Optional[str] = None
    total_files: int
    total_lines_of_code: int
    languages: Dict[str, int]
    files_list: List[str]
    findings: List[GhostCodeFinding]
    commits: List[CommitMilestone]
    architecture: ArchitectureGraph
    health: HealthScoreBreakdown
    resurrection_plan: List[ResurrectionItem]
    missions: List[GhostHuntMission]
    hypothesis_timeline: List[HypothesisItem] = []
    offline_mode: bool = True
    active_ai_model: str = "Gemma (Local/Ollama & Deterministic Fallback)"

class AskAiRequest(BaseModel):
    investigation_id: str
    question: str

class UpdateResurrectionItemRequest(BaseModel):
    status: str
