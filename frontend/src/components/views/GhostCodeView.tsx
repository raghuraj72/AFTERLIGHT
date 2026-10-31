import React, { useState } from 'react';
import { 
  Ghost, Search, Filter, AlertTriangle, ShieldAlert, 
  HelpCircle, CheckCircle2, FileCode, ArrowUpRight, Zap 
} from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';
import { GhostCodeFinding } from '../../types';

export const GhostCodeView: React.FC = () => {
  const { currentInvestigation, openFileViewer } = useInvestigation();
  const [search, setSearch] = useState<string>('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  if (!currentInvestigation) {
    return (
      <div className="p-8 text-center text-slate-400 font-mono">
        No active investigation loaded.
      </div>
    );
  }

  const allFindings = currentInvestigation.findings;

  const filteredFindings = allFindings.filter((f) => {
    const matchesSearch = 
      f.symbol.toLowerCase().includes(search.toLowerCase()) ||
      f.file_path.toLowerCase().includes(search.toLowerCase()) ||
      f.explanation.toLowerCase().includes(search.toLowerCase()) ||
      f.evidence.toLowerCase().includes(search.toLowerCase());

    const matchesSeverity = severityFilter === 'all' || f.severity === severityFilter;
    const matchesType = typeFilter === 'all' || f.type === typeFilter;

    return matchesSearch && matchesSeverity && matchesType;
  });

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return 'bg-relic-crimson/20 text-relic-crimson border-relic-crimson/50';
      case 'medium':
        return 'bg-relic-gold/20 text-relic-gold border-relic-gold/50';
      default:
        return 'bg-relic-cyan/20 text-relic-cyan border-relic-cyan/50';
    }
  };

  return (
    <div className="p-6 sm:p-10 space-y-6 max-w-7xl mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-relic-border pb-6">
        <div>
          <div className="flex items-center space-x-2 text-relic-cyan mb-1">
            <Ghost className="w-5 h-5" />
            <span className="font-mono text-xs uppercase tracking-widest">
              AST STATIC ANALYSIS & EVIDENCE DETECTOR
            </span>
          </div>
          <h1 className="text-3xl font-bold font-mono text-slate-100">
            Ghost Code Discoveries
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Unreferenced functions, cryptographic decay, orphaned modules, and unshielded endpoints.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-lg bg-relic-card border border-relic-border text-slate-300">
            Total Discovered: <strong className="text-relic-cyan">{allFindings.length}</strong>
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-relic-crimson/10 border border-relic-crimson/30 text-relic-crimson">
            Critical/High: <strong>{allFindings.filter(f => f.severity === 'high' || f.severity === 'critical').length}</strong>
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by symbol, file, or evidence..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-relic-card border border-relic-border focus:border-relic-cyan text-xs font-mono text-slate-100 placeholder-slate-500 outline-none transition-colors"
          />
        </div>

        {/* Severity Filter */}
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400 ml-1" />
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-relic-card border border-relic-border focus:border-relic-cyan text-xs font-mono text-slate-300 outline-none transition-colors"
          >
            <option value="all">All Severities</option>
            <option value="high">High & Critical</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Type Filter */}
        <div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-relic-card border border-relic-border focus:border-relic-cyan text-xs font-mono text-slate-300 outline-none transition-colors"
          >
            <option value="all">All Discovery Types</option>
            <option value="deprecated_crypto">Deprecated Cryptography</option>
            <option value="orphaned_function">Orphaned Functions (Zero Callers)</option>
            <option value="undocumented_function">Undocumented Functions</option>
            <option value="unused_import">Unused Imports</option>
            <option value="missing_test">Missing Test Coverage</option>
            <option value="deprecated_dependency">Deprecated Dependencies</option>
            <option value="todo_marker">Unresolved TODO/FIXME Markers</option>
          </select>
        </div>
      </div>

      {/* Findings List */}
      <div className="space-y-4">
        {filteredFindings.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-relic-card border border-relic-border font-mono text-xs text-slate-400">
            No ghost code findings match your filter criteria.
          </div>
        ) : (
          filteredFindings.map((f) => (
            <div
              key={f.id}
              className="p-5 rounded-2xl bg-relic-card border border-relic-border hover:border-relic-cyan/40 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center space-x-3">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold uppercase border ${getSeverityBadge(f.severity)}`}>
                    {f.severity}
                  </span>
                  <span className="font-mono text-base font-bold text-slate-100">
                    {f.symbol}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-relic-panel text-[11px] font-mono text-slate-400 border border-relic-border">
                    {f.type.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-400 block">CONFIDENCE</span>
                    <span className="text-xs font-mono font-bold text-relic-cyan">
                      {(f.confidence * 100).toFixed(0)}%
                    </span>
                  </div>

                  <button
                    onClick={() => openFileViewer(f.file_path, f.line_number)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-relic-cyan/10 hover:bg-relic-cyan/20 border border-relic-cyan/40 text-xs font-mono text-relic-cyan transition-colors"
                  >
                    <FileCode className="w-3.5 h-3.5" />
                    <span>Inspect Code</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Evidence Snippet */}
              <div className="p-3 rounded-xl bg-relic-panel border border-relic-border/80 font-mono text-xs text-slate-300 overflow-x-auto">
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                  <span>GROUNDED EVIDENCE FROM SOURCE:</span>
                  <span>{f.file_path}:{f.line_number}</span>
                </div>
                <code className="text-relic-cyan font-bold block whitespace-pre">
                  {f.evidence}
                </code>
              </div>

              {/* Explanation & Action */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-3 rounded-xl bg-relic-panel/60 border border-relic-border/40">
                  <span className="text-slate-400 block mb-1">EXPLANATION:</span>
                  <p className="text-slate-200">{f.explanation}</p>
                </div>

                <div className="p-3 rounded-xl bg-relic-panel/60 border border-relic-border/40">
                  <span className="text-relic-gold block mb-1">RECOMMENDED ACTION:</span>
                  <p className="text-slate-300">{f.recommended_action}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
