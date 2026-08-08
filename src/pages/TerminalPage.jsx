import React from 'react';
import { motion } from 'framer-motion';
import TerminalAgentCard from '../components/TerminalAgentCard';

export default function TerminalPage({ playClickSound }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="max-w-3xl mx-auto px-4 md:px-6 py-8 space-y-6 font-mono"
    >
      <div className="bg-[#000000] border-3 border-white p-4 text-xs text-[#39FF14] shadow-[4px_4px_0px_0px_#39FF14] flex items-center justify-between font-mono">
        <span>⚡ LOGICAL AI TERMINAL SHELL (SECURE ACCESS)</span>
        <span className="bg-[#39FF14] text-black font-bold px-2 py-0.5">GUEST ACCESS // SYSTEM SECURE</span>
      </div>

      <TerminalAgentCard playClickSound={playClickSound} />
    </motion.div>
  );
}
