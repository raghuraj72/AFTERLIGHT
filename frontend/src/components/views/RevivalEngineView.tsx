import React, { useState } from 'react';
import { 
  RefreshCw, CheckCircle, XCircle, Clock, Check, 
  Code2, AlertTriangle, ShieldCheck, ChevronDown, ChevronUp 
} from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';
import { updateResurrectionItemStatus } from '../../services/api';

export const RevivalEngineView: React.FC = () => {
  const { currentInvestigation, refreshInvestigation, openFileViewer } = useInvestigation();
  const [expandedDiffs, setExpandedDiffs] = useState<Record<string, boolean>>({});

  if (!currentInvestigation) {
    return <div className="p-8 text-center text-slate-400 font-mono">No active investigation loaded.</div>;
  }

  const plan = currentInvestigation.resurrection_plan;

  const toggleDiff = (id: string) => {
    setExpandedDiffs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleStatusChange = async (itemId: string, newStatus: string) => {
    try {
      await updateResurrectionItemStatus(currentInvestigation.id, itemId, newStatus);
      await refreshInvestigation();
    } catch (e) {
      console.error('Failed to update status:', e);
    }
  };

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case 'P0':
        return 'bg-relic-crimson/20 text-relic-crimson border-relic-crimson/50';
      case 'P1':
        return 'bg-relic-gold/20 text-relic-gold border-relic-gold/50';
      case 'P2':
        return 'bg-relic-cyan/20 text-relic-cyan border-relic-cyan/50';
      default:
        return 'bg-slate-700/40 text-slate-300 border-slate-600';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'text-relic-cyan bg-relic-cyan/10 border-relic-cyan/30';
      case 'completed':
        return 'text-relic-emerald bg-relic-emerald/10 border-relic-emerald/30';
      case 'rejected':
        return 'text-slate-500 bg-slate-800 border-slate-700 line-through';
      default:
        return 'text-slate-400 bg-relic-panel border-relic-border';
    }
  };

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-6xl mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-relic-border pb-6">
        <div>
          <div className="flex items-center space-x-2 text-relic-gold mb-1">
            <RefreshCw className="w-5 h-5 animate-spin-slow" />
            <span className="font-mono text-xs uppercase tracking-widest">
              PRIORITIZED RESURRECTION ROADMAP
            </span>
          </div>
          <h1 className="text-3xl font-bold font-mono text-slate-100">
            Revival Engine
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Actionable, verified modernization steps organized by severity, complexity, and architectural value.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-lg bg-relic-panel border border-relic-border text-slate-300">
            Tasks: <strong>{plan.length}</strong>
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-relic-emerald/10 border border-relic-emerald/30 text-relic-emerald">
            Completed: <strong>{plan.filter(p => p.status === 'completed').length}</strong>
          </span>
        </div>
      </div>

      {/* Plan Items List */}
      <div className="space-y-5">
        {plan.map((item) => (
          <div
            key={item.id}
            className="p-6 rounded-2xl bg-relic-card border border-relic-border space-y-4 shadow-lg transition-all"
          >
            {/* Top row: Priority, Title, Category, Status */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold uppercase border ${getPriorityBadge(item.priority)}`}>
                  {item.priority}
                </span>
                <span className="font-mono text-base font-bold text-slate-100">
                  {item.title}
                </span>
                <span className="px-2 py-0.5 rounded bg-relic-panel text-[11px] font-mono text-slate-400 border border-relic-border">
                  {item.category.replace('_', ' ')}
                </span>
              </div>

              {/* Status & Actions */}
              <div className="flex items-center space-x-2">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold uppercase border ${getStatusBadge(item.status)}`}>
                  {item.status}
                </span>

                <button
                  onClick={() => handleStatusChange(item.id, 'accepted')}
                  disabled={item.status === 'accepted'}
                  className="px-2.5 py-1 rounded bg-relic-cyan/10 hover:bg-relic-cyan/20 border border-relic-cyan/40 text-xs font-mono text-relic-cyan transition-colors disabled:opacity-30"
                  title="Accept Recommendation"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleStatusChange(item.id, 'completed')}
                  disabled={item.status === 'completed'}
                  className="px-2.5 py-1 rounded bg-relic-emerald/10 hover:bg-relic-emerald/20 border border-relic-emerald/40 text-xs font-mono text-relic-emerald transition-colors disabled:opacity-30"
                  title="Mark as Completed"
                >
                  Done
                </button>
                <button
                  onClick={() => handleStatusChange(item.id, 'rejected')}
                  disabled={item.status === 'rejected'}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono text-slate-400 transition-colors disabled:opacity-30"
                  title="Reject"
                >
                  Skip
                </button>
              </div>
            </div>

            {/* Description & Benefit */}
            <p className="text-sm font-mono text-slate-300">
              {item.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3 rounded-xl bg-relic-panel border border-relic-border">
                <span className="text-relic-gold block mb-1">EXPECTED BENEFIT:</span>
                <p className="text-slate-300">{item.expected_benefit}</p>
              </div>

              <div className="p-3 rounded-xl bg-relic-panel border border-relic-border">
                <span className="text-slate-400 block mb-1">COMPLEXITY & RELEVANT FILES:</span>
                <p className="text-slate-300">
                  Complexity: <strong className="text-relic-cyan">{item.estimated_complexity}</strong> • Files: {item.relevant_files.join(', ')}
                </p>
              </div>
            </div>

            {/* Implementation Steps */}
            <div className="space-y-1 text-xs font-mono">
              <span className="text-slate-400 uppercase tracking-wider text-[11px] block">
                SUGGESTED IMPLEMENTATION STEPS:
              </span>
              <ul className="space-y-1 list-decimal list-inside text-slate-300 pl-1">
                {item.suggested_steps.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>

            {/* Code Diff Preview Toggle */}
            {item.diff_preview && (
              <div className="pt-2">
                <button
                  onClick={() => toggleDiff(item.id)}
                  className="flex items-center space-x-1.5 text-xs font-mono text-relic-cyan hover:underline"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>{expandedDiffs[item.id] ? 'Hide Patch Diff' : 'Preview Proposed Patch Diff'}</span>
                  {expandedDiffs[item.id] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>

                {expandedDiffs[item.id] && (
                  <pre className="mt-2 p-4 rounded-xl bg-[#0b0e14] border border-relic-border text-xs font-mono text-slate-300 overflow-x-auto whitespace-pre">
                    {item.diff_preview}
                  </pre>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
