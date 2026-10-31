import React from 'react';
import { 
  LayoutDashboard, PlusCircle, Ghost, Skull, Network, 
  History, Bot, RefreshCw, Trophy, FileText, Settings, 
  Sparkles, CheckCircle2, ShieldAlert
} from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
  badgeColor?: string;
}

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, currentInvestigation } = useInvestigation();

  const findingsCount = currentInvestigation?.findings?.length || 0;
  const criticalFindings = currentInvestigation?.findings?.filter(f => f.severity === 'high' || f.severity === 'critical').length || 0;

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'new_investigation', label: 'New Investigation', icon: PlusCircle },
    { 
      id: 'ghost_code', 
      label: 'Ghost Code', 
      icon: Ghost, 
      badge: findingsCount > 0 ? findingsCount : undefined,
      badgeColor: criticalFindings > 0 ? 'bg-relic-crimson text-white' : 'bg-relic-cyan/20 text-relic-cyan'
    },
    { id: 'graveyard', label: 'Code Graveyard', icon: Skull },
    { id: 'memory_map', label: 'Memory Map', icon: Network },
    { id: 'time_machine', label: 'Digital Timeline', icon: History },
    { id: 'ai_explorer', label: 'AI Explorer (Gemma)', icon: Bot },
    { id: 'revival_engine', label: 'Revival Engine', icon: RefreshCw },
    { id: 'ghost_hunt', label: 'Ghost Hunt Missions', icon: Trophy },
    { id: 'reports', label: 'Archaeology Reports', icon: FileText },
    { id: 'settings', label: 'Settings & Models', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-relic-charcoal border-r border-relic-border flex flex-col justify-between select-none">
      {/* Brand Header */}
      <div>
        <div className="p-6 border-b border-relic-border flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-relic-cyan to-relic-purple flex items-center justify-center shadow-lg shadow-relic-cyan/20">
            <Sparkles className="w-5 h-5 text-black" />
          </div>
          <div>
            <h1 className="font-bold text-base tracking-widest text-slate-100 uppercase">
              AFTERLIGHT
            </h1>
            <p className="font-mono text-[10px] uppercase tracking-wider text-relic-gold">
              Digital Archaeologist
            </p>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-mono text-xs transition-all ${
                  isActive
                    ? 'bg-relic-panel text-relic-cyan border border-relic-cyan/30 shadow-sm shadow-relic-cyan/10 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-relic-card'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-relic-cyan' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Status Panel */}
      <div className="p-4 m-3 rounded-xl bg-relic-panel border border-relic-border space-y-2 font-mono text-xs">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-400">ACTIVE REPO:</span>
          <span className="text-relic-cyan font-bold truncate max-w-[100px]">
            {currentInvestigation?.repo_name || 'None'}
          </span>
        </div>
        <div className="flex items-center space-x-2 text-[10px] text-slate-400 pt-1 border-t border-relic-border/60">
          <CheckCircle2 className="w-3.5 h-3.5 text-relic-emerald" />
          <span>Offline Archaeology Safe</span>
        </div>
        <div className="flex items-center space-x-2 text-[10px] text-slate-400">
          <div className="w-2 h-2 rounded-full bg-relic-cyan animate-pulse" />
          <span className="truncate">Gemma / Local Ollama RAG</span>
        </div>
      </div>
    </aside>
  );
};
