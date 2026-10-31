import React from 'react';
import { Trophy, HelpCircle, ArrowRight, ShieldCheck, Award } from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';

export const GhostHuntView: React.FC = () => {
  const { currentInvestigation, openFileViewer } = useInvestigation();

  if (!currentInvestigation) {
    return <div className="p-8 text-center text-slate-400 font-mono">No active investigation loaded.</div>;
  }

  const missions = currentInvestigation.missions;

  const handleInspectClue = (targetFindingId: string) => {
    const finding = currentInvestigation.findings.find((f) => f.id === targetFindingId);
    if (finding) {
      openFileViewer(finding.file_path, finding.line_number);
    }
  };

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-5xl mx-auto select-none">
      {/* Header */}
      <div className="border-b border-relic-border pb-6 space-y-2">
        <div className="flex items-center space-x-2 text-relic-gold">
          <Trophy className="w-5 h-5" />
          <span className="font-mono text-xs uppercase tracking-widest">
            INTERACTIVE DEVELOPER ARCHAEOLOGY CHALLENGES
          </span>
        </div>
        <h1 className="text-3xl font-bold font-mono text-slate-100">
          Ghost Hunt Missions
        </h1>
        <p className="text-sm text-slate-400">
          Guided detective challenges. Trace cryptographic anomalies, unreferenced socket remnants, and unshielded heuristics through real source artifacts.
        </p>
      </div>

      {/* Missions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {missions.map((mission) => (
          <div
            key={mission.id}
            className="p-6 rounded-2xl bg-relic-card border border-relic-border hover:border-relic-gold/50 shadow-xl space-y-4 transition-all"
          >
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="px-2.5 py-0.5 rounded bg-relic-gold/10 text-relic-gold border border-relic-gold/30 font-bold">
                {mission.difficulty}
              </span>
              <span className="text-slate-500 font-bold">{mission.id}</span>
            </div>

            <div>
              <h3 className="text-lg font-bold font-mono text-slate-100 mb-1">
                {mission.title}
              </h3>
              <p className="text-xs font-mono text-slate-400">
                {mission.description}
              </p>
            </div>

            {/* Clue Box */}
            <div className="p-3.5 rounded-xl bg-relic-panel border border-relic-border/80 text-xs font-mono space-y-1">
              <span className="text-relic-cyan font-bold block flex items-center space-x-1">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>ARCHAEOLOGICAL CLUE:</span>
              </span>
              <p className="text-slate-300">{mission.clue}</p>
            </div>

            {/* Reward & Action */}
            <div className="pt-2 flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-xs font-mono text-slate-400">
                <Award className="w-4 h-4 text-relic-gold" />
                <span>Badge: <strong className="text-slate-200">{mission.badge}</strong></span>
              </div>

              <button
                onClick={() => handleInspectClue(mission.target_finding_id)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-relic-gold/10 hover:bg-relic-gold/20 border border-relic-gold/40 text-xs font-mono text-relic-gold transition-colors font-bold"
              >
                <span>Investigate Clue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
