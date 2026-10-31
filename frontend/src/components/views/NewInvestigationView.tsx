import React, { useState } from 'react';
import { 
  PlusCircle, GitBranch, UploadCloud, Play, Sparkles, 
  ShieldCheck, Loader2, FileArchive, ArrowRight 
} from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';

export const NewInvestigationView: React.FC = () => {
  const { investigateGithub, investigateUpload, loadDemo, isLoading } = useInvestigation();
  const [githubUrl, setGithubUrl] = useState<string>('');
  const [dragOver, setDragOver] = useState<boolean>(false);

  const handleGithubSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!githubUrl.trim()) return;
    investigateGithub(githubUrl.trim());
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.name.endsWith('.zip')) {
      alert('Only .zip archive repositories are supported.');
      return;
    }
    investigateUpload(file);
  };

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-5xl mx-auto select-none">
      {/* Header */}
      <div className="border-b border-relic-border pb-6 space-y-2">
        <div className="flex items-center space-x-2 text-relic-cyan">
          <PlusCircle className="w-5 h-5" />
          <span className="font-mono text-xs uppercase tracking-widest">
            REPOSITORY EXCAVATION PROTOCOL
          </span>
        </div>
        <h1 className="text-3xl font-bold font-mono text-slate-100">
          Start a New Investigation
        </h1>
        <p className="text-sm text-slate-400">
          Provide a public GitHub repository link, upload a ZIP archive of your codebase, or investigate our preloaded demonstration archive.
        </p>
      </div>

      {/* Grid of Methods */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Method 1: Public GitHub URL */}
        <div className="p-6 rounded-2xl bg-relic-card border border-relic-border space-y-4">
          <div className="flex items-center space-x-2 text-slate-200">
            <GitBranch className="w-5 h-5 text-relic-purple" />
            <h3 className="font-mono text-base font-bold">Investigate GitHub Repository</h3>
          </div>
          <p className="text-xs font-mono text-slate-400">
            Clones public repository into an isolated sandbox, computes AST relationships, and extracts commit history.
          </p>

          <form onSubmit={handleGithubSubmit} className="space-y-3 pt-2">
            <input
              type="url"
              placeholder="https://github.com/username/repository"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-relic-panel border border-relic-border focus:border-relic-cyan text-xs font-mono text-slate-100 placeholder-slate-500 outline-none"
            />
            <button
              type="submit"
              disabled={isLoading || !githubUrl.trim()}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-relic-cyan to-relic-purple text-black font-mono font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-relic-cyan/10 hover:opacity-90 disabled:opacity-50 transition-all"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-black" />
              ) : (
                <>
                  <span>CLONE & EXCAVATE</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Method 2: ZIP Archive Upload */}
        <div className="p-6 rounded-2xl bg-relic-card border border-relic-border space-y-4">
          <div className="flex items-center space-x-2 text-slate-200">
            <UploadCloud className="w-5 h-5 text-relic-cyan" />
            <h3 className="font-mono text-base font-bold">Upload Repository ZIP</h3>
          </div>
          <p className="text-xs font-mono text-slate-400">
            Secure sandbox upload with path-traversal protection and offline source extraction.
          </p>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              handleFileUpload(e.dataTransfer.files);
            }}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
              dragOver
                ? 'border-relic-cyan bg-relic-cyan/10'
                : 'border-relic-border/80 hover:border-slate-500 bg-relic-panel/40'
            }`}
          >
            <FileArchive className="w-8 h-8 mx-auto text-slate-400 mb-2" />
            <p className="text-xs font-mono text-slate-300">
              Drag & drop repository ZIP file here, or{' '}
              <label className="text-relic-cyan underline cursor-pointer">
                browse
                <input
                  type="file"
                  accept=".zip"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                />
              </label>
            </p>
            <span className="text-[10px] font-mono text-slate-500 mt-1 block">
              Max file size: 50MB • Path traversal protected
            </span>
          </div>
        </div>
      </div>

      {/* Method 3: Preloaded Demo Archive (The Competition Showcase) */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-relic-gold/10 via-relic-card to-relic-gold/5 border border-relic-gold/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-relic-gold/20 text-relic-gold font-mono text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>HACKTOBERFEST 2026 OFFICIAL SHOWCASE</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-mono text-slate-100">
            GHOST_ARCHIVE_DEMO (ChronoLog Telemetry Core)
          </h2>
          <p className="text-xs font-mono text-slate-300 max-w-xl">
            A self-contained forensic repository with 7 historical Git commits, intentional cryptographic vulnerabilities (MD5 session digests), orphaned socket streamers, and synthetic ground truth.
          </p>
        </div>

        <button
          onClick={loadDemo}
          disabled={isLoading}
          className="flex-shrink-0 flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-relic-gold to-relic-purple text-black font-mono font-bold text-xs shadow-xl shadow-relic-gold/20 hover:scale-105 transition-all"
        >
          <Play className="w-4 h-4 fill-black text-black" />
          <span>LOAD OFFICIAL DEMO</span>
        </button>
      </div>
    </div>
  );
};
