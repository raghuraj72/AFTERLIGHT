import React, { useState, useEffect } from 'react';
import { 
  FileText, Download, Printer, ShieldCheck, CheckCircle2, 
  ExternalLink, Sparkles, BarChart2 
} from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';
import { getReportDownloadUrl, fetchBenchmark } from '../../services/api';
import { BenchmarkResult } from '../../types';

export const ReportsView: React.FC = () => {
  const { currentInvestigation, benchmark: initialBenchmark } = useInvestigation();
  const [benchmark, setBenchmark] = useState<BenchmarkResult | null>(initialBenchmark);
  const [loadingBench, setLoadingBench] = useState<boolean>(false);

  useEffect(() => {
    if (currentInvestigation && !benchmark) {
      setLoadingBench(true);
      fetchBenchmark(currentInvestigation.id)
        .then((res) => setBenchmark(res))
        .catch(() => {})
        .finally(() => setLoadingBench(false));
    }
  }, [currentInvestigation, benchmark]);

  if (!currentInvestigation) {
    return <div className="p-8 text-center text-slate-400 font-mono">No active investigation loaded.</div>;
  }

  const downloadReport = () => {
    window.open(getReportDownloadUrl(currentInvestigation.id), '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-5xl mx-auto select-none print:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-relic-border pb-6">
        <div>
          <div className="flex items-center space-x-2 text-relic-cyan mb-1">
            <FileText className="w-5 h-5" />
            <span className="font-mono text-xs uppercase tracking-widest">
              OFFICIAL ARCHAEOLOGY AUDIT REPORT
            </span>
          </div>
          <h1 className="text-3xl font-bold font-mono text-slate-100">
            Digital Resurrection Report
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Exportable engineering dossier containing health indices, ghost findings, timeline milestones, and synthetic evaluation metrics.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 print:hidden">
          <button
            onClick={downloadReport}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-relic-cyan/10 hover:bg-relic-cyan/20 border border-relic-cyan text-xs font-mono font-bold text-relic-cyan transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Markdown</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-relic-panel hover:bg-relic-card border border-relic-border text-xs font-mono text-slate-300 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Synthetic Benchmark Card */}
      {benchmark && benchmark.status === 'completed' && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-relic-panel via-relic-card to-relic-panel border border-relic-border space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-relic-gold">
              <BarChart2 className="w-5 h-5" />
              <h3 className="font-mono text-xs uppercase tracking-widest font-bold">
                SYNTHETIC EVALUATION BENCHMARK
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              Target: {benchmark.benchmark_type}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-center">
            <div className="p-3 rounded-xl bg-[#0b0e14] border border-relic-border">
              <span className="text-[10px] text-slate-400 block uppercase">Precision</span>
              <span className="text-xl font-bold text-relic-emerald">
                {(benchmark.precision * 100).toFixed(1)}%
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#0b0e14] border border-relic-border">
              <span className="text-[10px] text-slate-400 block uppercase">Recall</span>
              <span className="text-xl font-bold text-relic-cyan">
                {(benchmark.recall * 100).toFixed(1)}%
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#0b0e14] border border-relic-border">
              <span className="text-[10px] text-slate-400 block uppercase">F1 Score</span>
              <span className="text-xl font-bold text-relic-purple">
                {benchmark.f1_score.toFixed(2)}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#0b0e14] border border-relic-border">
              <span className="text-[10px] text-slate-400 block uppercase">Citation Coverage</span>
              <span className="text-xl font-bold text-relic-gold">
                {benchmark.citation_coverage_pct}%
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#0b0e14] border border-relic-border">
              <span className="text-[10px] text-slate-400 block uppercase">Execution Time</span>
              <span className="text-xl font-bold text-slate-200">
                {benchmark.execution_time_ms} ms
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Comprehensive Report Presentation */}
      <div className="p-8 rounded-2xl bg-relic-card border border-relic-border space-y-8 font-mono text-xs">
        {/* Section 1: Overview */}
        <div className="space-y-3 pb-6 border-b border-relic-border">
          <span className="text-relic-cyan uppercase tracking-widest font-bold">1. EXECUTIVE SUMMARY</span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-slate-300">
            <div>
              <span className="text-slate-500 block">REPOSITORY:</span>
              <strong className="text-slate-100 text-sm">{currentInvestigation.repo_name}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">ANALYZED AT:</span>
              <span>{currentInvestigation.analyzed_at}</span>
            </div>
            <div>
              <span className="text-slate-500 block">TOTAL FILES:</span>
              <span>{currentInvestigation.total_files}</span>
            </div>
            <div>
              <span className="text-slate-500 block">OVERALL HEALTH:</span>
              <strong className="text-relic-gold text-sm">{currentInvestigation.health.overall_score}/100</strong>
            </div>
          </div>
        </div>

        {/* Section 2: Health Breakdown */}
        <div className="space-y-3 pb-6 border-b border-relic-border">
          <span className="text-relic-purple uppercase tracking-widest font-bold">2. REPOSITORY HEALTH INDICES</span>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-slate-300">
            <div className="p-2.5 rounded bg-relic-panel">
              <span className="text-slate-500 block">Documentation:</span>
              <span className="font-bold text-slate-200">{currentInvestigation.health.documentation_score}%</span>
            </div>
            <div className="p-2.5 rounded bg-relic-panel">
              <span className="text-slate-500 block">Test Harness:</span>
              <span className="font-bold text-slate-200">{currentInvestigation.health.test_score}%</span>
            </div>
            <div className="p-2.5 rounded bg-relic-panel">
              <span className="text-slate-500 block">Dependencies:</span>
              <span className="font-bold text-slate-200">{currentInvestigation.health.dependency_score}%</span>
            </div>
            <div className="p-2.5 rounded bg-relic-panel">
              <span className="text-slate-500 block">Clean Code:</span>
              <span className="font-bold text-slate-200">{currentInvestigation.health.clean_code_score}%</span>
            </div>
            <div className="p-2.5 rounded bg-relic-panel">
              <span className="text-slate-500 block">Commit Vitality:</span>
              <span className="font-bold text-slate-200">{currentInvestigation.health.commit_vitality_score}%</span>
            </div>
          </div>
        </div>

        {/* Section 3: Discovered Ghost Code */}
        <div className="space-y-3 pb-6 border-b border-relic-border">
          <span className="text-relic-crimson uppercase tracking-widest font-bold">
            3. DISCOVERED GHOST CODE FINDINGS ({currentInvestigation.findings.length})
          </span>
          <div className="space-y-2">
            {currentInvestigation.findings.map((f) => (
              <div key={f.id} className="p-3 rounded-lg bg-relic-panel border border-relic-border/80 flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-relic-crimson font-bold">[{f.severity.toUpperCase()}]</span>
                    <strong className="text-slate-200">{f.symbol}</strong>
                    <span className="text-slate-500">({f.type})</span>
                  </div>
                  <p className="text-slate-400 mt-1">{f.explanation}</p>
                  <span className="text-slate-500 text-[11px] block mt-1">Evidence: {f.evidence}</span>
                </div>
                <span className="text-slate-500 text-[11px] flex-shrink-0 ml-4">
                  {f.file_path}:{f.line_number}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Resurrection Roadmap */}
        <div className="space-y-3">
          <span className="text-relic-gold uppercase tracking-widest font-bold">
            4. PRIORITY RESURRECTION ROADMAP ({currentInvestigation.resurrection_plan.length} TASKS)
          </span>
          <div className="space-y-2">
            {currentInvestigation.resurrection_plan.map((r) => (
              <div key={r.id} className="p-3 rounded-lg bg-relic-panel border border-relic-border/80">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-relic-gold font-bold">[{r.priority}]</span>
                    <strong className="text-slate-200">{r.title}</strong>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">{r.status}</span>
                </div>
                <p className="text-slate-400">{r.description}</p>
                <span className="text-relic-cyan text-[11px] block mt-1">Benefit: {r.expected_benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
