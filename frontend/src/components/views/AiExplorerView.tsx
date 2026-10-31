import React, { useState } from 'react';
import { 
  Bot, Send, Sparkles, FileCode, GitCommit, CheckCircle2, 
  HelpCircle, ArrowUpRight, Loader2, ShieldCheck 
} from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';
import { askAiQuestion } from '../../services/api';
import { AiAnswerResponse } from '../../types';

export const AiExplorerView: React.FC = () => {
  const { currentInvestigation, openFileViewer } = useInvestigation();
  const [question, setQuestion] = useState<string>('What was this project originally designed to do?');
  const [loading, setLoading] = useState<boolean>(false);
  const [history, setHistory] = useState<{ question: string; answer: AiAnswerResponse }[]>([]);

  if (!currentInvestigation) {
    return <div className="p-8 text-center text-slate-400 font-mono">No active investigation loaded.</div>;
  }

  const handleAsk = async (queryText?: string) => {
    const q = (queryText || question).trim();
    if (!q || loading) return;

    setLoading(true);
    try {
      const response = await askAiQuestion(currentInvestigation.id, q);
      setHistory((prev) => [{ question: q, answer: response }, ...prev]);
      if (!queryText) setQuestion('');
    } catch (e) {
      console.error('AI question failed:', e);
      alert('Failed to obtain AI answer. Please verify local Gemma / backend status.');
    } finally {
      setLoading(false);
    }
  };

  const sampleQuestions = [
    'What was this project originally designed to do?',
    'Explain the security vulnerabilities in auth_legacy.py',
    'Which modules are unreferenced and safe to prune?',
    'What is the recommended 7-step modernization roadmap?'
  ];

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-5xl mx-auto select-none">
      {/* Header */}
      <div className="border-b border-relic-border pb-6 space-y-2">
        <div className="flex items-center space-x-2 text-relic-cyan">
          <Bot className="w-5 h-5" />
          <span className="font-mono text-xs uppercase tracking-widest">
            GEMMA REASONING ENGINE // EVIDENCE RETRIEVAL RAG
          </span>
        </div>
        <h1 className="text-3xl font-bold font-mono text-slate-100">
          AI Repository Explorer
        </h1>
        <p className="text-sm text-slate-400">
          Consult Gemma regarding architectural intent, legacy algorithms, and buried decisions. Every answer is strictly grounded in retrieved AST chunks and Git commits.
        </p>
      </div>

      {/* Query Input Box */}
      <div className="space-y-3">
        <div className="relative flex items-center">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            placeholder="Ask anything about the codebase (e.g. What was this project originally designed to do?)..."
            className="w-full pl-5 pr-28 py-4 rounded-2xl bg-relic-card border border-relic-border focus:border-relic-cyan text-sm font-mono text-slate-100 placeholder-slate-500 shadow-xl outline-none transition-all"
          />
          <button
            onClick={() => handleAsk()}
            disabled={loading || !question.trim()}
            className="absolute right-3 px-5 py-2.5 rounded-xl bg-gradient-to-r from-relic-cyan to-relic-purple text-black font-mono font-bold text-xs flex items-center space-x-2 shadow-md shadow-relic-cyan/20 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 transition-all"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-black" />
            ) : (
              <>
                <span>EXCAVATE</span>
                <Send className="w-3.5 h-3.5 text-black" />
              </>
            )}
          </button>
        </div>

        {/* Suggested Queries */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] font-mono text-slate-500">SAMPLE PROMPTS:</span>
          {sampleQuestions.map((sq, i) => (
            <button
              key={i}
              onClick={() => {
                setQuestion(sq);
                handleAsk(sq);
              }}
              className="px-2.5 py-1 rounded-lg bg-relic-panel border border-relic-border/80 hover:border-relic-cyan text-[11px] font-mono text-slate-300 hover:text-relic-cyan transition-colors"
            >
              {sq}
            </button>
          ))}
        </div>
      </div>

      {/* Answers Stream */}
      <div className="space-y-6">
        {history.length === 0 && !loading && (
          <div className="p-12 text-center rounded-2xl bg-relic-card border border-relic-border space-y-4">
            <div className="w-12 h-12 mx-auto rounded-xl bg-relic-panel border border-relic-border flex items-center justify-center text-relic-cyan">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <h3 className="font-mono text-base font-bold text-slate-200">
              Ready to Reconstruct Project Memory
            </h3>
            <p className="text-xs font-mono text-slate-400 max-w-md mx-auto">
              Click the prompt above to ask Gemma the primary question: "What was this project originally designed to do?"
            </p>
          </div>
        )}

        {loading && (
          <div className="p-8 rounded-2xl bg-relic-card border border-relic-border flex flex-col items-center justify-center space-y-3">
            <div className="w-8 h-8 border-2 border-relic-cyan border-t-transparent rounded-full animate-spin" />
            <span className="font-mono text-xs text-relic-cyan animate-pulse">
              Retrieving code chunks, scoring commit history, and synthesizing answer...
            </span>
          </div>
        )}

        {history.map((item, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl bg-relic-card border border-relic-border shadow-xl space-y-5"
          >
            {/* User Question */}
            <div className="flex items-center space-x-2 text-xs font-mono text-slate-400 pb-2 border-b border-relic-border/60">
              <span className="text-relic-cyan font-bold">USER QUERY:</span>
              <span className="text-slate-200 font-semibold">{item.question}</span>
            </div>

            {/* AI Synthesized Answer */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded bg-relic-purple/10 border border-relic-purple/30 text-relic-purple font-mono text-[11px]">
                  <Bot className="w-3.5 h-3.5" />
                  <span>{item.answer.model_used}</span>
                </div>
                <span className="text-xs font-mono text-relic-cyan font-bold">
                  Confidence: {(item.answer.confidence * 100).toFixed(0)}%
                </span>
              </div>

              {/* Formatted Markdown-like Response Body */}
              <div className="font-mono text-xs sm:text-sm text-slate-200 whitespace-pre-wrap leading-relaxed p-4 rounded-xl bg-[#0b0e14] border border-relic-border">
                {item.answer.answer}
              </div>
            </div>

            {/* Clickable Source Citations */}
            {item.answer.source_citations.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="font-mono text-xs text-slate-400 uppercase tracking-wider block">
                  CLICKABLE SOURCE CITATIONS (OPENS CODE VIEWER):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {item.answer.source_citations.map((cite, cIdx) => (
                    <button
                      key={cIdx}
                      onClick={() => openFileViewer(cite.file_path, cite.line_start)}
                      className="p-3 rounded-xl bg-relic-panel border border-relic-border hover:border-relic-cyan text-left flex items-start justify-between group transition-all"
                    >
                      <div className="space-y-1 overflow-hidden">
                        <div className="flex items-center space-x-1.5 text-xs font-mono font-bold text-slate-200 group-hover:text-relic-cyan transition-colors">
                          <FileCode className="w-3.5 h-3.5 text-relic-cyan flex-shrink-0" />
                          <span className="truncate">{cite.file_path}</span>
                        </div>
                        <span className="text-[11px] font-mono text-relic-gold block">
                          Lines {cite.line_start}–{cite.line_end}
                        </span>
                        <p className="text-[11px] font-mono text-slate-400 line-clamp-1">
                          {cite.explanation}
                        </p>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-relic-cyan group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-2" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Commit Citations */}
            {item.answer.commit_citations.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-relic-border/60">
                <span className="font-mono text-xs text-slate-400 uppercase tracking-wider block">
                  HISTORICAL COMMIT GROUNDING:
                </span>
                <div className="space-y-1.5">
                  {item.answer.commit_citations.map((c, ci) => (
                    <div
                      key={ci}
                      className="p-2.5 rounded-lg bg-relic-panel border border-relic-border/60 text-xs font-mono text-slate-300 flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        <GitCommit className="w-3.5 h-3.5 text-relic-purple" />
                        <span className="text-relic-purple font-bold">{c.commit_hash.slice(0, 7)}</span>
                        <span className="text-slate-400">• {c.message}</span>
                      </div>
                      <span className="text-[11px] text-slate-500">{c.author}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
