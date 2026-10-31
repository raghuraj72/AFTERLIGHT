import { 
  InvestigationResult, BenchmarkResult, AiAnswerResponse, 
  FileContentResponse 
} from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}

export async function investigateDemo(): Promise<{ investigation: InvestigationResult; benchmark: BenchmarkResult }> {
  const res = await fetch(`${API_BASE}/investigate/demo`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to run demo investigation');
  return res.json();
}

export async function investigateUpload(file: File): Promise<{ investigation: InvestigationResult; benchmark: BenchmarkResult }> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_BASE}/investigate/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to upload and analyze repository');
  return res.json();
}

export async function investigateGithub(repoUrl: string): Promise<{ investigation: InvestigationResult; benchmark: BenchmarkResult }> {
  const formData = new FormData();
  formData.append('repo_url', repoUrl);
  const res = await fetch(`${API_BASE}/investigate/github`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to clone and analyze GitHub repository');
  return res.json();
}

export async function fetchInvestigations() {
  const res = await fetch(`${API_BASE}/investigations`);
  return res.json();
}

export async function fetchInvestigation(id: string): Promise<InvestigationResult> {
  const res = await fetch(`${API_BASE}/investigations/${id}`);
  if (!res.ok) throw new Error('Investigation not found');
  return res.json();
}

export async function askAiQuestion(investigationId: string, question: string): Promise<AiAnswerResponse> {
  const res = await fetch(`${API_BASE}/ai/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ investigation_id: investigationId, question }),
  });
  if (!res.ok) throw new Error('AI reasoning request failed');
  return res.json();
}

export async function updateResurrectionItemStatus(invId: string, itemId: string, status: string) {
  const res = await fetch(`${API_BASE}/investigations/${invId}/resurrection/${itemId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  return res.json();
}

export async function fetchBenchmark(invId: string): Promise<BenchmarkResult> {
  const res = await fetch(`${API_BASE}/investigations/${invId}/benchmark`);
  return res.json();
}

export async function fetchFileContent(invId: string, filePath: string): Promise<FileContentResponse> {
  const url = `${API_BASE}/files/content?inv_id=${encodeURIComponent(invId)}&file_path=${encodeURIComponent(filePath)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load file content: ${filePath}`);
  return res.json();
}

export function getReportDownloadUrl(invId: string): string {
  return `${API_BASE}/investigations/${invId}/report/markdown`;
}

export function getReportHtmlUrl(invId: string): string {
  return `${API_BASE}/investigations/${invId}/report/html`;
}
