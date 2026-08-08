import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { Award, Zap, Calendar, Terminal, MessageSquare, Sparkles, Sigma, Trophy, Atom, ArrowRight, Edit3 } from 'lucide-react';
import { fireAcademicVictoryConfetti } from '../utils/confettiEffects';
import { usePortfolio } from '../hooks/usePortfolio';
import AnimatedProfileFrame from '../components/AnimatedProfileFrame';
import LiveAge from '../components/LiveAge';
import FloatingAiBotModal from '../components/FloatingAiBotModal';
import TerminalTextEffect from '../components/TerminalTextEffect';
import AdminEditModal from '../components/admin/AdminEditModal';
import LiveVisitorPulse from '../components/LiveVisitorPulse';
import InteractiveReactionWidget from '../components/InteractiveReactionWidget';

export default function HomePage({ playUiClick, playConfettiSound }) {
  const { data, isAdmin } = usePortfolio();
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [adminTab, setAdminTab] = useState('hero');

  const triggerAcademicCelebration = () => {
    if (playConfettiSound) playConfettiSound();
    fireAcademicVictoryConfetti();
  };

  const openAdminTab = (tab) => {
    setAdminTab(tab);
    setAdminModalOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-8 space-y-6 font-mono"
    >
      {/* Real-Time Live Online Peer & Impression Telemetry Bar */}
      <LiveVisitorPulse />

      {/* 1. Main Hero Bento Card (Clean, High-Fashion Cyber Neo-Brutalist Layout) */}
      <div className="bg-[#050505] border-3 border-white p-5 sm:p-7 md:p-8 relative shadow-[8px_8px_0px_0px_#39FF14]">


        {/* Subtle Matrix Tech Grid in Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#39FF1408_1px,transparent_1px),linear-gradient(to_bottom,#39FF1408_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-30" />

        {/* Quick Admin Edit Trigger */}
        {isAdmin && (
          <button
            onClick={() => openAdminTab('hero')}
            className="absolute top-3 right-3 z-20 bg-[#39FF14] text-black font-black px-2.5 py-1 text-[10px] flex items-center gap-1 border border-white shadow-[2px_2px_0px_0px_#ffffff] cursor-pointer hover:bg-white transition-colors"
            title="Edit Hero Details"
          >
            <Edit3 className="w-3 h-3" /> EDIT HERO
          </button>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-7 md:gap-8 items-center relative z-10">
          {/* Left Column: Animated Profile Portrait Frame */}
          <div className="md:col-span-5 flex flex-col items-center justify-center">
            <AnimatedProfileFrame playClickSound={playUiClick} />
          </div>

          {/* Right Column: Identity, Bio & High-Impact Credentials */}
          <div className="md:col-span-7 space-y-4">
            <div>
              <div className="text-[11px] font-mono text-[#39FF14] tracking-widest uppercase font-bold mb-1.5 flex items-center gap-2">
                <span>// {data?.hero?.subtitle || 'JEE ASPIRANT 2028 • TECH BUILDER'}</span>
                <span className="w-2 h-2 rounded-full bg-[#39FF14] animate-ping" />
              </div>

              {/* Lowercase Title: aditya (white) + here. (neon green) */}
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white font-mono lowercase">
                aditya<span className="text-[#39FF14]">here.</span>
              </h1>

              {/* Animated Monospace Bio Description */}
              <div className="text-xs sm:text-sm text-neutral-200 font-mono leading-relaxed mt-2.5 border-l-3 border-[#39FF14] pl-3 py-1.5 bg-black/60 shadow-[inset_0px_0px_10px_rgba(0,0,0,0.5)] flex items-start gap-1">
                <span>"</span>
                <TerminalTextEffect text={data?.hero?.bio || '15-year-old student, tech enthusiast, and competitive programmer aspiring to crack IIT JEE.'} speed={18} />
                <span>"</span>
              </div>
            </div>

            {/* Academic & Olympiads Credentials Section (Refined font sizes & compact ratio) */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[#FFE600] font-mono text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider">
                  <Award className="w-3.5 h-3.5 text-[#FFE600]" />
                  <span>COMPETITIVE ACADEMIC CREDENTIALS</span>
                </div>
                <button
                  type="button"
                  onClick={triggerAcademicCelebration}
                  className="text-[10px] sm:text-[11px] font-mono text-[#39FF14] font-semibold hover:underline cursor-pointer tracking-wider"
                >
                  [ TAP FOR FIREWORKS ]
                </button>
              </div>

              {/* 4 Bento Cards Grid with Sleek Compact Aspect Ratio */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                {/* Card 1: CLASS 10TH */}
                <motion.div
                  whileHover={{ scale: 1.015, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={triggerAcademicCelebration}
                  className="bg-black border-2 border-white px-3 py-2 sm:py-2.5 shadow-[3px_3px_0px_0px_#39FF14] hover:shadow-[4px_4px_0px_0px_#39FF14] transition-all cursor-pointer group relative overflow-hidden flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono mb-1">
                    <span className="text-neutral-400 font-semibold uppercase">CLASS 10TH</span>
                    <span className="text-[#39FF14] font-mono font-bold text-[10px] sm:text-[11px]">100% IN IT</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <div className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
                      95.4%
                    </div>
                    <span className="text-[#39FF14] font-mono font-bold text-[10px] sm:text-[11px] uppercase tracking-wider">
                      SCORE
                    </span>
                  </div>
                </motion.div>

                {/* Card 2: MATHS OLYMPIAD (IOQM) */}
                <motion.div
                  whileHover={{ scale: 1.015, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={triggerAcademicCelebration}
                  className="bg-black border-2 border-white px-3 py-2 sm:py-2.5 shadow-[3px_3px_0px_0px_#00E5FF] hover:shadow-[4px_4px_0px_0px_#00E5FF] transition-all cursor-pointer group relative overflow-hidden flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono mb-1">
                    <span className="text-neutral-400 font-semibold uppercase flex items-center gap-1">
                      <Sigma className="w-3 h-3 text-[#00E5FF]" /> MATHS OLYMPIAD
                    </span>
                    <span className="text-[#00E5FF] font-mono font-bold text-[10px] sm:text-[11px] uppercase">STAGE 1</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xl sm:text-2xl font-black text-[#00E5FF] font-mono tracking-tight">
                      IOQM
                    </div>
                    <span className="bg-[#00E5FF] text-black font-black text-[10px] px-1.5 py-0.2 border border-white shadow-[1px_1px_0px_0px_#ffffff]">
                      2X
                    </span>
                  </div>
                </motion.div>

                {/* Card 3: REGIONAL MATHS (RMO) */}
                <motion.div
                  whileHover={{ scale: 1.015, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={triggerAcademicCelebration}
                  className="bg-black border-2 border-white px-3 py-2 sm:py-2.5 shadow-[3px_3px_0px_0px_#FFE600] hover:shadow-[4px_4px_0px_0px_#FFE600] transition-all cursor-pointer group relative overflow-hidden flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono mb-1">
                    <span className="text-neutral-400 font-semibold uppercase flex items-center gap-1">
                      <Trophy className="w-3 h-3 text-[#FFE600]" /> REGIONAL MATHS
                    </span>
                    <span className="text-[#FFE600] font-mono font-bold text-[10px] sm:text-[11px] uppercase">STAGE 2</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xl sm:text-2xl font-black text-[#FFE600] font-mono tracking-tight">
                      RMO
                    </div>
                    <span className="bg-[#FFE600] text-black font-black text-[10px] px-1.5 py-0.2 border border-white shadow-[1px_1px_0px_0px_#ffffff]">
                      1X
                    </span>
                  </div>
                </motion.div>

                {/* Card 4: PHYSICS OLYMPIAD (NSEP) */}
                <motion.div
                  whileHover={{ scale: 1.015, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={triggerAcademicCelebration}
                  className="bg-black border-2 border-white px-3 py-2 sm:py-2.5 shadow-[3px_3px_0px_0px_#FF007F] hover:shadow-[4px_4px_0px_0px_#FF007F] transition-all cursor-pointer group relative overflow-hidden flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono mb-1">
                    <span className="text-neutral-400 font-semibold uppercase flex items-center gap-1">
                      <Atom className="w-3 h-3 text-[#FF007F]" /> PHYSICS OLYMPIAD
                    </span>
                    <span className="text-[#FF007F] font-mono font-bold text-[10px] sm:text-[11px] uppercase">NAT'L</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xl sm:text-2xl font-black text-[#FF007F] font-mono tracking-tight">
                      NSEP
                    </div>
                    <span className="bg-[#FF007F] text-black font-black text-[10px] px-1.5 py-0.2 border border-white shadow-[1px_1px_0px_0px_#ffffff]">
                      1X
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* Institutions / Coaching Badges Row */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1.5 text-[10px] sm:text-[11px] font-mono">
                <div className="bg-black border-2 border-[#39FF14] px-2.5 py-1 text-white font-bold flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#39FF14]">
                  <Sparkles className="w-3 h-3 text-[#39FF14]" />
                  <span>Allen Patna (Ashiyana Digha)</span>
                </div>

                <div className="bg-black border border-neutral-700 px-2.5 py-1 text-neutral-300 font-semibold">
                  Samarthya Classes
                </div>

                <div className="bg-black border border-neutral-700 px-2.5 py-1 text-neutral-300 font-semibold">
                  Pioneer Academy Lalganj
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Exploration Hubs Navigation Matrix (Matching attached image) */}
      <div className="space-y-4 pt-2 font-mono">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
          <div className="flex items-center gap-2 text-white text-xs font-bold uppercase tracking-wider">
            <Zap className="w-4 h-4 text-[#39FF14]" />
            <span>EXPLORATION HUBS</span>
          </div>
          <span className="text-neutral-500 text-xs font-bold tracking-widest">// SELECT ROUTE</span>
        </div>

        {/* 4 Cards Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Card 1: Interactive Timeline */}
          <NavLink to="/timeline" onClick={playUiClick} className="block group">
            <motion.div
              whileHover={{ y: -4, transition: { type: "spring", stiffness: 400, damping: 15 } }}
              whileTap={{ scale: 0.98 }}
              className="bg-[#000000] border-2 border-white p-5 shadow-[4px_4px_0px_0px_#00E5FF] group-hover:shadow-[6px_6px_0px_0px_#00E5FF] transition-all h-full flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="p-1.5 bg-black border border-[#00E5FF] text-[#00E5FF] flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </span>
                  <span className="bg-[#00E5FF] text-black font-black text-[10px] sm:text-xs px-2 py-0.5 border border-white">
                    2011-2028+
                  </span>
                </div>

                <h3 className="font-bold text-base sm:text-lg text-[#39FF14] group-hover:text-white transition-colors tracking-tight">
                  Interactive Timeline
                </h3>
                <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                  Academic milestones, early school years & future JEE goals
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400 font-bold group-hover:text-white transition-colors">
                <span>LAUNCH MODULE</span>
                <ArrowRight className="w-4 h-4 text-[#00E5FF] group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          </NavLink>

          {/* Card 2: Expertise & Passions */}
          <NavLink to="/expertise" onClick={playUiClick} className="block group">
            <motion.div
              whileHover={{ y: -4, transition: { type: "spring", stiffness: 400, damping: 15 } }}
              whileTap={{ scale: 0.98 }}
              className="bg-[#000000] border-2 border-white p-5 shadow-[4px_4px_0px_0px_#FF007F] group-hover:shadow-[6px_6px_0px_0px_#FF007F] transition-all h-full flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="p-1.5 bg-black border border-[#FF007F] text-[#FF007F] flex items-center justify-center">
                    <Zap className="w-4 h-4" />
                  </span>
                  <span className="bg-[#FF007F] text-white font-black text-[10px] sm:text-xs px-2 py-0.5 border border-white">
                    PHYSICS & AI
                  </span>
                </div>

                <h3 className="font-bold text-base sm:text-lg text-white group-hover:text-[#FF007F] transition-colors tracking-tight">
                  Expertise & Passions
                </h3>
                <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                  Cricket strategy, classical mechanics & modern web systems
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400 font-bold group-hover:text-white transition-colors">
                <span>LAUNCH MODULE</span>
                <ArrowRight className="w-4 h-4 text-[#FF007F] group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          </NavLink>

          {/* Card 3: Logical AI Terminal */}
          <NavLink to="/terminal" onClick={playUiClick} className="block group">
            <motion.div
              whileHover={{ y: -4, transition: { type: "spring", stiffness: 400, damping: 15 } }}
              whileTap={{ scale: 0.98 }}
              className="bg-[#000000] border-2 border-white p-5 shadow-[4px_4px_0px_0px_#39FF14] group-hover:shadow-[6px_6px_0px_0px_#39FF14] transition-all h-full flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="p-1.5 bg-black border border-[#39FF14] text-[#39FF14] flex items-center justify-center">
                    <Terminal className="w-4 h-4" />
                  </span>
                  <span className="bg-[#39FF14] text-black font-black text-[10px] sm:text-xs px-2 py-0.5 border border-white">
                    NEMOTRON CLI
                  </span>
                </div>

                <h3 className="font-bold text-base sm:text-lg text-white group-hover:text-[#39FF14] transition-colors tracking-tight">
                  Logical AI Terminal
                </h3>
                <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                  Interactive agent command shell & portfolio query engine
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400 font-bold group-hover:text-white transition-colors">
                <span>LAUNCH MODULE</span>
                <ArrowRight className="w-4 h-4 text-[#39FF14] group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          </NavLink>

          {/* Card 4: Visitor Board & Vault */}
          <NavLink to="/feedback" onClick={playUiClick} className="block group">
            <motion.div
              whileHover={{ y: -4, transition: { type: "spring", stiffness: 400, damping: 15 } }}
              whileTap={{ scale: 0.98 }}
              className="bg-[#000000] border-2 border-white p-5 shadow-[4px_4px_0px_0px_#FFE600] group-hover:shadow-[6px_6px_0px_0px_#FFE600] transition-all h-full flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="p-1.5 bg-black border border-[#FFE600] text-[#FFE600] flex items-center justify-center">
                    <MessageSquare className="w-4 h-4" />
                  </span>
                  <span className="bg-[#FFE600] text-black font-black text-[10px] sm:text-xs px-2 py-0.5 border border-white">
                    LIVE SUPABASE
                  </span>
                </div>

                <h3 className="font-bold text-base sm:text-lg text-white group-hover:text-[#FFE600] transition-colors tracking-tight">
                  Visitor Board & Vault
                </h3>
                <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                  Direct private notes to Aditya & public guestbook board
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400 font-bold group-hover:text-white transition-colors">
                <span>LAUNCH MODULE</span>
                <ArrowRight className="w-4 h-4 text-[#FFE600] group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          </NavLink>
        </div>
      </div>

      {/* Interactive Peer Reaction Hub (Boost, High IQ, Olympiads, 100% IT) */}
      <InteractiveReactionWidget playClickSound={playUiClick} />

      {/* Floating AI Bot Quick Ask Modal */}
      <FloatingAiBotModal playClickSound={playUiClick} />


      {/* Admin Edit Modal */}
      <AnimatePresence>
        {adminModalOpen && (
          <AdminEditModal
            isOpen={adminModalOpen}
            onClose={() => setAdminModalOpen(false)}
            initialTab={adminTab}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
