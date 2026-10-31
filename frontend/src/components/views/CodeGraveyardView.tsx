import React from 'react';
import { Skull, AlertOctagon, Clock, Flame, ShieldX } from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';

export const CodeGraveyardView: React.FC = () => {
  const { currentInvestigation, openFileViewer } = useInvestigation();

  if (!currentInvestigation) {
    return <div className="p-8 text-center text-slate-400 font-mono">No active investigation loaded.</div>;
  }

  // Extract forgotten modules, orphaned functions, and deprecated dependencies
  const graveyardItems = currentInvestigation.findings.filter(
    (f) => f.type === 'orphaned_function' || f.type === 'deprecated_dependency' || f.type === 'deprecated_crypto'
  );

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-7xl mx-auto select-none">
      {/* Atmosphere Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-relic-crimson/10 border border-relic-crimson/40 flex items-center justify-center">
          <Skull className="w-6 h-6 text-relic-crimson animate-pulse" />
        </div>
        <h1 className="text-3xl font-bold font-mono text-slate-100">
          The Code Graveyard
        </h1>
        <p className="text-sm text-slate-400">
          A solemn memorial for dead code, unreferenced socket streamers, broken cryptographic relics, and obsolete packages.
        </p>
      </div>

      {/* Tombstones Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {graveyardItems.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => openFileViewer(item.file_path, item.line_number)}
            className="group relative p-6 rounded-2xl bg-gradient-to-b from-[#151924] to-[#0c0f17] border border-relic-border hover:border-relic-crimson/60 shadow-xl transition-all cursor-pointer overflow-hidden transform hover:-translate-y-1"
          >
            {/* Tombstone Arch Indicator */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-relic-crimson/40 to-transparent" />

            <div className="flex items-center justify-between text-xs font-mono mb-4">
              <span className="text-relic-crimson font-bold flex items-center space-x-1.5">
                <Skull className="w-4 h-4" />
                <span>R.I.P.</span>
              </span>
              <span className="text-slate-500 text-[11px]">
                {item.file_path}:{item.line_number}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <h3 className="font-mono text-base font-bold text-slate-100 group-hover:text-relic-crimson transition-colors truncate">
                {item.symbol}
              </h3>
              <p className="font-mono text-xs text-slate-400 line-clamp-2">
                {item.explanation}
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-relic-panel/80 border border-relic-border/60 text-[11px] font-mono text-slate-400 space-y-1">
              <div className="flex justify-between">
                <span>Cause of Death:</span>
                <span className="text-slate-200 capitalize">{item.type.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span>Dormancy:</span>
                <span className="text-relic-gold">Over 4 Years</span>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between text-xs font-mono text-slate-500">
              <span className="text-[10px] uppercase tracking-wider text-slate-600">
                CLICK TO EXCAVATE
              </span>
              <span className="text-relic-cyan group-hover:underline">
                Inspect Tombstone →
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
