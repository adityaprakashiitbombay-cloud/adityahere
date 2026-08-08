import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Sparkles } from 'lucide-react';
import { fireMatrixConfetti } from '../utils/confettiEffects';
import Skeleton from './Skeleton';

export default function AnimatedProfileFrame({ playClickSound }) {
  const [filterMode, setFilterMode] = useState('mono'); // 'mono' | 'cyberpunk' | 'holo' | 'color'
  const [isLoaded, setIsLoaded] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const triggerConfetti = () => {
    if (playClickSound) playClickSound();
    fireMatrixConfetti();
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -12;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const getFilterStyle = () => {
    switch (filterMode) {
      case 'mono':
        return 'grayscale contrast-150';
      case 'cyberpunk':
        return 'contrast-125 saturate-150 hue-rotate-15';
      case 'holo':
        return 'contrast-150 brightness-110 sepia-[0.3] hue-rotate-180';
      case 'color':
        return 'contrast-105 saturate-110';
      default:
        return 'grayscale contrast-150';
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Outer Floating Parallax Container */}
      <motion.div
        animate={{
          y: [0, -6, 0],
          rotateX: tilt.y,
          rotateY: tilt.x
        }}
        transition={{
          y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          rotateX: { type: "spring", stiffness: 300, damping: 20 },
          rotateY: { type: "spring", stiffness: 300, damping: 20 }
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative group w-full max-w-[280px] sm:max-w-[300px] perspective-1000"
      >
        {/* Animated Photo Card with Neon Aura */}
        <div
          onClick={triggerConfetti}
          className="cursor-pointer relative bg-[#000000] border-3 border-white p-2.5 shadow-[6px_6px_0px_0px_#39FF14] hover:shadow-[10px_10px_0px_0px_#00E5FF] transition-all duration-300 neon-photo-aura"
        >
          {/* Top Live LED Indicators */}
          <div className="flex items-center justify-between px-1 mb-2 text-[10px] font-mono font-bold">
            <span className="flex items-center gap-1.5 text-[#39FF14]">
              <span className="w-2 h-2 rounded-full bg-[#39FF14] animate-ping" /> ONLINE
            </span>
            <span className="text-[#39FF14] uppercase font-mono">
              [ {filterMode.toUpperCase()} MODE ]
            </span>
          </div>

          {/* Photo Frame Viewport */}
          <div className="relative aspect-[3/4] overflow-hidden border-2 border-white bg-[#050505]">
            {!isLoaded && (
              <Skeleton className="absolute inset-0 w-full h-full" />
            )}

            {/* User Portrait Image */}
            <img
              src="/profile.jpg"
              alt="Aditya - Developer Portrait"
              onLoad={() => setIsLoaded(true)}
              onError={(e) => {
                setIsLoaded(true);
                e.target.onerror = null;
                e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80";
              }}
              className={`w-full h-full object-cover object-top transition-all duration-500 ${getFilterStyle()} ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            />

            {/* Laser Beam Scanline Sweep */}
            <div className="absolute inset-x-0 h-12 bg-gradient-to-b from-[#39FF14]/0 via-[#39FF14]/40 to-[#39FF14]/0 pointer-events-none animate-scanbeam" />

            {/* Subtle Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#39FF1410_1px,transparent_1px),linear-gradient(to_bottom,#39FF1410_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none opacity-40" />
          </div>

          {/* Status Badge Strip */}
          <div className="mt-2.5 bg-[#39FF14] text-black font-black text-[11px] font-mono px-2 py-1 text-center border border-white tracking-widest uppercase flex items-center justify-center gap-1">
            <Zap className="w-3.5 h-3.5 fill-black animate-bounce" /> JEE 2028 @ ALLEN PATNA
          </div>
        </div>

        {/* Pulsing Corner Brackets */}
        <div className="absolute -top-2.5 -left-2.5 w-4 h-4 bg-[#39FF14] border-2 border-black animate-pulse" />
        <div className="absolute -top-2.5 -right-2.5 w-4 h-4 bg-[#39FF14] border-2 border-black animate-pulse" />
        <div className="absolute -bottom-2.5 -left-2.5 w-4 h-4 bg-[#FF007F] border-2 border-black animate-pulse" />
        <div className="absolute -bottom-2.5 -right-2.5 w-4 h-4 bg-[#FFE600] border-2 border-black animate-pulse" />
      </motion.div>

      {/* Interactive FX Mode Switcher Buttons */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 font-mono text-[10px] w-full max-w-[300px]">
        <span className="text-neutral-400 font-bold mr-1 uppercase">FX MODE:</span>
        {[
          { id: 'mono', label: 'MONO (DEF)', color: '#FFFFFF' },
          { id: 'cyberpunk', label: 'CYBER', color: '#39FF14' },
          { id: 'holo', label: 'HOLO', color: '#00E5FF' },
          { id: 'color', label: 'HD', color: '#FFE600' }
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => {
              setFilterMode(f.id);
              if (playClickSound) playClickSound();
            }}
            className={`px-2 py-1 font-mono font-bold uppercase transition-all cursor-pointer ${
              filterMode === f.id
                ? 'bg-[#39FF14] text-black border-2 border-white shadow-[2px_2px_0px_0px_#ffffff]'
                : 'bg-black text-neutral-400 border border-neutral-700 hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}
