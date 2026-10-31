import React, { useState, useEffect } from 'react';
import { X, Copy, Check, FileCode, AlertTriangle } from 'lucide-react';
import { fetchFileContent } from '../../services/api';
import { useInvestigation } from '../../context/InvestigationContext';

export const CodeViewerModal: React.FC = () => {
  const { viewingFile, closeFileViewer, currentInvestigation } = useInvestigation();
  const [content, setContent] = useState<string>('');
  const [lines, setLines] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!viewingFile || !currentInvestigation) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    fetchFileContent(currentInvestigation.id, viewingFile.filePath)
      .then((res) => {
        if (!isMounted) return;
        setContent(res.content);
        setLines(res.lines);
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err.message || 'Failed to read file content');
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [viewingFile, currentInvestigation]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeFileViewer();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeFileViewer]);

  if (!viewingFile) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[85vh] flex flex-col rounded-2xl bg-relic-charcoal border border-relic-border shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-relic-border bg-relic-panel">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-relic-card border border-relic-border text-relic-cyan">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-sm font-semibold text-slate-100">
                  {viewingFile.filePath}
                </span>
                {viewingFile.highlightLine && (
                  <span className="px-2 py-0.5 rounded text-xs font-mono bg-relic-gold/10 text-relic-gold border border-relic-gold/30">
                    Line {viewingFile.highlightLine}
                  </span>
                )}
              </div>
              <p className="text-xs font-mono text-slate-400">
                Ground-truth repository artifact • {lines.length} lines
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-relic-card border border-relic-border hover:border-slate-500 text-xs font-mono text-slate-300 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-relic-emerald" />
                  <span className="text-relic-emerald">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy File</span>
                </>
              )}
            </button>
            <button
              onClick={closeFileViewer}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-relic-card transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Code Content Container */}
        <div className="flex-1 overflow-auto p-4 font-mono text-xs bg-[#0b0e14]">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3 text-slate-400">
              <div className="w-6 h-6 border-2 border-relic-cyan border-t-transparent rounded-full animate-spin" />
              <span>Excavating file source...</span>
            </div>
          ) : error ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3 text-relic-crimson">
              <AlertTriangle className="w-8 h-8" />
              <span>{error}</span>
            </div>
          ) : (
            <div className="table w-full">
              {lines.map((line, idx) => {
                const lineNum = idx + 1;
                const isTarget = lineNum === viewingFile.highlightLine;
                return (
                  <div
                    key={idx}
                    className={`table-row transition-colors ${
                      isTarget
                        ? 'bg-relic-cyan/15 border-l-4 border-relic-cyan text-slate-50 font-bold'
                        : 'hover:bg-relic-panel/40 text-slate-300'
                    }`}
                  >
                    <span
                      className={`table-cell pr-4 py-0.5 text-right select-none w-12 ${
                        isTarget ? 'text-relic-cyan font-bold' : 'text-slate-600'
                      }`}
                    >
                      {lineNum}
                    </span>
                    <span className="table-cell py-0.5 whitespace-pre font-mono">
                      {line || '\n'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-2.5 border-t border-relic-border bg-relic-panel text-xs font-mono text-slate-500 flex justify-between">
          <span>AFTERLIGHT SOURCE EVIDENCE EXPLORER</span>
          <span>PRESS ESC TO CLOSE</span>
        </div>
      </div>
    </div>
  );
};
