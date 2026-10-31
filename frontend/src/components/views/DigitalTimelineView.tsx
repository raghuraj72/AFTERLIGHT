import React, { useState } from 'react';
import { 
  History, GitCommit, Calendar, User, FileDiff, 
  Sparkles, CheckCircle2, ChevronRight, Layers 
} from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';
import { CommitMilestone } from '../../types';

export const DigitalTimelineView: React.FC = () => {
  const { currentInvestigation, openFileViewer } = useInvestigation();
  const [selectedCommit, setSelectedCommit] = useState<CommitMilestone | null>(null);

  if (!currentInvestigation) {
    return <div className="p-8 text-center text-slate-400 font-mono">No active investigation loaded.</div>;
  }

  const commits = currentInvestigation.commits;
  const activeCommit = selectedCommit || commits[0];

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-7xl mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-relic-border pb-6">
        <div>
          <div className="flex items-center space-x-2 text-relic-purple mb-1">
            <History className="w-5 h-5" />
            <span className="font-mono text-xs uppercase tracking-widest">
              GIT ARCHAEOLOGY & TIME MACHINE
            </span>
          </div>
          <h1 className="text-3xl font-bold font-mono text-slate-100">
            Digital Time Machine
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Reconstruct repository evolution, architectural milestones, and contributor decisions from Git history.
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-lg bg-relic-panel border border-relic-border text-xs font-mono text-slate-300">
          <span>Total Commits: <strong className="text-relic-purple">{commits.length}</strong></span>
        </div>
      </div>

      {/* Main Timeline View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Commit Sequence Stream */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-relic-cyan before:via-relic-purple before:to-slate-800">
            {commits.map((commit, idx) => {
              const isSelected = activeCommit?.hash === commit.hash;
              return (
                <div
                  key={commit.hash}
                  onClick={() => setSelectedCommit(commit)}
                  className={`relative p-5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-relic-panel border-relic-purple shadow-lg shadow-relic-purple/10'
                      : 'bg-relic-card border-relic-border hover:border-slate-500'
                  }`}
                >
                  {/* Timeline Node Dot */}
                  <div
                    className={`absolute -left-[29px] top-6 w-3.5 h-3.5 rounded-full border-2 ${
                      commit.is_architectural_milestone
                        ? 'bg-relic-purple border-white shadow-[0_0_8px_rgba(139,92,246,0.8)]'
                        : isSelected
                        ? 'bg-relic-cyan border-white'
                        : 'bg-relic-charcoal border-slate-600'
                    }`}
                  />

                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-2 font-mono text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="text-relic-purple font-bold">{commit.short_hash}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-300 font-semibold">{commit.author}</span>
                    </div>
                    <span className="text-slate-500 text-[11px]">{commit.date.slice(0, 10)}</span>
                  </div>

                  <p className="text-sm font-sans font-medium text-slate-100 mb-2">
                    {commit.message}
                  </p>

                  {commit.is_architectural_milestone && (
                    <div className="p-2.5 rounded-xl bg-relic-purple/10 border border-relic-purple/30 text-xs font-mono text-relic-purpleGlow flex items-start space-x-2">
                      <Sparkles className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                      <span>{commit.milestone_reason}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Commit Forensic Inspector */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-relic-card border border-relic-border space-y-4">
            <h3 className="font-mono text-xs uppercase tracking-wider text-slate-400 flex items-center space-x-2">
              <GitCommit className="w-4 h-4 text-relic-purple" />
              <span>COMMIT INSPECTOR</span>
            </h3>

            {activeCommit && (
              <div className="space-y-4 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Commit Hash</span>
                  <code className="text-slate-200 select-all block text-[11px]">{activeCommit.hash}</code>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-lg bg-relic-panel border border-relic-border">
                    <span className="text-[10px] text-slate-500 block">AUTHOR</span>
                    <span className="font-bold text-slate-200">{activeCommit.author}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-relic-panel border border-relic-border">
                    <span className="text-[10px] text-slate-500 block">DATE</span>
                    <span className="font-bold text-slate-200">{activeCommit.date.slice(0, 10)}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 uppercase block mb-1">
                    Changed Files ({activeCommit.changed_files.length})
                  </span>
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {activeCommit.changed_files.map((file, i) => (
                      <div
                        key={i}
                        onClick={() => openFileViewer(file)}
                        className="p-2 rounded bg-relic-panel border border-relic-border/60 hover:border-relic-cyan text-slate-300 flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <span className="truncate">{file}</span>
                        <ChevronRight className="w-3 h-3 text-slate-500" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-relic-panel border border-relic-border text-[11px] text-slate-400">
                  <span className="text-relic-cyan font-bold block mb-1">VERIFICATION STATUS:</span>
                  Directly verified from local Git database objects.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
