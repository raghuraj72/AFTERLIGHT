import React, { createContext, useContext, useState, useEffect } from 'react';
import { InvestigationResult, BenchmarkResult } from '../types';
import * as api from '../services/api';
import { audioSynth } from '../utils/audio';

interface InvestigationContextType {
  currentInvestigation: InvestigationResult | null;
  benchmark: BenchmarkResult | null;
  isLoading: boolean;
  loadingStage: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  showIntro: boolean;
  setShowIntro: (show: boolean) => void;
  soundMuted: boolean;
  toggleSound: () => void;
  viewingFile: { filePath: string; highlightLine?: number } | null;
  openFileViewer: (filePath: string, highlightLine?: number) => void;
  closeFileViewer: () => void;
  loadDemo: () => Promise<void>;
  investigateUpload: (file: File) => Promise<void>;
  investigateGithub: (url: string) => Promise<void>;
  replayIntro: () => void;
  refreshInvestigation: () => Promise<void>;
}

const InvestigationContext = createContext<InvestigationContextType | undefined>(undefined);

export const InvestigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentInvestigation, setCurrentInvestigation] = useState<InvestigationResult | null>(null);
  const [benchmark, setBenchmark] = useState<BenchmarkResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStage, setLoadingStage] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  
  // Persistence for intro: check localStorage
  const [showIntro, setShowIntroState] = useState<boolean>(() => {
    return localStorage.getItem('afterlight_seen_intro') !== 'true';
  });

  const [soundMuted, setSoundMuted] = useState<boolean>(true);
  const [viewingFile, setViewingFile] = useState<{ filePath: string; highlightLine?: number } | null>(null);

  const setShowIntro = (show: boolean) => {
    setShowIntroState(show);
    if (!show) {
      localStorage.setItem('afterlight_seen_intro', 'true');
      audioSynth.stopDrone();
    }
  };

  const replayIntro = () => {
    setShowIntroState(true);
    if (!soundMuted) {
      audioSynth.playDrone();
    }
  };

  const toggleSound = () => {
    const isNowMuted = audioSynth.toggleMute();
    setSoundMuted(isNowMuted);
  };

  const openFileViewer = (filePath: string, highlightLine?: number) => {
    audioSynth.playChirp(1000, 0.05);
    setViewingFile({ filePath, highlightLine });
  };

  const closeFileViewer = () => {
    setViewingFile(null);
  };

  const loadDemo = async () => {
    setIsLoading(true);
    setLoadingStage('Excavating GHOST_ARCHIVE_DEMO...');
    try {
      audioSynth.playChirp(800, 0.1);
      const data = await api.investigateDemo();
      setCurrentInvestigation(data.investigation);
      setBenchmark(data.benchmark);
      setShowIntro(false);
      setActiveTab('dashboard');
      audioSynth.playChirp(1400, 0.15);
    } catch (e) {
      console.error('Failed to load demo:', e);
    } finally {
      setIsLoading(false);
      setLoadingStage('');
    }
  };

  const investigateUpload = async (file: File) => {
    setIsLoading(true);
    setLoadingStage('Unpacking digital artifacts and checking sandboxes...');
    try {
      const data = await api.investigateUpload(file);
      setCurrentInvestigation(data.investigation);
      setBenchmark(data.benchmark);
      setActiveTab('dashboard');
    } catch (e) {
      console.error('Upload failed:', e);
      alert('Failed to analyze repository ZIP archive. Please verify structure.');
    } finally {
      setIsLoading(false);
      setLoadingStage('');
    }
  };

  const investigateGithub = async (url: string) => {
    setIsLoading(true);
    setLoadingStage(`Cloning public digital remains from ${url}...`);
    try {
      const data = await api.investigateGithub(url);
      setCurrentInvestigation(data.investigation);
      setBenchmark(data.benchmark);
      setActiveTab('dashboard');
    } catch (e) {
      console.error('GitHub clone failed:', e);
      alert('Failed to clone repository. Verify URL and public access.');
    } finally {
      setIsLoading(false);
      setLoadingStage('');
    }
  };

  const refreshInvestigation = async () => {
    if (!currentInvestigation) return;
    try {
      const updated = await api.fetchInvestigation(currentInvestigation.id);
      setCurrentInvestigation(updated);
    } catch (e) {
      console.error('Refresh failed:', e);
    }
  };

  // Auto-preload demo in background on startup if no current investigation
  useEffect(() => {
    const init = async () => {
      try {
        const invs = await api.fetchInvestigations();
        if (invs && invs.length > 0) {
          const first = await api.fetchInvestigation(invs[0].id);
          setCurrentInvestigation(first);
        } else {
          // pre-fetch demo
          const demo = await api.investigateDemo();
          setCurrentInvestigation(demo.investigation);
          setBenchmark(demo.benchmark);
        }
      } catch (e) {
        // Fallback demo on demand
      }
    };
    init();
  }, []);

  return (
    <InvestigationContext.Provider
      value={{
        currentInvestigation,
        benchmark,
        isLoading,
        loadingStage,
        activeTab,
        setActiveTab,
        showIntro,
        setShowIntro,
        soundMuted,
        toggleSound,
        viewingFile,
        openFileViewer,
        closeFileViewer,
        loadDemo,
        investigateUpload,
        investigateGithub,
        replayIntro,
        refreshInvestigation,
      }}
    >
      {children}
    </InvestigationContext.Provider>
  );
};

export const useInvestigation = () => {
  const context = useContext(InvestigationContext);
  if (!context) {
    throw new Error('useInvestigation must be used within an InvestigationProvider');
  }
  return context;
};
