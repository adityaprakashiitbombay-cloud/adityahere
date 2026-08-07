import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Quote, Activity, Sparkles } from 'lucide-react';
import { fireMatrixConfetti } from '../utils/confettiEffects';
import { portfolioData } from '../data/portfolioData';
import MatrixDecodeText from '../components/MatrixDecodeText';

export default function ExpertisePage({ playClickSound }) {
  const [activeTab, setActiveTab] = useState('expertise'); // 'expertise' | 'ideology' | 'quotes'

  const triggerConfetti = () => {
    if (playClickSound) playClickSound();
    fireMatrixConfetti();
  };

  const expertiseList = portfolioData.expertise || [];
  const ideologyTags = portfolioData.ideologies?.tags || [
    { label: "Atheist", description: "Rationalist mindset driven by empirical evidence." },
    { label: "Feminist", description: "Advocate for gender equality and equal rights." },
    { label: "Leftist", description: "Believer in progressive welfare and secular values." }
  ];
  const heroQuote = portfolioData.ideologies?.quote || portfolioData.hero?.quote || "Inspired by no one.";

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 350, damping: 20 } }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="max-w-3xl mx-auto px-4 md:px-6 py-8 space-y-8 font-mono"
    >
      {/* Header Banner */}
      <div className="brutal-card p-6 bg-[#050505] border-3 border-white shadow-[6px_6px_0px_0px_#00E5FF]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <span className="bg-[#00E5FF] text-black font-black px-3 py-1 text-xs border-2 border-white shadow-[2px_2px_0px_0px_#ffffff]">
              DOMAINS & VALUES
            </span>
            <h1 className="text-3xl font-black text-white mt-2 tracking-tight">
              <MatrixDecodeText text="Expertise & Worldview" className="text-white" />
            </h1>
          </div>

          <div className="flex border-2 border-white bg-[#000000] w-full sm:w-auto p-0.5">
            {['expertise', 'ideology', 'quotes'].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  if (playClickSound) playClickSound();
                }}
                className={`px-3.5 py-1.5 text-xs font-bold uppercase transition-all cursor-pointer ${
                  activeTab === tab
                    ? 'bg-[#39FF14] text-black font-black shadow-[2px_2px_0px_0px_#ffffff]'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content Container */}
        <AnimatePresence mode="wait">
          {activeTab === 'expertise' && (
            <motion.div
              key="tab-expertise"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6"
            >
              {expertiseList.map((item, idx) => {
                const colors = ['#00E5FF', '#39FF14', '#FFE600', '#FF007F'];
                const accentColor = colors[idx % colors.length];
                return (
                  <motion.div
                    key={idx}
                    variants={cardVariants}
                    whileHover={{ scale: 1.03, x: -3, y: -3 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    style={{ borderColor: accentColor }}
                    className="bg-[#000000] border-2 p-5 shadow-[4px_4px_0px_0px_#ffffff] hover:shadow-[6px_6px_0px_0px_#39FF14] transition-all relative overflow-hidden group cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-3xl transform group-hover:scale-110 transition-transform">
                        {item.emoji || '⚡'}
                      </div>
                      <span
                        style={{ backgroundColor: accentColor }}
                        className="text-black text-[10px] font-black px-2 py-0.5 border border-black uppercase"
                      >
                        {item.category || item.stats}
                      </span>
                    </div>

                    <h3 className="text-base font-black text-white uppercase font-mono group-hover:text-[#39FF14] transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-xs text-neutral-300 mt-2 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="mt-3 pt-2 border-t border-neutral-800 flex items-center justify-between text-[10px] text-neutral-500 font-mono">
                      <span>STATUS: ONLINE</span>
                      <span className="text-[#39FF14] flex items-center gap-1">
                        <Activity className="w-3 h-3 animate-pulse" /> ACTIVE
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {activeTab === 'ideology' && (
            <motion.div
              key="tab-ideology"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-4 mt-6"
            >
              <div className="bg-[#000000] border-2 border-[#39FF14] p-5 shadow-[4px_4px_0px_0px_#39FF14]">
                <h3 className="text-sm font-bold text-[#39FF14] uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4" /> CORE VALUES & WORLDVIEW
                </h3>
                <p className="text-xs text-neutral-300 leading-relaxed mb-4">
                  Empirical scientific reasoning, social equality, and secular ethics form the foundation of my perspective on technology, society, and human development.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {ideologyTags.map((tag, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.04, y: -2 }}
                      className="bg-[#000000] border-2 border-white p-3 shadow-[3px_3px_0px_0px_#ffffff] transition-all"
                    >
                      <span className="bg-[#39FF14] text-black font-black text-xs px-2 py-0.5 border border-white uppercase inline-block mb-1">
                        {tag.label}
                      </span>
                      <p className="text-[11px] text-neutral-300 leading-normal">{tag.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'quotes' && (
            <motion.div
              key="tab-quotes"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-4 mt-6"
            >
              <motion.div
                whileHover={{ scale: 1.02, x: -3, y: -3 }}
                onClick={triggerConfetti}
                className="cursor-pointer bg-[#000000] border-2 border-white p-6 shadow-[5px_5px_0px_0px_#39FF14] hover:shadow-[7px_7px_0px_0px_#00E5FF] transition-all"
              >
                <Quote className="w-8 h-8 text-[#39FF14] mb-3 animate-pulse" />
                <blockquote className="text-lg font-black text-white italic tracking-wide">
                  "{heroQuote}"
                </blockquote>
                <p className="text-xs text-[#00E5FF] mt-3 font-bold uppercase tracking-wider">
                  — ADITYA'S PERSONAL MOTTO (INSPIRED BY FIRST PRINCIPLES)
                </p>
                <span className="inline-block mt-3 text-[10px] bg-[#39FF14] text-black font-black px-2 py-0.5">
                  CLICK CARD FOR MATRIX FIREWORKS 🎉
                </span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
