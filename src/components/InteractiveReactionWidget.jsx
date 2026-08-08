import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Brain, Trophy, Zap, Sparkles } from 'lucide-react';
import { fetchReactionCounts, incrementReactionCount, logVisitorActivity } from '../lib/supabaseClient';
import { fireAcademicVictoryConfetti } from '../utils/confettiEffects';

export default function InteractiveReactionWidget({ playClickSound }) {
  const [counts, setCounts] = useState({ rocket: 0, brain: 0, trophy: 0, fire: 0 });
  const [particles, setParticles] = useState([]);


  useEffect(() => {
    fetchReactionCounts().then(setCounts);

    const handleUpdate = (e) => {
      if (e.detail) setCounts(e.detail);
    };

    window.addEventListener('reactionCountsUpdated', handleUpdate);

    // Sync reaction counts over the cloud every 4 seconds
    const interval = setInterval(() => {
      fetchReactionCounts().then((c) => {
        if (c) setCounts(c);
      });
    }, 4000);

    return () => {
      window.removeEventListener('reactionCountsUpdated', handleUpdate);
      clearInterval(interval);
    };
  }, []);

  const handleReaction = (type, emoji, e) => {
    if (playClickSound) playClickSound();

    logVisitorActivity(`Reacted ${emoji} ${type.toUpperCase()}`);

    // Increment count
    incrementReactionCount(type).then(setCounts);

    // Create particle burst
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top;

    const newParticles = Array.from({ length: 4 }).map((_, i) => ({
      id: Date.now() + i + Math.random(),
      emoji,
      x: x + (Math.random() - 0.5) * 60,
      y,
      rotation: (Math.random() - 0.5) * 40
    }));

    setParticles((prev) => [...prev, ...newParticles]);

    // Clean up particles
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.find((np) => np.id === p.id)));
    }, 1200);
  };

  const reactions = [
    { type: 'fire', label: '100% IT', icon: <Zap className="w-3.5 h-3.5 text-[#39FF14]" />, emoji: '⚡', color: '#39FF14' },
    { type: 'rocket', label: 'JEE BOOST', icon: <Rocket className="w-3.5 h-3.5 text-[#00E5FF]" />, emoji: '🚀', color: '#00E5FF' },
    { type: 'brain', label: 'HIGH IQ', icon: <Brain className="w-3.5 h-3.5 text-[#FF007F]" />, emoji: '🧠', color: '#FF007F' },
    { type: 'trophy', label: 'OLYMPIAD', icon: <Trophy className="w-3.5 h-3.5 text-[#FFE600]" />, emoji: '🏆', color: '#FFE600' }
  ];

  return (
    <div className="bg-[#050505] border-2 border-white p-4 font-mono shadow-[4px_4px_0px_0px_var(--color-primary,#39FF14)] relative overflow-hidden">
      {/* Subtle Matrix Grid Texture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#39FF1408_1px,transparent_1px),linear-gradient(to_bottom,#39FF1408_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none opacity-30" />

      <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-3 relative z-10">
        <div className="flex items-center gap-1.5 text-xs font-black text-white uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-[var(--color-primary,#39FF14)] animate-pulse" />
          <span>INTERACTIVE PEER REACTION HUB</span>
        </div>
        <span className="text-[10px] text-[#39FF14] font-bold tracking-widest">// TAP TO BOOST</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 relative z-10">
        {reactions.map((r) => (
          <motion.button
            key={r.type}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.94 }}
            onClick={(e) => handleReaction(r.type, r.emoji, e)}
            className="bg-black border-2 border-white p-2 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all hover:shadow-[3px_3px_0px_0px_var(--color-primary,#39FF14)] group"
          >
            <div className="flex items-center gap-1 text-[11px] font-bold text-white group-hover:text-[var(--color-primary,#39FF14)] transition-colors">
              {r.icon}
              <span className="uppercase text-[10px]">{r.label}</span>
            </div>
            <span className="text-sm font-black text-white bg-[#111111] px-2 py-0.5 border border-neutral-800 w-full text-center">
              {counts[r.type] || 0}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Floating Particle Animations */}
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 1, y: 0, scale: 0.8, x: p.x }}
            animate={{ opacity: 0, y: -90, scale: 1.4, rotate: p.rotation }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: "easeOut" }}
            className="fixed z-50 pointer-events-none text-xl font-bold font-mono"
            style={{ left: 0, top: p.y }}
          >
            {p.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
