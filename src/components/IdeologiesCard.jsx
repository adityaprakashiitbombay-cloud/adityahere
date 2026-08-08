import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, ShieldCheck, Compass, Info, Quote } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';
import TerminalTextEffect from './TerminalTextEffect';

export default function IdeologiesCard({ playClickSound }) {
  const [selectedTag, setSelectedTag] = useState(null);

  const handleTagClick = (tag) => {
    if (playClickSound) playClickSound();
    setSelectedTag(selectedTag === tag.label ? null : tag.label);
  };

  return (
    <motion.div
      whileHover={{ x: -4, y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="brutal-card p-6 flex flex-col justify-between relative overflow-hidden bg-[#000000] border-3 border-white shadow-[6px_6px_0px_0px_#39FF14]"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none font-mono text-8xl font-black text-[#00E5FF]">
        02
      </div>

      <div>
        {/* Module Header */}
        <div className="flex items-center justify-between mb-4">
          <span className="bg-[#00E5FF] text-black font-black px-2.5 py-1 text-xs border-2 border-white shadow-[2px_2px_0px_0px_#ffffff] font-mono">
            IDENTITY & IDEOLOGIES
          </span>
          <Compass className="w-5 h-5 text-[#00E5FF]" />
        </div>

        <h3 className="text-xl font-black text-white mb-2 tracking-tight font-mono">
          <TerminalTextEffect text="Core Worldview & Ideology" speed={30} />
        </h3>
        <p className="text-xs text-neutral-400 font-mono mb-4">
          Guided by reason, empirical inquiry, and fundamental equality.
        </p>

        {/* Ideology Tags */}
        <div className="flex flex-wrap gap-2.5 mb-6">
          {portfolioData.ideologies.tags.map((tag, idx) => (
            <button
              key={idx}
              onClick={() => handleTagClick(tag)}
              className={`px-3.5 py-1.5 text-xs font-bold border-2 border-white tracking-wider transition-all uppercase flex items-center gap-1.5 font-mono ${
                selectedTag === tag.label
                  ? 'bg-[#39FF14] text-black shadow-[3px_3px_0px_0px_#ffffff]'
                  : 'bg-[#000000] text-white hover:bg-neutral-800 shadow-[2px_2px_0px_0px_#39FF14]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#39FF14]" />
              {tag.label}
            </button>
          ))}
        </div>

        {/* Tag Explanation Expandable Box */}
        {selectedTag && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-4 bg-[#000000] border-2 border-[#00E5FF] p-3 text-xs shadow-[3px_3px_0px_0px_#00E5FF] font-mono"
          >
            <div className="flex items-center gap-2 text-[#00E5FF] font-bold mb-1">
              <Info className="w-4 h-4" /> rationale: {selectedTag}
            </div>
            <p className="text-neutral-300 font-mono">
              {portfolioData.ideologies.tags.find(t => t.label === selectedTag)?.description}
            </p>
          </motion.div>
        )}

        {/* Highlight Inspiration Quote */}
        <div className="bg-[#000000] border-3 border-[#FF007F] p-4 relative shadow-[4px_4px_0px_0px_#FF007F]">
          <Quote className="w-6 h-6 text-[#FF007F] opacity-30 absolute top-2 right-2" />
          <p className="text-xs text-neutral-400 font-mono uppercase tracking-widest mb-1">
            // INSPIRATION TAG
          </p>
          <h4 className="text-2xl font-black text-[#FF007F] tracking-tight font-mono">
            "{portfolioData.ideologies.quote}"
          </h4>
          <p className="text-[11px] text-neutral-300 font-mono mt-2 italic">
            {portfolioData.ideologies.quoteContext}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-neutral-800 text-[10px] text-neutral-500 font-mono flex items-center justify-between">
        <span>Click tags for rationale</span>
        <span className="text-[#39FF14]">SECULAR / REASON</span>
      </div>
    </motion.div>
  );
}
