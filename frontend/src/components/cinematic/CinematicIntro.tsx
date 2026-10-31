import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Volume2, VolumeX, FastForward, Sparkles, Terminal, 
  Layers, Compass, ArrowRight, ShieldCheck, Play 
} from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';

export const CinematicIntro: React.FC = () => {
  const { setShowIntro, loadDemo, setActiveTab, soundMuted, toggleSound } = useInvestigation();
  const [currentScene, setCurrentScene] = useState<number>(1);
  const [typedText, setTypedText] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });

  // Scene automated progression timings (user can also advance or skip anytime)
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setCurrentScene(5);
      return;
    }

    let timer: any;
    if (currentScene === 1) {
      timer = setTimeout(() => setCurrentScene(2), 5500);
    } else if (currentScene === 2) {
      timer = setTimeout(() => setCurrentScene(3), 6000);
    } else if (currentScene === 3) {
      timer = setTimeout(() => setCurrentScene(4), 6000);
    } else if (currentScene === 4) {
      timer = setTimeout(() => setCurrentScene(5), 5500);
    }
    return () => clearTimeout(timer);
  }, [currentScene]);

  // Keyboard navigation: Escape = Skip, Space/Right = Next
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowIntro(false);
      } else if (e.key === ' ' || e.key === 'ArrowRight') {
        if (currentScene < 5) {
          setCurrentScene((prev) => prev + 1);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentScene, setShowIntro]);

  // Real-time interactive canvas particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Particle array
    const particles = Array.from({ length: 65 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      radius: Math.random() * 2 + 0.8,
      alpha: Math.random() * 0.5 + 0.2,
      codeChar: ['0', '1', ';', '{', '}', '>', '<', 'fn', 'void', '0x'][Math.floor(Math.random() * 10)],
      isCode: Math.random() > 0.6
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw faint cyber grid
      ctx.strokeStyle = 'rgba(26, 31, 46, 0.4)';
      ctx.lineWidth = 1;
      const gridSize = 80;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Update and draw particles
      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Mouse interaction
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          p.x -= (dx / dist) * 1.5;
          p.y -= (dy / dist) * 1.5;
        }

        if (p.isCode) {
          ctx.font = '10px monospace';
          ctx.fillStyle = `rgba(6, 182, 212, ${p.alpha * 0.8})`;
          ctx.fillText(p.codeChar, p.x, p.y);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(139, 92, 246, ${p.alpha})`;
          ctx.fill();
        }

        // Draw connections between nearby particles
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist2 = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist2 < 85) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(6, 182, 212, ${0.12 * (1 - dist2 / 85)})`;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleBeginInvestigation = () => {
    setShowIntro(false);
    setActiveTab('new_investigation');
  };

  const handleExploreLiveDemo = async () => {
    await loadDemo();
  };

  const handleSkipIntro = () => {
    setShowIntro(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#06070a] text-slate-100 flex flex-col justify-between overflow-hidden select-none">
      {/* Background Interactive Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-auto" />

      {/* Cyber Ambient Scanline Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-relic-purple/10 via-transparent to-black/90 pointer-events-none" />

      {/* Top Bar Controls */}
      <div className="relative z-20 flex justify-between items-center p-6 sm:px-12">
        <div className="flex items-center space-x-3">
          <div className="h-2 w-2 rounded-full bg-relic-cyan animate-ping" />
          <span className="font-mono text-xs uppercase tracking-widest text-slate-400">
            DEEP ARCHAEOLOGY RECONSTRUCTION PROTOCOL // SCENE {currentScene}/5
          </span>
        </div>

        <div className="flex items-center space-x-4">
          {/* Sound Toggle Button */}
          <button
            onClick={toggleSound}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-relic-panel/80 border border-relic-border/80 hover:border-relic-cyan text-xs font-mono text-slate-300 transition-colors backdrop-blur-md"
            title={soundMuted ? 'Unmute atmospheric audio' : 'Mute audio'}
          >
            {soundMuted ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-400">MUTED</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-relic-cyan animate-pulse" />
                <span className="text-relic-cyan">AUDIO ON</span>
              </>
            )}
          </button>

          {/* Skip Intro Button */}
          <button
            onClick={handleSkipIntro}
            className="flex items-center space-x-2 px-4 py-1.5 rounded-full bg-relic-panel/80 border border-relic-border/80 hover:border-relic-gold text-xs font-mono text-slate-300 hover:text-relic-gold transition-colors backdrop-blur-md"
          >
            <span>SKIP INTRO</span>
            <FastForward className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Central Storyline Viewport */}
      <div className="relative z-20 flex-1 flex items-center justify-center px-6">
        <AnimatePresence mode="wait">
          {/* SCENE 1: THE FORGOTTEN DIGITAL WORLD */}
          {currentScene === 1 && (
            <motion.div
              key="scene-1"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="text-center max-w-3xl space-y-6"
            >
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded border border-relic-cyan/30 bg-relic-cyan/5 text-relic-cyan font-mono text-xs tracking-wider">
                <Terminal className="w-3.5 h-3.5" />
                <span>EPOCH ARCHIVE // INITIAL DISCOVERY</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-light tracking-wide text-slate-200">
                Somewhere in the digital world...
              </h1>
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8, duration: 1 }}
                className="text-xl sm:text-2xl text-slate-400 font-light"
              >
                Thousands of software projects were created.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 3.4, duration: 1 }}
                className="text-lg sm:text-xl text-relic-gold font-mono tracking-wide"
              >
                "But not all of them survived."
              </motion.p>

              {/* Floating fragmented code indicators */}
              <div className="pt-8 flex justify-center space-x-4 opacity-40 font-mono text-xs text-slate-500">
                <span className="animate-pulse">commit 38eadad (2021)</span>
                <span>•</span>
                <span>ref/heads/master</span>
                <span>•</span>
                <span>telemetry_buffer.c</span>
              </div>
            </motion.div>
          )}

          {/* SCENE 2: THE DIGITAL GRAVEYARD */}
          {currentScene === 2 && (
            <motion.div
              key="scene-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 1.2 }}
              className="text-center max-w-3xl space-y-6"
            >
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded border border-relic-crimson/30 bg-relic-crimson/5 text-relic-crimson font-mono text-xs tracking-wider">
                <Layers className="w-3.5 h-3.5" />
                <span>SECTOR 04 // ABANDONED REPOSITORIES</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-light tracking-wide text-slate-100">
                The Digital Graveyard
              </h2>
              <div className="space-y-3 font-mono text-base sm:text-lg text-slate-300">
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                  Developers moved on.
                </motion.p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}>
                  Documentation disappeared.
                </motion.p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.8 }}>
                  Knowledge became buried.
                </motion.p>
                <motion.p 
                  initial={{ opacity: 0, scale: 0.95 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  transition={{ delay: 3.8 }}
                  className="text-relic-cyan text-xl pt-2 font-sans tracking-wide"
                >
                  "But the code remained."
                </motion.p>
              </div>

              {/* Graveyard Visual Relics */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ delay: 4 }}
                className="grid grid-cols-3 gap-3 max-w-lg mx-auto pt-6 text-xs font-mono text-slate-400"
              >
                <div className="p-2.5 rounded bg-relic-panel border border-relic-border/60">
                  <span className="text-relic-crimson block font-bold">404 REPO</span>
                  Unmaintained
                </div>
                <div className="p-2.5 rounded bg-relic-panel border border-relic-border/60">
                  <span className="text-relic-gold block font-bold">ORPHAN</span>
                  Zero Callers
                </div>
                <div className="p-2.5 rounded bg-relic-panel border border-relic-border/60">
                  <span className="text-relic-purple block font-bold">LEGACY</span>
                  Broken Hash
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* SCENE 3: THE SIGNAL */}
          {currentScene === 3 && (
            <motion.div
              key="scene-3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 1.2 }}
              className="text-center max-w-3xl space-y-6"
            >
              <div className="relative inline-block">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded border border-relic-cyan/50 bg-relic-cyan/10 text-relic-cyan font-mono text-xs tracking-wider animate-pulse">
                  <Compass className="w-3.5 h-3.5" />
                  <span>ARCHAEOLOGICAL SCAN // INCOMING SIGNAL</span>
                </div>
                {/* Horizontal Scanning Line */}
                <div className="absolute -inset-x-20 top-1/2 h-0.5 bg-gradient-to-r from-transparent via-relic-cyan to-transparent animate-pulse" />
              </div>

              <h2 className="text-3xl sm:text-5xl font-light tracking-wide text-slate-100">
                The Signal
              </h2>
              <p className="text-lg sm:text-xl text-slate-300 font-light">
                Somewhere inside the code...
              </p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8 }}
                className="text-xl sm:text-2xl text-relic-cyan font-mono"
              >
                Fragments of its original purpose still exist.
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3.5 }}
                className="text-2xl sm:text-3xl font-serif text-slate-100 italic pt-2"
              >
                "What if forgotten code could speak again?"
              </motion.p>

              {/* Scanning stream simulation */}
              <div className="pt-6 flex justify-center items-center space-x-3 text-xs font-mono text-relic-cyan">
                <span className="animate-spin text-base">⌖</span>
                <span>Scanning AST Nodes: 100% | Reconstructing Git Commits: 7 found</span>
              </div>
            </motion.div>
          )}

          {/* SCENE 4: THE AWAKENING */}
          {currentScene === 4 && (
            <motion.div
              key="scene-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="text-center max-w-3xl space-y-6"
            >
              {/* Glowing Cinematic Logo */}
              <div className="relative mx-auto w-24 h-24 mb-6 flex items-center justify-center">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-relic-cyan via-relic-purple to-relic-gold opacity-40 blur-xl animate-pulse" />
                <div className="relative w-20 h-20 rounded-2xl bg-relic-card border border-relic-border flex items-center justify-center shadow-2xl">
                  <Sparkles className="w-10 h-10 text-relic-cyan animate-spin-slow" />
                </div>
              </div>

              <motion.h1 
                initial={{ letterSpacing: '0.1em' }}
                animate={{ letterSpacing: '0.25em' }}
                transition={{ duration: 3 }}
                className="text-5xl sm:text-7xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-relic-cyan to-relic-purple uppercase"
              >
                AFTERLIGHT
              </motion.h1>
              <p className="font-mono text-sm sm:text-base text-relic-gold tracking-widest uppercase">
                THE DIGITAL ARCHAEOLOGIST
              </p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="text-xl sm:text-2xl text-slate-300 font-serif italic pt-4"
              >
                "Some code deserves a second life."
              </motion.p>
            </motion.div>
          )}

          {/* SCENE 5: INTERACTIVE ENTRY */}
          {currentScene === 5 && (
            <motion.div
              key="scene-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-2xl w-full space-y-8"
            >
              <div className="space-y-3">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-relic-cyan/40 bg-relic-cyan/10 text-relic-cyan font-mono text-xs tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>SYSTEM READY // ENTER ARCHAEOLOGY LAB</span>
                </div>
                <h2 className="text-4xl sm:text-5xl font-bold tracking-wide text-slate-100">
                  Begin The Excavation
                </h2>
                <p className="text-slate-400 font-light text-sm sm:text-base max-w-md mx-auto">
                  Investigate forgotten repositories, discover ghost code, consult Gemma, and generate resurrection plans.
                </p>
              </div>

              {/* The 3 Interactive Entry Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto pt-2">
                {/* 1. BEGIN INVESTIGATION */}
                <button
                  onClick={handleBeginInvestigation}
                  className="group relative flex items-center justify-center space-x-3 p-4 rounded-xl bg-gradient-to-r from-relic-cyan/20 to-relic-purple/20 border border-relic-cyan hover:border-relic-cyanGlow text-slate-100 shadow-lg shadow-relic-cyan/10 hover:shadow-relic-cyan/30 transition-all transform hover:-translate-y-0.5"
                >
                  <Compass className="w-5 h-5 text-relic-cyan group-hover:rotate-45 transition-transform" />
                  <div className="text-left">
                    <div className="font-mono text-xs uppercase tracking-wider text-relic-cyan">Protocol 1</div>
                    <div className="font-semibold text-sm">BEGIN INVESTIGATION</div>
                  </div>
                  <ArrowRight className="w-4 h-4 ml-auto text-slate-400 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* 2. EXPLORE LIVE DEMO */}
                <button
                  onClick={handleExploreLiveDemo}
                  className="group relative flex items-center justify-center space-x-3 p-4 rounded-xl bg-gradient-to-r from-relic-gold/20 to-relic-purple/20 border border-relic-gold hover:border-relic-goldGlow text-slate-100 shadow-lg shadow-relic-gold/10 hover:shadow-relic-gold/30 transition-all transform hover:-translate-y-0.5"
                >
                  <Play className="w-5 h-5 text-relic-gold fill-relic-gold/20 group-hover:scale-110 transition-transform" />
                  <div className="text-left">
                    <div className="font-mono text-xs uppercase tracking-wider text-relic-gold">Ghost Archive</div>
                    <div className="font-semibold text-sm">EXPLORE LIVE DEMO</div>
                  </div>
                  <ArrowRight className="w-4 h-4 ml-auto text-slate-400 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* 3. SKIP INTRO (Secondary Action) */}
              <div>
                <button
                  onClick={handleSkipIntro}
                  className="text-xs font-mono text-slate-400 hover:text-slate-200 transition-colors uppercase tracking-wider underline underline-offset-4"
                >
                  Skip Directly to Dashboard
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Progress Bar & Scene Navigator */}
      <div className="relative z-20 flex flex-col sm:flex-row justify-between items-center px-6 sm:px-12 py-6 border-t border-relic-border/40 backdrop-blur-sm">
        <div className="flex items-center space-x-2 mb-3 sm:mb-0">
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              onClick={() => setCurrentScene(s)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentScene === s
                  ? 'w-10 bg-relic-cyan shadow-[0_0_8px_rgba(6,182,212,0.8)]'
                  : currentScene > s
                  ? 'w-4 bg-slate-600'
                  : 'w-4 bg-slate-800 hover:bg-slate-700'
              }`}
              title={`Jump to Scene ${s}`}
            />
          ))}
        </div>

        <div className="flex items-center space-x-6 text-xs font-mono text-slate-500">
          <span>ESC to Skip</span>
          <span>•</span>
          <span>SPACE / → to Advance</span>
          <span>•</span>
          <span className="text-relic-gold font-serif italic">Hacktoberfest 2026</span>
        </div>
      </div>
    </div>
  );
};
