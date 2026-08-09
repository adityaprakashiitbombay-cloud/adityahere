import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Cpu, Play, Sparkles, CheckCircle2 } from 'lucide-react';
import TerminalTextEffect from './TerminalTextEffect';
import BrandLogo from './BrandLogo';

export default function EntrySplash({ onFinish, onComplete }) {
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);
  const hasFinishedRef = useRef(false);

  const bootLogs = [
    "initializing adityahere. matrix v5.0...",
    "preloading main page assets & profile memory...",
    "verifying academic scores: class 10th (95.4%)...",
    "verifying perfect score: information technology 100/100...",
    "connecting allen patna (ashiyana digha branch) node...",
    "synchronizing secular values: atheist / feminist / leftist...",
    "system matrix ready. launching portfolio..."
  ];

  const handleFinish = () => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    if (onFinish) onFinish();
    if (onComplete) onComplete();
  };

  const progressRef = useRef(0);
  progressRef.current = progress;

  useEffect(() => {
    // 2.5s 60FPS Continuous Butter-Smooth Preloader
    const duration = 2500;
    const startTime = performance.now();
    let animId;

    const updateProgress = (now) => {
      const elapsed = now - startTime;
      const pct = Math.min(100, (elapsed / duration) * 100);
      setProgress(pct);
      if (pct < 100) {
        animId = requestAnimationFrame(updateProgress);
      }
    };

    animId = requestAnimationFrame(updateProgress);

    const logTimer = setInterval(() => {
      setLogIndex((prev) => (prev < bootLogs.length - 1 ? prev + 1 : prev));
    }, 350);

    const handleGesture = (e) => {
      if (e.type === 'keydown') {
        if (e.key === 'Enter' || e.key === ' ' || e.code === 'Space') {
          if (progressRef.current >= 100) {
            handleFinish();
          }
        }
      }
    };

    window.addEventListener('keydown', handleGesture);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      clearInterval(logTimer);
      window.removeEventListener('keydown', handleGesture);
    };
  }, []);

  const isReady = progress >= 100;

  return (
    <motion.div
      key="splash"
      initial={{ opacity: 1 }}
      exit={{ y: "-100vh", opacity: 0 }}
      transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
      onClick={() => {
        if (isReady) handleFinish();
      }}
      className={`fixed inset-0 z-50 bg-[#000000] text-white flex flex-col items-center justify-center p-4 sm:p-6 selection:bg-[#39FF14] selection:text-black font-mono overflow-hidden ${
        isReady ? 'cursor-pointer' : 'cursor-wait'
      }`}
    >
      {/* Background Matrix Grid Overlay with Motion Scanline */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#39FF140c_1px,transparent_1px),linear-gradient(to_bottom,#39FF140c_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#39FF1415] to-transparent h-48 w-full animate-pulse pointer-events-none" />

      {/* Outer Technical Cyber Box with Single Dynamic Neon Shadow */}
      <div className="w-full max-w-2xl bg-[#000000] border-3 border-white p-6 md:p-10 relative shadow-[8px_8px_0px_0px_#39FF14] z-10 overflow-hidden group">

        {/* Corner Neon Markers */}
        <span className="absolute top-2 left-2 text-[#39FF14] text-sm font-bold select-none">┌</span>
        <span className="absolute top-2 right-2 text-[#00E5FF] text-sm font-bold select-none">┐</span>
        <span className="absolute bottom-2 left-2 text-[#FF007F] text-sm font-bold select-none">└</span>
        <span className="absolute bottom-2 right-2 text-[#FFE600] text-sm font-bold select-none">┘</span>

        {/* Top Status Header Bar */}
        <div className="flex items-center justify-between border-b-2 border-white pb-3 mb-6">
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" />
            <span className="text-xs font-bold text-white lowercase tracking-wider flex items-center gap-1.5 font-mono">
              <Cpu className="w-4 h-4 text-[#39FF14] animate-pulse" /> system boot // stage 1
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#00E5FF] font-mono lowercase hidden sm:inline">
              [ {isReady ? 'system ready' : 'readying main page'} ]
            </span>
            <span className="text-xs text-[#39FF14] font-black font-mono tabular-nums">
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        {/* Main Logo & Lowercase Title */}
        <div className="text-center my-6 space-y-3">
          <div className="inline-block bg-[#050505] border-2 border-[#39FF14] px-3.5 py-1 text-xs text-[#39FF14] font-bold lowercase tracking-wider mb-2 shadow-[2px_2px_0px_0px_#39FF14] font-mono">
            iit jee aspirant 2028 @ allen patna
          </div>

          {/* Lowercase / Small Caps Title: aditya (white) and here. (green) */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight font-mono lowercase">
            aditya<span className="text-[#39FF14]">here.</span>
          </h1>

          <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed font-mono lowercase">
            15-year-old student, tech enthusiast & competitive aspirant
          </p>
        </div>

        {/* Smooth Hardware Progress Bar */}
        <div className="my-6 space-y-2">
          <div className="w-full bg-[#050505] border-2 border-white h-6 p-0.5 relative shadow-[3px_3px_0px_0px_#ffffff] overflow-hidden">
            <motion.div
              className="bg-[#39FF14] h-full shadow-[0px_0px_10px_#39FF14]"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Terminal Boot Log */}
          <div className="bg-[#050505] border border-neutral-800 p-2.5 text-xs text-[#39FF14] font-mono h-11 flex items-center justify-between overflow-hidden">
            <span className="flex items-center gap-2 truncate lowercase">
              <Terminal className="w-4 h-4 text-[#39FF14] shrink-0" />
              <TerminalTextEffect text={bootLogs[logIndex]} speed={15} />
            </span>
          </div>
        </div>

        {/* Enter System Button & Controls */}
        <div className="pt-4 border-t-2 border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
          <span className="text-[#39FF14] text-xs font-bold lowercase flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#39FF14]" />
            {isReady ? 'assets loaded 100% • system ready!' : 'preloading system assets...'}
          </span>

          <button
            type="button"
            disabled={!isReady}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (isReady) handleFinish();
            }}
            className={`border-2 px-5 py-2 text-xs flex items-center gap-2 font-black uppercase transition-all ${
              isReady
                ? 'bg-[#39FF14] text-black border-white cursor-pointer relative z-10 shadow-[4px_4px_0px_0px_#ffffff] hover:shadow-[6px_6px_0px_0px_#ffffff] hover:scale-105 active:scale-95 animate-pulse'
                : 'bg-neutral-800 text-neutral-500 border-neutral-600 cursor-not-allowed opacity-50 shadow-none'
            }`}
          >
            <span>{isReady ? 'enter system now' : 'loading (please wait...)'}</span>
            <Play className={`w-4 h-4 ${isReady ? 'fill-black' : 'fill-neutral-500'}`} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
