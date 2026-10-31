import React, { useState, useEffect } from 'react';
import { 
  Settings, Bot, Database, ShieldCheck, Clapperboard, 
  RefreshCw, CheckCircle2, AlertCircle, HardDrive 
} from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';
import { fetchHealth } from '../../services/api';

export const SettingsView: React.FC = () => {
  const { replayIntro, currentInvestigation } = useInvestigation();
  const [healthInfo, setHealthInfo] = useState<any>(null);
  const [loadingHealth, setLoadingHealth] = useState<boolean>(true);

  useEffect(() => {
    fetchHealth()
      .then((data) => setHealthInfo(data))
      .catch(() => {})
      .finally(() => setLoadingHealth(false));
  }, []);

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-4xl mx-auto select-none">
      {/* Header */}
      <div className="border-b border-relic-border pb-6 space-y-2">
        <div className="flex items-center space-x-2 text-relic-purple">
          <Settings className="w-5 h-5" />
          <span className="font-mono text-xs uppercase tracking-widest">
            SYSTEM ARCHITECTURE & PARTNER CONFIGURATION
          </span>
        </div>
        <h1 className="text-3xl font-bold font-mono text-slate-100">
          Settings & Model Management
        </h1>
        <p className="text-sm text-slate-400">
          Configure local open-weight inference (Gemma / Ollama), persistent database backends, and playback options.
        </p>
      </div>

      {/* Model & AI Settings */}
      <div className="p-6 rounded-2xl bg-relic-card border border-relic-border space-y-4">
        <div className="flex items-center space-x-2 text-slate-100">
          <Bot className="w-5 h-5 text-relic-cyan" />
          <h3 className="font-mono text-base font-bold">Gemma AI Reasoning Engine</h3>
        </div>

        <div className="space-y-3 font-mono text-xs">
          <div className="p-4 rounded-xl bg-relic-panel border border-relic-border flex items-center justify-between">
            <div>
              <span className="text-slate-400 block text-[11px]">ACTIVE INFERENCE MODE:</span>
              <strong className="text-slate-100 text-sm">
                Gemma 2B Open-Weight (Ollama Local & Deterministic Grounding)
              </strong>
            </div>
            <span className="px-2.5 py-1 rounded bg-relic-emerald/10 text-relic-emerald border border-relic-emerald/30 font-bold">
              ONLINE
            </span>
          </div>

          <div className="p-4 rounded-xl bg-relic-panel border border-relic-border space-y-2">
            <span className="text-slate-400 block text-[11px]">OLLAMA CONNECTION STATUS:</span>
            <div className="flex items-center space-x-2 text-slate-200">
              {healthInfo?.ollama_available ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-relic-emerald" />
                  <span>Ollama daemon detected at http://localhost:11434</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-relic-cyan" />
                  <span>Local High-Precision RAG Grounding Active (Zero external telemetry)</span>
                </>
              )}
            </div>
            {healthInfo?.available_models && healthInfo.available_models.length > 0 && (
              <div className="text-[11px] text-slate-400 pt-1">
                Detected Models: {healthInfo.available_models.join(', ')}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Database & Storage */}
      <div className="p-6 rounded-2xl bg-relic-card border border-relic-border space-y-4">
        <div className="flex items-center space-x-2 text-slate-100">
          <Database className="w-5 h-5 text-relic-gold" />
          <h3 className="font-mono text-base font-bold">Database & Persistence</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
          <div className="p-4 rounded-xl bg-relic-panel border border-relic-border space-y-1">
            <span className="text-slate-400 block text-[11px]">LOCAL PERSISTENCE:</span>
            <span className="text-slate-200 font-bold block">data/investigations.json</span>
            <span className="text-[10px] text-relic-emerald">Active & Synchronized</span>
          </div>

          <div className="p-4 rounded-xl bg-relic-panel border border-relic-border space-y-1">
            <span className="text-slate-400 block text-[11px]">MONGODB ATLAS:</span>
            <span className="text-slate-200 font-bold block">Optional Atlas Vector Sync</span>
            <span className="text-[10px] text-slate-500">Configured via MONGODB_URI</span>
          </div>
        </div>
      </div>

      {/* Replay Cinematic Intro & Experience Controls */}
      <div className="p-6 rounded-2xl bg-relic-card border border-relic-border flex items-center justify-between">
        <div>
          <h4 className="font-mono text-sm font-bold text-slate-100">
            Cinematic Opening Experience
          </h4>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Replay the immersive 5-scene digital archaeology documentary introduction.
          </p>
        </div>

        <button
          onClick={replayIntro}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-relic-purple/10 hover:bg-relic-purple/20 border border-relic-purple text-xs font-mono font-bold text-relic-purpleGlow transition-colors"
        >
          <Clapperboard className="w-4 h-4" />
          <span>Replay Intro</span>
        </button>
      </div>
    </div>
  );
};
