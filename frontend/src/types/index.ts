export interface SourceCitation {
  file_path: string;
  line_start?: number;
  line_end?: number;
  snippet?: string;
  explanation?: string;
}

export interface CommitCitation {
  commit_hash: string;
  author: string;
  date: string;
  message: string;
  relevance?: string;
}

export interface GhostCodeFinding {
  id: string;
  file_path: string;
  line_number?: number;
  symbol: string;
  type: 'deprecated_crypto' | 'orphaned_function' | 'undocumented_function' | 'unused_import' | 'missing_test' | 'todo_marker' | 'deprecated_dependency' | string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  evidence: string;
  explanation: string;
  confidence: number;
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
  milestone_reason?: string;
}

export interface ArchitectureNode {
  id: string;
  label: string;
  type: 'module' | 'function' | 'class' | 'package' | 'entry_point';
  file_path?: string;
  ghost_status: boolean;
  ghost_finding_id?: string;
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
  diff_preview?: string;
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
}

export interface InvestigationResult {
  id: string;
  repo_name: string;
  repo_path: string;
  is_demo: boolean;
  analyzed_at: string;
  last_commit_date?: string;
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
  offline_mode: boolean;
  active_ai_model: string;
}

export interface BenchmarkResult {
  status: string;
  benchmark_type: string;
  total_ground_truth_targets: number;
  true_positives: number;
  false_positives: number;
  false_negatives: number;
  precision: number;
  recall: number;
  f1_score: number;
  citation_coverage_pct: number;
  execution_time_ms: number;
  target_matches: string[];
  evaluation_timestamp: string;
}

export interface FileContentResponse {
  file_path: string;
  total_lines: number;
  content: string;
  lines: string[];
}
