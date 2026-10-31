export interface SourceCitation {
  file_path: string;
  line_start?: number;
  line_end?: number;
  snippet?: string;
  explanation?: string;
  is_verified?: boolean;
  verified?: boolean;
  confidence?: number;
}

export interface CommitCitation {
  commit_hash: string;
  short_hash?: string;
  author: string;
  date: string;
  message: string;
  relevance?: string;
  is_verified?: boolean;
  verified?: boolean;
}

export interface GhostCodeFinding {
  id: string;
  file_path: string;
  line_number?: number;
  line_start?: number;
  line_end?: number;
  symbol: string;
  type: 'deprecated_crypto' | 'orphaned_function' | 'undocumented_function' | 'unused_import' | 'missing_test' | 'todo_marker' | 'deprecated_dependency' | string;
  evidence_type: 'source_code' | 'git_history' | 'dependency_manifest' | 'model_hypothesis' | string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  evidence: string;
  explanation: string;
  confidence: number;
  confidence_rationale?: string;
  limitations?: string;
  recommended_action: string;
}

export interface CommitMilestone {
  hash: string;
  short_hash: string;
  author: string;
  email: string;
  date: string;
  message: string;
  changed_files: string[];
  is_architectural_milestone: boolean;
  milestone_reason?: string | null;
}

export interface ArchitectureNode {
  id: string;
  label: string;
  type: 'module' | 'function' | 'class' | 'package' | 'entry_point';
  file_path?: string | null;
  ghost_status: boolean;
  ghost_finding_id?: string | null;
  loc: number;
}

export interface ArchitectureEdge {
  source: string;
  target: string;
  relationship: 'imports' | 'calls' | 'defines';
}

export interface ArchitectureGraph {
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
}

export interface HealthScoreBreakdown {
  overall_score: number;
  documentation_score: number;
  test_score: number;
  dependency_score: number;
  clean_code_score: number;
  commit_vitality_score: number;
  formula_explanation: string;
  inputs_breakdown: Record<string, any>;
  health_rating?: string;
}

export interface ResurrectionItem {
  id: string;
  category: 'critical_discoveries' | 'immediate_maintenance' | 'security_dependencies' | 'missing_tests' | 'documentation_recovery' | 'architecture_improvements' | 'long_term_modernization';
  title: string;
  description: string;
  supporting_evidence: string;
  priority: 'P0' | 'P1' | 'P2' | 'P3';
  estimated_complexity: 'Low' | 'Medium' | 'High';
  expected_benefit: string;
  relevant_files: string[];
  suggested_steps: string[];
  diff_preview?: string | null;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
}

export interface GhostHuntMission {
  id: string;
  title: string;
  difficulty: 'Novice' | 'Adept' | 'Master';
  description: string;
  clue: string;
  target_finding_id: string;
  completed: boolean;
  badge: string;
}

export interface HypothesisItem {
  id: string;
  epoch: string;
  observed_fact: string;
  inferred_hypothesis: string;
  source_files: string[];
  commit_hashes: string[];
  uncertainty_notes: string;
  confidence: number;
}

export interface AiAnswerResponse {
  question: string;
  answer: string;
  confidence: number;
  purpose_summary?: string;
  core_modules: string[];
  source_citations: SourceCitation[];
  commit_citations: CommitCitation[];
  uncertainty_notes?: string;
  model_used: string;
  inference_source: 'gemma_ollama' | 'deterministic_ast_fallback' | string;
  model_name: string;
  is_generative: boolean;
  grounding_status: 'verified' | 'partial' | 'unverified' | string;
  unsupported_claims?: string[];
}

export interface InvestigationResult {
  id: string;
  repo_name: string;
  repo_path: string;
  is_demo: boolean;
  analyzed_at: string;
  last_commit_date?: string | null;
  total_files: number;
  total_lines_of_code: number;
  languages: Record<string, number>;
  files_list: string[];
  findings: GhostCodeFinding[];
  commits: CommitMilestone[];
  architecture: ArchitectureGraph;
  health: HealthScoreBreakdown;
  resurrection_plan: ResurrectionItem[];
  missions: GhostHuntMission[];
  hypothesis_timeline: HypothesisItem[];
  offline_mode: boolean;
  active_ai_model: string;
}

export interface BenchmarkResult {
  status: string;
  benchmark_type: string;
  total_ground_truth_targets?: number;
  total_expected?: number;
  total_detected?: number;
  true_positives: number;
  false_positives: number;
  false_negatives: number;
  precision: number;
  recall: number;
  f1_score: number;
  citation_coverage_pct?: number;
  source_citation_coverage?: number;
  commit_citation_coverage?: number;
  execution_time_ms?: number;
  latency_ms?: number;
  target_matches?: string[];
  evaluation_timestamp?: string;
  details?: string;
}

export interface FileContentResponse {
  file_path: string;
  total_lines: number;
  content: string;
  lines: string[];
}
