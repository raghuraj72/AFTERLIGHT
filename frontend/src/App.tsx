import React from 'react';
import { InvestigationProvider, useInvestigation } from './context/InvestigationContext';
import { CinematicIntro } from './components/cinematic/CinematicIntro';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { CodeViewerModal } from './components/common/CodeViewerModal';

import { DashboardView } from './components/views/DashboardView';
import { NewInvestigationView } from './components/views/NewInvestigationView';
import { GhostCodeView } from './components/views/GhostCodeView';
import { CodeGraveyardView } from './components/views/CodeGraveyardView';
import { MemoryMapView } from './components/views/MemoryMapView';
import { DigitalTimelineView } from './components/views/DigitalTimelineView';
import { AiExplorerView } from './components/views/AiExplorerView';
import { RevivalEngineView } from './components/views/RevivalEngineView';
import { GhostHuntView } from './components/views/GhostHuntView';
import { ReportsView } from './components/views/ReportsView';
import { SettingsView } from './components/views/SettingsView';

const MainLayout: React.FC = () => {
  const { showIntro, activeTab } = useInvestigation();

  return (
    <div className="relative min-h-screen bg-relic-dark text-slate-100 flex flex-col font-sans overflow-hidden">
      {/* Cinematic Intro Modal / Overlay */}
      {showIntro && <CinematicIntro />}

      {/* Main App Grid */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />

        <div className="flex-1 flex flex-col min-w-0 bg-[#080a0f]">
          <Topbar />

          <main className="flex-1 overflow-y-auto">
            {activeTab === 'dashboard' && <DashboardView />}
            {activeTab === 'new_investigation' && <NewInvestigationView />}
            {activeTab === 'ghost_code' && <GhostCodeView />}
            {activeTab === 'graveyard' && <CodeGraveyardView />}
            {activeTab === 'memory_map' && <MemoryMapView />}
            {activeTab === 'time_machine' && <DigitalTimelineView />}
            {activeTab === 'ai_explorer' && <AiExplorerView />}
            {activeTab === 'revival_engine' && <RevivalEngineView />}
            {activeTab === 'ghost_hunt' && <GhostHuntView />}
            {activeTab === 'reports' && <ReportsView />}
            {activeTab === 'settings' && <SettingsView />}
          </main>
        </div>
      </div>

      {/* Code Viewer Modal */}
      <CodeViewerModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <InvestigationProvider>
      <MainLayout />
    </InvestigationProvider>
  );
};

export default App;
