import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Lightbulb, Atom, Trophy, ChevronRight, Zap } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';
import TerminalTextEffect from './TerminalTextEffect';

export default function ExpertiseCard({ playClickSound }) {
  const [activeExpertise, setActiveExpertise] = useState('physics');

  const getIconComponent = (iconName) => {
    switch (iconName) {
      case 'Trophy': return <Trophy className="w-5 h-5 text-[#FFE600]" />;
      case 'Bot': return <Bot className="w-5 h-5 text-[#39FF14]" />;
      case 'Lightbulb': return <Lightbulb className="w-5 h-5 text-[#00E5FF]" />;
      case 'Atom': return <Atom className="w-5 h-5 text-[#FF007F]" />;
      default: return <Zap className="w-5 h-5 text-[#39FF14]" />;
    }
  };

  return (
    <motion.div
      whileHover={{ x: -4, y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="brutal-card p-6 flex flex-col justify-between relative overflow-hidden bg-[#000000] border-3 border-white shadow-[6px_6px_0px_0px_#39FF14]"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none font-mono text-8xl font-black text-[#FFE600]">
        03
      </div>

      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <span className="bg-[#FFE600] text-black font-black px-2.5 py-1 text-xs border-2 border-white shadow-[2px_2px_0px_0px_#ffffff] font-mono">
            EXPERTISE & PASSIONS
          </span>
          <Zap className="w-5 h-5 text-[#FFE600]" />
        </div>

        <h3 className="text-xl font-black text-white mb-2 tracking-tight font-mono">
          <TerminalTextEffect text="Core Domains & Interests" speed={30} />
        </h3>
        <p className="text-xs text-neutral-400 font-mono mb-4">
          Select a card to view detailed focus area:
        </p>

        {/* 4 Interactive Cards Grid */}
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          {portfolioData.expertise.map((item) => {
            const isSelected = activeExpertise === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveExpertise(item.id);
                  if (playClickSound) playClickSound();
                }}
                className={`p-3 border-2 border-white text-left transition-all relative font-mono ${
                  isSelected
                    ? 'bg-[#39FF14] text-black shadow-[4px_4px_0px_0px_#ffffff]'
                    : 'bg-[#000000] text-white hover:bg-[#181818] shadow-[2px_2px_0px_0px_#ffffff]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xl">{item.emoji}</span>
                  {getIconComponent(item.icon)}
                </div>
                <div className="font-bold text-xs">{item.title}</div>
                <div className={`text-[10px] font-mono mt-0.5 ${isSelected ? 'text-black font-semibold' : 'text-neutral-400'}`}>
                  {item.category}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Domain Detail Card */}
        {activeExpertise && (
          <motion.div
            key={activeExpertise}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#000000] border-2 border-white p-3.5 shadow-[3px_3px_0px_0px_#FFE600]"
          >
            {(() => {
              const current = portfolioData.expertise.find(e => e.id === activeExpertise);
              return (
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-[#FFE600] mb-1 font-mono">
                    <span className="flex items-center gap-1.5">
                      <span className="text-base">{current.emoji}</span> {current.title}
                    </span>
                    <span className="text-[10px] bg-[#000000] px-2 py-0.5 text-white border border-neutral-700 font-mono">
                      FOCUS
                    </span>
                  </div>
                  <p className="text-xs text-neutral-300 font-mono leading-relaxed mt-1">
                    {current.description}
                  </p>
                  <div className="mt-2 pt-2 border-t border-neutral-800 text-[10px] text-[#39FF14] font-bold font-mono">
                    ⚡ {current.stats}
                  </div>
                </div>
              );
            })()}
          </motion.div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-neutral-800 text-[10px] text-neutral-500 font-mono flex items-center justify-between">
        <span>4 Active Domains</span>
        <span className="text-[#FFE600]">IIT JEE / TECH</span>
      </div>
    </motion.div>
  );
}
