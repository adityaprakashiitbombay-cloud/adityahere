import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Zap, MapPin, Sparkles, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { portfolioData } from '../data/portfolioData';
import TerminalTextEffect from './TerminalTextEffect';
import AnimatedProfileFrame from './AnimatedProfileFrame';

export default function HeroTimelineCard({ playClickSound }) {
  const [activeTab, setActiveTab] = useState('bio');

  const triggerConfetti = () => {
    if (playClickSound) playClickSound();
    confetti({
      particleCount: 140,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#39FF14', '#00E5FF', '#FF007F', '#FFFFFF']
    });
  };

  return (
    <motion.div
      whileHover={{ x: -4, y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="brutal-card p-4 sm:p-6 md:p-8 relative overflow-hidden bg-[#000000] border-3 border-white shadow-[6px_6px_0px_0px_#39FF14]"
    >
      {/* Corner Technical Markers */}
      <span className="absolute top-2 left-2 text-[#39FF14] font-mono text-sm font-bold">┌</span>
      <span className="absolute top-2 right-2 text-[#39FF14] font-mono text-sm font-bold">┐</span>
      <span className="absolute bottom-2 left-2 text-[#39FF14] font-mono text-sm font-bold">└</span>
      <span className="absolute bottom-2 right-2 text-[#39FF14] font-mono text-sm font-bold">┘</span>

      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b-2 border-neutral-800">
        <div className="flex items-center gap-3">
          <span className="bg-[#39FF14] text-black font-black px-3 py-1 text-xs border-2 border-white shadow-[2px_2px_0px_0px_#ffffff] tracking-wider uppercase font-mono">
            CORE PROFILE & BIO
          </span>
          <span className="text-xs text-neutral-400 font-mono flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#39FF14]" /> Patna / Hajipur / Lalganj
          </span>
        </div>

        {/* Tab Switchers */}
        <div className="flex border-2 border-white bg-[#000000] w-full sm:w-auto">
          <button
            onClick={() => { setActiveTab('bio'); if (playClickSound) playClickSound(); }}
            className={`flex-1 sm:flex-initial px-4 py-1.5 text-xs font-bold font-mono transition-all ${
              activeTab === 'bio' ? 'bg-[#39FF14] text-black' : 'text-white hover:bg-neutral-800'
            }`}
          >
            OVERVIEW
          </button>
          <button
            onClick={() => { setActiveTab('timeline'); if (playClickSound) playClickSound(); }}
            className={`flex-1 sm:flex-initial px-4 py-1.5 text-xs font-bold font-mono transition-all border-l-2 border-white ${
              activeTab === 'timeline' ? 'bg-[#39FF14] text-black' : 'text-white hover:bg-neutral-800'
            }`}
          >
            TIMELINE (2011–2028)
          </button>
        </div>
      </div>

      {activeTab === 'bio' ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center">
          {/* Animated User Portrait Frame (Spans 5 columns on md/laptop) */}
          <div className="md:col-span-5 flex flex-col items-center">
            <AnimatedProfileFrame playClickSound={playClickSound} />
          </div>

          {/* Bio Info (Spans 7 columns on md/laptop) */}
          <div className="md:col-span-7 space-y-5">
            <div>
              <div className="text-xs font-mono text-[#39FF14] tracking-widest uppercase font-bold mb-1">
                // STUDENT & DEVELOPER PORTFOLIO
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight font-mono">
                <TerminalTextEffect text="adityahere." speed={40} />
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300 font-mono leading-relaxed mt-4 border-l-4 border-[#39FF14] pl-4 py-2 bg-[#000000]">
                "{portfolioData.hero.bio}"
              </p>
            </div>

            {/* Achievement Badge */}
            <div
              onClick={triggerConfetti}
              className="cursor-pointer bg-[#000000] border-2 border-[#39FF14] p-4 relative group shadow-[4px_4px_0px_0px_#39FF14] hover:shadow-[6px_6px_0px_0px_#00E5FF] transition-all"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-[#39FF14] flex items-center gap-1.5 font-mono">
                  <Award className="w-4 h-4" /> CLASS 10TH SCORE
                </span>
                <span className="text-[10px] bg-[#39FF14] text-black px-2 py-0.5 font-black uppercase font-mono">
                  TAP FOR CONFETTI 🎉
                </span>
              </div>
              <div className="flex items-baseline gap-3 font-mono">
                <span className="text-2xl sm:text-3xl font-black text-[#39FF14]">95.4%</span>
                <span className="text-xs text-white leading-snug">
                  Overall with <strong className="text-[#00E5FF] underline">100% PERFECT SCORE IN IT</strong>!
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Timeline View */
        <div className="space-y-6 my-4">
          <div className="text-xs text-neutral-400 font-mono uppercase tracking-widest border-b border-neutral-800 pb-2">
            // EDUCATIONAL TRAJECTORY & CHRONOLOGY (2011 – 2028)
          </div>

          <div className="relative border-l-2 border-[#39FF14] pl-4 sm:pl-6 space-y-6 ml-2 sm:ml-3">
            {portfolioData.milestones.map((m, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="relative p-4 sm:p-5 border-2 border-white bg-[#000000] shadow-[4px_4px_0px_0px_#39FF14]"
              >
                <div className="absolute -left-[23px] sm:-left-[31px] top-5 w-4 h-4 bg-[#39FF14] border-2 border-black" />

                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-black bg-[#39FF14] text-black px-2 py-0.5 font-mono">
                    {m.year}
                  </span>
                  <span className="text-xs text-neutral-400 font-mono flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#00E5FF]" /> {m.location}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white mt-1 font-mono">
                  {m.title}
                </h3>

                <p className="text-xs text-neutral-300 font-mono mt-2 leading-relaxed">
                  {m.description}
                </p>

                {m.achievement && (
                  <div className="mt-3 bg-[#000000] border border-[#39FF14] p-2.5 text-xs text-[#39FF14] font-bold font-mono">
                    🏆 {m.achievement}
                  </div>
                )}

                {m.mentors && (
                  <div className="mt-3 pt-3 border-t border-neutral-800">
                    <p className="text-[11px] text-[#00E5FF] font-bold uppercase tracking-wider mb-2 font-mono">
                      Mentors at Pioneer Academy Lalganj:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {m.mentors.map((mentor, midx) => (
                        <div key={midx} className="bg-[#000000] p-2 border border-neutral-700 font-mono">
                          <span className="text-[#39FF14] font-bold">{mentor.name}</span> ({mentor.subject})
                          <p className="text-[10px] text-neutral-400 mt-0.5">{mentor.note}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {m.friends && (
                  <div className="mt-2 text-xs text-neutral-400 font-mono">
                    <strong className="text-white">Friends/Colleagues:</strong> {m.friends.join(', ')}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Info Bar */}
      <div className="mt-6 pt-4 border-t-2 border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-neutral-400 font-mono">
        <span className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#39FF14]" /> Allen Patna (Ashiyana Digha Branch)
        </span>
        <button
          onClick={() => setActiveTab(activeTab === 'bio' ? 'timeline' : 'bio')}
          className="text-[#39FF14] hover:underline font-bold flex items-center gap-1 font-mono"
        >
          {activeTab === 'bio' ? 'VIEW FULL TIMELINE →' : '← BACK TO OVERVIEW'}
        </button>
      </div>
    </motion.div>
  );
}
