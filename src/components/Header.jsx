import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Volume2, VolumeX, Flame, Cpu, ShieldCheck } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

export default function Header({ soundEnabled, setSoundEnabled }) {
  const [time, setTime] = useState('');
  const [liveAge, setLiveAge] = useState('');

  useEffect(() => {
    const updateTimeAndAge = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false }));

      const birth = new Date(portfolioData.hero.birthDate);
      const diffTime = Math.abs(now - birth);
      const diffYears = (diffTime / (1000 * 60 * 60 * 24 * 365.25)).toFixed(7);
      setLiveAge(diffYears);
    };

    updateTimeAndAge();
    const interval = setInterval(updateTimeAndAge, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="w-full border-b-3 border-white bg-[#000000] sticky top-0 z-40 px-4 md:px-8 py-3.5 shadow-[0px_4px_0px_0px_#39FF14] relative overflow-hidden"
    >
      {/* Animated Bottom Border Glow Line */}
      <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-[#39FF14] via-[#00E5FF] to-[#FF007F] animate-pulse" />

      <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Animated Logo & Brand Header */}
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.08, rotate: [0, -3, 3, 0] }}
            transition={{ duration: 0.3 }}
            className="bg-[#39FF14] text-black font-black px-3.5 py-1.5 text-xl tracking-tighter border-2 border-white shadow-[3px_3px_0px_0px_#ffffff] cursor-pointer"
          >
            AH.
          </motion.div>

          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-2 font-mono">
              aditya<span className="text-[#39FF14] animate-pulse">here.</span>
              <motion.span
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-[10px] bg-[#000000] text-[#39FF14] border border-[#39FF14] px-2 py-0.5 uppercase tracking-widest font-mono font-bold shadow-[2px_2px_0px_0px_#39FF14]"
              >
                v5.0 MATRIX
              </motion.span>
            </h1>
            <p className="text-xs text-neutral-400 font-mono flex items-center gap-2 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-[#39FF14] animate-ping" />
              <span>LIVE SYSTEM // PATNA & HAJIPUR</span>
            </p>
          </div>
        </div>

        {/* Animated Navigation Badges & Live Status */}
        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2.5 text-xs font-mono">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-[#000000] border-2 border-white px-3 py-1.5 flex items-center gap-2 shadow-[2px_2px_0px_0px_#39FF14]"
          >
            <Flame className="w-4 h-4 text-[#FF007F] animate-bounce" />
            <span>TARGET: <strong className="text-[#39FF14]">JEE 2028 @ ALLEN PATNA</strong></span>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-[#000000] border-2 border-white px-3 py-1.5 hidden sm:flex items-center gap-2 shadow-[2px_2px_0px_0px_#00E5FF]"
          >
            <Sparkles className="w-4 h-4 text-[#00E5FF] animate-spin" />
            <span>AGE: <strong className="text-[#39FF14] font-mono">{liveAge}</strong> YRS</span>
          </motion.div>

          <div className="bg-[#000000] border-2 border-white px-3 py-1.5 text-neutral-300 shadow-[2px_2px_0px_0px_#ffffff]">
            {time || '00:00:00'} IST
          </div>

          {/* Animated Sound Toggle Button */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`px-3 py-1.5 border-2 border-white font-bold flex items-center gap-1.5 transition-all ${
              soundEnabled
                ? 'bg-[#39FF14] text-black shadow-[2px_2px_0px_0px_#ffffff]'
                : 'bg-[#181818] text-neutral-400 shadow-[2px_2px_0px_0px_#444]'
            }`}
            title="Toggle Sound Effects"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="uppercase text-[10px]">{soundEnabled ? 'FX ON' : 'FX OFF'}</span>
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}
