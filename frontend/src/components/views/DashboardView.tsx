import React from 'react';
import { 
  Compass, Play, Sparkles, Ghost, History, Bot, 
  ArrowRight, FileCode, CheckCircle2, AlertTriangle, Layers
} from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';
import { HealthGauge } from '../common/HealthGauge';

export const DashboardView: React.FC = () => {
  const { currentInvestigation, loadDemo, setActiveTab, openFileViewer } = useInvestigation();

  if (!currentInvestigation) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-relic-panel border border-relic-border flex items-center justify-center">
          <Ghost className="w-8 h-8 text-relic-cyan animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold font-mono text-slate-100">
          No Repository Excavation in Progress
        </h2>
        <p className="text-slate-400 max-w-md mx-auto text-sm">
          Load the preloaded demonstration repository or initiate a new investigation on any public GitHub repository or ZIP archive.
        </p>
        <button
          onClick={loadDemo}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-relic-cyan to-relic-purple text-black font-mono font-bold text-sm shadow-lg shadow-relic-cyan/20 hover:scale-105 transition-transform"
        >
          EXPLORE GHOST ARCHIVE DEMO
        </button>
      </div>
    );
  }

  const findings = currentInvestigation.findings;
  const criticalCount = findings.filter(f => f.severity === 'high' || f.severity === 'critical').length;
  const topFindings = findings.slice(0, 4);

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-relic-panel via-relic-charcoal to-relic-panel border border-relic-border overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(circle_at_right,_rgba(6,182,212,0.15),_transparent_70%)] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-relic-card border border-relic-border text-xs font-mono text-relic-cyan">
              <Sparkles className="w-3.5 h-3.5" />
              <span>DIGITAL ARCHAEOLOGY ACTIVE INVESTIGATION</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-100 font-mono">
              {currentInvestigation.repo_name}
            </h1>
            <p className="text-slate-400 text-sm max-w-xl">
              Excavated {currentInvestigation.total_files} source files, {currentInvestigation.total_lines_of_code} lines of code, and {currentInvestigation.commits.length} historical Git commits.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('ai_explorer')}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-relic-cyan/10 border border-relic-cyan hover:bg-relic-cyan/20 text-relic-cyan font-mono text-xs font-bold transition-all"
            >
              <Bot className="w-4 h-4" />
              <span>Ask Gemma: Project Purpose</span>
            </button>

            <button
              onClick={() => setActiveTab('revival_engine')}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-relic-gold/10 border border-relic-gold hover:bg-relic-gold/20 text-relic-gold font-mono text-xs font-bold transition-all"
            >
              <Compass className="w-4 h-4" />
              <span>View Resurrection Plan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-relic-card border border-relic-border space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Total Files</span>
          <div className="text-2xl font-bold font-mono text-slate-100">
            {currentInvestigation.total_files}
          </div>
          <span className="text-[10px] font-mono text-slate-500">Structured modules</span>
        </div>

        <div className="p-4 rounded-xl bg-relic-card border border-relic-border space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Ghost Findings</span>
          <div className="text-2xl font-bold font-mono text-relic-crimson">
            {findings.length}
          </div>
          <span className="text-[10px] font-mono text-relic-crimson/80">
            {criticalCount} critical / high risks
          </span>
        </div>

        <div className="p-4 rounded-xl bg-relic-card border border-relic-border space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Git Commits</span>
          <div className="text-2xl font-bold font-mono text-relic-purple">
            {currentInvestigation.commits.length}
          </div>
          <span className="text-[10px] font-mono text-slate-500">Chronological history</span>
        </div>

        <div className="p-4 rounded-xl bg-relic-card border border-relic-border space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Primary Language</span>
          <div className="text-2xl font-bold font-mono text-relic-cyan">
            {Object.keys(currentInvestigation.languages)[0] || 'Python'}
          </div>
          <span className="text-[10px] font-mono text-slate-500">AST parsed</span>
        </div>
      </div>

      {/* Health Gauge Section */}
      <HealthGauge health={currentInvestigation.health} />

      {/* Two Column Layout: Ghost Code Discoveries & Architecture Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Ghost Code Discoveries */}
        <div className="p-6 rounded-2xl bg-relic-card border border-relic-border space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Ghost className="w-4 h-4 text-relic-cyan" />
              <h3 className="font-mono text-sm font-semibold tracking-wide text-slate-100 uppercase">
                Ghost Code Discoveries
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('ghost_code')}
              className="text-xs font-mono text-relic-cyan hover:underline flex items-center space-x-1"
            >
              <span>View All ({findings.length})</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {topFindings.map((f) => (
              <div
                key={f.id}
                onClick={() => openFileViewer(f.file_path, f.line_number)}
                className="group p-3.5 rounded-xl bg-relic-panel border border-relic-border hover:border-relic-cyan/50 cursor-pointer transition-all space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-slate-200 group-hover:text-relic-cyan transition-colors">
                    {f.symbol}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                      f.severity === 'high' || f.severity === 'critical'
                        ? 'bg-relic-crimson/20 text-relic-crimson border border-relic-crimson/40'
                        : f.severity === 'medium'
                        ? 'bg-relic-gold/20 text-relic-gold border border-relic-gold/40'
                        : 'bg-slate-700/50 text-slate-300'
                    }`}
                  >
                    {f.severity}
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-1">{f.explanation}</p>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-1">
                  <span>
                    {f.file_path}:{f.line_number}
                  </span>
                  <span className="text-relic-cyan group-hover:underline">Inspect Code →</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Historical Timeline Milestone Snapshot */}
        <div className="p-6 rounded-2xl bg-relic-card border border-relic-border space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <History className="w-4 h-4 text-relic-purple" />
              <h3 className="font-mono text-sm font-semibold tracking-wide text-slate-100 uppercase">
                Digital Time Machine Milestones
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('time_machine')}
              className="text-xs font-mono text-relic-purple hover:underline flex items-center space-x-1"
            >
              <span>Explore History</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {currentInvestigation.commits.slice(0, 4).map((c, i) => (
              <div
                key={c.hash}
                className="p-3.5 rounded-xl bg-relic-panel border border-relic-border space-y-1 text-xs font-mono"
              >
                <div className="flex items-center justify-between">
                  <span className="text-relic-purple font-bold">{c.short_hash}</span>
                  <span className="text-slate-400">{c.date.slice(0, 10)}</span>
                </div>
                <p className="text-slate-200 font-sans text-xs">{c.message}</p>
                {c.is_architectural_milestone && (
                  <span className="inline-block px-1.5 py-0.5 rounded text-[10px] bg-relic-purple/20 text-relic-purple border border-relic-purple/40 font-mono">
                    ★ Architectural Milestone
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
