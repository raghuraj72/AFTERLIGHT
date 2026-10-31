import React, { useState } from 'react';
import { HealthScoreBreakdown } from '../../types';
import { ShieldCheck, Info, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';

export const HealthGauge: React.FC<{ health: HealthScoreBreakdown }> = ({ health }) => {
  const [showFormula, setShowFormula] = useState<boolean>(false);

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-relic-emerald stroke-relic-emerald';
    if (score >= 50) return 'text-relic-gold stroke-relic-gold';
    return 'text-relic-crimson stroke-relic-crimson';
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (health.overall_score / 100) * circumference;

  return (
    <div className="p-6 rounded-2xl bg-relic-card border border-relic-border relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-relic-gold" />
          <h3 className="font-mono text-sm font-semibold tracking-wide text-slate-100 uppercase">
            Repository Health Score
          </h3>
        </div>
        <button
          onClick={() => setShowFormula(!showFormula)}
          className="flex items-center space-x-1 text-xs font-mono text-relic-cyan hover:underline"
        >
          <Info className="w-3.5 h-3.5" />
          <span>{showFormula ? 'Hide Formula' : 'Explainable Metric'}</span>
          {showFormula ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* SVG Circular Gauge */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="8"
                className="text-slate-800"
              />
              {/* Animated Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="transparent"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className={`transition-all duration-1000 ease-out ${getScoreColor(health.overall_score)}`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-4xl font-bold font-mono ${getScoreColor(health.overall_score)}`}>
                {health.overall_score}
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                / 100 PTS
              </span>
            </div>
          </div>
          <span className="text-xs font-mono text-slate-400 mt-2">
            Status: {health.overall_score >= 75 ? 'Healthy' : health.overall_score >= 50 ? 'Degraded / At Risk' : 'Critical Archaeological State'}
          </span>
        </div>

        {/* Sub-Score Bars */}
        <div className="md:col-span-2 space-y-3 font-mono text-xs">
          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>Documentation Coverage (25%)</span>
              <span className="font-bold">{health.documentation_score}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div 
                className="h-full bg-relic-cyan rounded-full transition-all duration-700" 
                style={{ width: `${health.documentation_score}%` }} 
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>Automated Test Harness (20%)</span>
              <span className="font-bold">{health.test_score}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div 
                className="h-full bg-relic-purple rounded-full transition-all duration-700" 
                style={{ width: `${health.test_score}%` }} 
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>Dependency Freshness (20%)</span>
              <span className="font-bold">{health.dependency_score}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div 
                className="h-full bg-relic-gold rounded-full transition-all duration-700" 
                style={{ width: `${health.dependency_score}%` }} 
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>Clean Code & Pruning (20%)</span>
              <span className="font-bold">{health.clean_code_score}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div 
                className="h-full bg-relic-emerald rounded-full transition-all duration-700" 
                style={{ width: `${health.clean_code_score}%` }} 
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>Commit Vitality & Contributors (15%)</span>
              <span className="font-bold">{health.commit_vitality_score}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div 
                className="h-full bg-slate-400 rounded-full transition-all duration-700" 
                style={{ width: `${health.commit_vitality_score}%` }} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Mathematical Formula */}
      {showFormula && (
        <div className="mt-6 pt-4 border-t border-relic-border/80 space-y-3 font-mono text-xs text-slate-300">
          <div className="p-3 rounded-lg bg-relic-panel border border-relic-border">
            <span className="text-relic-cyan block font-semibold mb-1">MATHEMATICAL FORMULA:</span>
            <code className="text-slate-200 block text-[11px] whitespace-pre-wrap">
              {health.formula_explanation}
            </code>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
            <div className="p-2 rounded bg-relic-panel">
              <span className="text-slate-400 block">Undocumented:</span>
              <span className="font-bold text-slate-100">{health.inputs_breakdown.undocumented_functions_count || 0}</span>
            </div>
            <div className="p-2 rounded bg-relic-panel">
              <span className="text-slate-400 block">Missing Tests:</span>
              <span className="font-bold text-relic-crimson">{health.inputs_breakdown.missing_tests_flagged || 0}</span>
            </div>
            <div className="p-2 rounded bg-relic-panel">
              <span className="text-slate-400 block">Deprecated Deps:</span>
              <span className="font-bold text-relic-gold">{health.inputs_breakdown.deprecated_dependencies_count || 0}</span>
            </div>
            <div className="p-2 rounded bg-relic-panel">
              <span className="text-slate-400 block">Crypto Vulnerabilities:</span>
              <span className="font-bold text-relic-crimson">{health.inputs_breakdown.deprecated_crypto_count || 0}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
