import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Palette, Code, Sparkles, Quote, Terminal, Copy, Check } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';
import TerminalTextEffect from './TerminalTextEffect';

export default function ArtworkQuotesCard({ playClickSound }) {
  const [activeTab, setActiveTab] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);

  const currentItem = portfolioData.artworksAndQuotes[activeTab];

  const handleCopyCode = (code) => {
    if (playClickSound) playClickSound();
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <motion.div
      whileHover={{ x: -4, y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="brutal-card p-6 flex flex-col justify-between relative overflow-hidden bg-[#000000] border-3 border-white shadow-[6px_6px_0px_0px_#39FF14]"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none font-mono text-8xl font-black text-[#39FF14]">
        05
      </div>

      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <span className="bg-[#39FF14] text-black font-black px-2.5 py-1 text-xs border-2 border-white shadow-[2px_2px_0px_0px_#ffffff] font-mono">
            ARTWORK & WRITINGS
          </span>
          <Palette className="w-5 h-5 text-[#39FF14]" />
        </div>

        <h3 className="text-xl font-black text-white mb-2 tracking-tight font-mono">
          <TerminalTextEffect text="Personal Writings & Quotes" speed={30} />
        </h3>

        {/* Tab Selector */}
        <div className="flex border-2 border-white bg-[#000000] mb-4 overflow-x-auto">
          {portfolioData.artworksAndQuotes.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActiveTab(idx);
                if (playClickSound) playClickSound();
              }}
              className={`px-3 py-1.5 text-xs font-bold font-mono whitespace-nowrap transition-colors border-r border-neutral-700 ${
                activeTab === idx ? 'bg-[#39FF14] text-black' : 'text-neutral-300 hover:bg-neutral-800'
              }`}
            >
              {item.title}
            </button>
          ))}
        </div>

        {/* Dynamic Display Area */}
        <div className="bg-[#000000] border-3 border-white p-4 relative min-h-[160px] flex flex-col justify-between shadow-[4px_4px_0px_0px_#39FF14]">
          {currentItem.type === 'code' ? (
            <div>
              <div className="flex items-center justify-between text-xs text-neutral-400 font-mono mb-2">
                <span className="flex items-center gap-1 text-[#00E5FF] font-bold">
                  <Terminal className="w-3.5 h-3.5" /> {currentItem.category}
                </span>
                <button
                  onClick={() => handleCopyCode(currentItem.code)}
                  className="text-neutral-300 hover:text-[#39FF14] flex items-center gap-1 text-[11px] font-mono"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-[#39FF14]" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedCode ? 'COPIED' : 'COPY'}
                </button>
              </div>
              <pre className="bg-[#000000] p-3 text-xs text-[#39FF14] font-mono border border-neutral-700 overflow-x-auto">
                {currentItem.code}
              </pre>
            </div>
          ) : (
            <div>
              <span className="text-[10px] text-[#00E5FF] font-bold uppercase tracking-widest font-mono">
                // {currentItem.category}
              </span>
              <p className="text-sm font-mono text-neutral-200 mt-2 leading-relaxed italic">
                "{currentItem.content}"
              </p>
              <div className="text-right mt-3 text-xs text-[#39FF14] font-bold font-mono">
                — {currentItem.author}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-neutral-800 text-[10px] text-neutral-500 font-mono flex items-center justify-between">
        <span>Display item {activeTab + 1} of {portfolioData.artworksAndQuotes.length}</span>
        <span className="text-[#39FF14]">CREATIVE CANVAS</span>
      </div>
    </motion.div>
  );
}
