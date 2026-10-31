import React from 'react';
import { 
  Play, Volume2, VolumeX, Clapperboard, FolderGit2, 
  ShieldCheck, Loader2, RefreshCw 
} from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';

export const Topbar: React.FC = () => {
  const { 
    currentInvestigation, loadDemo, replayIntro, soundMuted, 
    toggleSound, isLoading, loadingStage 
  } = useInvestigation();

  return (
    <header className="h-16 px-6 bg-relic-charcoal/80 border-b border-relic-border flex items-center justify-between backdrop-blur-md z-30 select-none">
      {/* Left: Active Repository & Investigation Status */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-relic-panel border border-relic-border">
          <FolderGit2 className="w-4 h-4 text-relic-cyan" />
          <span className="font-mono text-xs text-slate-300">
            {currentInvestigation ? currentInvestigation.repo_name : 'No Investigation Loaded'}
          </span>
          {currentInvestigation?.is_demo && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-relic-gold/20 text-relic-gold font-bold">
              OFFICIAL DEMO
            </span>
          )}
        </div>

        {isLoading && (
          <div className="flex items-center space-x-2 text-xs font-mono text-relic-cyan animate-pulse">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>{loadingStage || 'Processing digital excavation...'}</span>
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3">
        {/* Prominent Demo Entry Point */}
        <button
          onClick={loadDemo}
          disabled={isLoading}
          className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-relic-gold/20 to-relic-purple/20 border border-relic-gold hover:border-relic-goldGlow text-xs font-mono font-bold text-slate-100 shadow-md shadow-relic-gold/10 hover:shadow-relic-gold/20 transition-all"
          title="Instantly analyze preloaded GHOST_ARCHIVE_DEMO"
        >
          <Play className="w-3.5 h-3.5 text-relic-gold fill-relic-gold/20" />
          <span>EXPLORE THE GHOST ARCHIVE</span>
        </button>

        {/* Health Score Pill */}
        {currentInvestigation && (
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-relic-panel border border-relic-border text-xs font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-relic-emerald" />
            <span className="text-slate-400">Health:</span>
            <span className="font-bold text-slate-100">
              {currentInvestigation.health.overall_score}/100
            </span>
          </div>
        )}

        {/* Replay Intro */}
        <button
          onClick={replayIntro}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-relic-panel border border-relic-border hover:border-slate-500 text-xs font-mono text-slate-300 hover:text-slate-100 transition-colors"
          title="Replay Cinematic Interactive Intro"
        >
          <Clapperboard className="w-3.5 h-3.5 text-relic-purple" />
          <span className="hidden md:inline">Replay Intro</span>
        </button>

        {/* Audio Toggle */}
        <button
          onClick={toggleSound}
          className="p-2 rounded-lg bg-relic-panel border border-relic-border hover:border-relic-cyan text-slate-300 transition-colors"
          title={soundMuted ? 'Unmute procedural audio' : 'Mute audio'}
        >
          {soundMuted ? (
            <VolumeX className="w-4 h-4 text-slate-400" />
          ) : (
            <Volume2 className="w-4 h-4 text-relic-cyan animate-pulse" />
          )}
        </button>
      </div>
    </header>
  );
};
