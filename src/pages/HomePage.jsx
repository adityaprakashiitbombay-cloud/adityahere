import React from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { Award, Zap, Calendar, Terminal, MessageSquare, Sparkles, Sigma, Trophy, Atom, ArrowRight } from 'lucide-react';
import { fireAcademicVictoryConfetti } from '../utils/confettiEffects';
import { portfolioData } from '../data/portfolioData';
import AnimatedProfileFrame from '../components/AnimatedProfileFrame';
import LiveAge from '../components/LiveAge';
import FloatingAiBotModal from '../components/FloatingAiBotModal';
import TerminalTextEffect from '../components/TerminalTextEffect';

export default function HomePage({ playUiClick, playConfettiSound }) {
  const triggerAcademicCelebration = () => {
    if (playConfettiSound) playConfettiSound();
    fireAcademicVictoryConfetti();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-8 space-y-6 font-mono"
    >
      {/* 1. Main Hero Bento Card (Clean, High-Fashion Cyber Neo-Brutalist Layout) */}
      <div className="bg-[#050505] border-3 border-white p-5 sm:p-7 md:p-8 relative shadow-[8px_8px_0px_0px_#39FF14]">
        {/* Subtle Matrix Tech Grid in Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#39FF1408_1px,transparent_1px),linear-gradient(to_bottom,#39FF1408_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-30" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-7 md:gap-8 items-center relative z-10">
          {/* Left Column: Animated Profile Portrait Frame */}
          <div className="md:col-span-5 flex flex-col items-center justify-center">
            <AnimatedProfileFrame playClickSound={playConfettiSound || playUiClick} />
          </div>

          {/* Right Column: Identity, Bio & High-Impact Credentials */}
          <div className="md:col-span-7 space-y-4">
            <div>
              <div className="text-[11px] font-mono text-[#39FF14] tracking-widest uppercase font-bold mb-1.5 flex items-center gap-2">
                <span>// JEE ASPIRANT 2028 • TECH BUILDER</span>
                <span className="w-2 h-2 rounded-full bg-[#39FF14] animate-ping" />
              </div>

              {/* Lowercase Title: aditya (white) + here. (neon green) */}
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white font-mono lowercase">
                aditya<span className="text-[#39FF14]">here.</span>
              </h1>

              {/* Animated Monospace Bio Description */}
              <div className="text-xs sm:text-sm text-neutral-200 font-mono leading-relaxed mt-2.5 border-l-3 border-[#39FF14] pl-3 py-1.5 bg-black/60 shadow-[inset_0px_0px_10px_rgba(0,0,0,0.5)] flex items-start gap-1">
                <span>"</span>
                <TerminalTextEffect text={portfolioData.hero.bio} speed={18} />
                <span>"</span>
              </div>
            </div>

            {/* Academic & Olympiads Achievement Hub (Clickable Confetti Fanfare) */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-[#FFE600]" /> COMPETITIVE ACADEMIC CREDENTIALS
                </span>
                <span className="text-[10px] text-[#39FF14] uppercase font-bold">
                  [ TAP FOR FIREWORKS ]
                </span>
              </div>

              {/* Grid of Key Achievements: Class 10th + IOQM + RMO + NSEP */}
              <div className="grid grid-cols-2 gap-2">
                {/* Class 10th Score */}
                <motion.div
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={triggerAcademicCelebration}
                  className="cursor-pointer bg-black border-2 border-white p-2.5 shadow-[3px_3px_0px_0px_#39FF14] hover:shadow-[4px_4px_0px_0px_#39FF14] transition-all"
                >
                  <div className="flex items-center justify-between text-[10px] text-neutral-400">
                    <span>CLASS 10TH</span>
                    <span className="text-[#39FF14] font-bold">100% IN IT</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white mt-0.5">
                    95.4% <span className="text-xs text-[#39FF14] font-normal">SCORE</span>
                  </div>
                </motion.div>

                {/* IOQM 2x Qualified */}
                <motion.div
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={triggerAcademicCelebration}
                  className="cursor-pointer bg-black border-2 border-white p-2.5 shadow-[3px_3px_0px_0px_#00E5FF] hover:shadow-[4px_4px_0px_0px_#00E5FF] transition-all"
                >
                  <div className="flex items-center justify-between text-[10px] text-neutral-400">
                    <span className="flex items-center gap-1"><Sigma className="w-3 h-3 text-[#00E5FF]" /> MATHS OLYMPIAD</span>
                    <span className="text-[#00E5FF] font-bold">STAGE 1</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-[#00E5FF] mt-0.5">
                    IOQM <span className="text-xs font-bold bg-[#00E5FF] text-black px-1.5 py-0.2">2X</span>
                  </div>
                </motion.div>

                {/* RMO 1x Qualified (1X only like others) */}
                <motion.div
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={triggerAcademicCelebration}
                  className="cursor-pointer bg-black border-2 border-white p-2.5 shadow-[3px_3px_0px_0px_#FFB800] hover:shadow-[4px_4px_0px_0px_#FFB800] transition-all"
                >
                  <div className="flex items-center justify-between text-[10px] text-neutral-400">
                    <span className="flex items-center gap-1"><Trophy className="w-3 h-3 text-[#FFB800]" /> REGIONAL MATHS</span>
                    <span className="text-[#FFB800] font-bold">STAGE 2</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-[#FFB800] mt-0.5">
                    RMO <span className="text-xs font-bold bg-[#FFB800] text-black px-1.5 py-0.2">1X</span>
                  </div>
                </motion.div>

                {/* NSEP 1x Qualified */}
                <motion.div
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={triggerAcademicCelebration}
                  className="cursor-pointer bg-black border-2 border-white p-2.5 shadow-[3px_3px_0px_0px_#FF007F] hover:shadow-[4px_4px_0px_0px_#FF007F] transition-all"
                >
                  <div className="flex items-center justify-between text-[10px] text-neutral-400">
                    <span className="flex items-center gap-1"><Atom className="w-3 h-3 text-[#FF007F]" /> PHYSICS OLYMPIAD</span>
                    <span className="text-[#FF007F] font-bold">NAT'L</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-[#FF007F] mt-0.5">
                    NSEP <span className="text-xs font-bold bg-[#FF007F] text-black px-1.5 py-0.2">1X</span>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Institution Badge Strip with Samarthya Classes */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px] text-neutral-400 font-mono">
              <span className="bg-black border border-white px-2 py-0.5 text-white flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#39FF14]" /> Allen Patna (Ashiyana Digha)
              </span>
              <span className="bg-black border border-neutral-700 px-2 py-0.5 text-neutral-300">
                Samarthya Classes
              </span>
              <span className="bg-black border border-neutral-700 px-2 py-0.5 text-neutral-300">
                Pioneer Academy Lalganj
              </span>
            </div>
          </div>
        </div>

        {/* Footer Meta Row inside Hero */}
        <div className="mt-6 pt-3.5 border-t-2 border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-neutral-400 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse" />
            <span>Patna / Hajipur, Bihar, India</span>
          </div>

          <div className="flex items-center gap-3">
            <LiveAge />
            <NavLink
              to="/timeline"
              onClick={playUiClick}
              className="text-[#39FF14] hover:underline font-bold flex items-center gap-1"
            >
              TIMELINE <ArrowRight className="w-3.5 h-3.5" />
            </NavLink>
          </div>
        </div>
      </div>

      {/* 2. Bento Quick Navigation Hub (Sleek, Clean 4-Card Grid) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-[#39FF14]" /> EXPLORATION HUBS
          </h3>
          <span className="text-[10px] text-neutral-500 font-mono">
            // SELECT ROUTE
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {
              to: '/timeline',
              title: 'Interactive Timeline',
              badge: '2011–2026+',
              desc: 'Academic milestones, early school years & future JEE goals',
              icon: <Calendar className="w-4 h-4 text-[#00E5FF]" />,
              accent: '#00E5FF',
              shadowColor: '#00E5FF'
            },
            {
              to: '/expertise',
              title: 'Expertise & Passions',
              badge: 'PHYSICS & AI',
              desc: 'Cricket strategy, classical mechanics & modern web systems',
              icon: <Zap className="w-4 h-4 text-[#FF007F]" />,
              accent: '#FF007F',
              shadowColor: '#FF007F'
            },
            {
              to: '/terminal',
              title: 'Logical AI Terminal',
              badge: 'NEMOTRON CLI',
              desc: 'Interactive agent command shell & portfolio query engine',
              icon: <Terminal className="w-4 h-4 text-[#39FF14]" />,
              accent: '#39FF14',
              shadowColor: '#39FF14'
            },
            {
              to: '/feedback',
              title: 'Visitor Board & Vault',
              badge: 'LIVE SUPABASE',
              desc: 'Direct private notes to Aditya & public guestbook board',
              icon: <MessageSquare className="w-4 h-4 text-[#FFE600]" />,
              accent: '#FFE600',
              shadowColor: '#FFE600'
            },
          ].map((card, idx) => (
            <NavLink key={idx} to={card.to} onClick={playUiClick}>
              <motion.div
                whileHover={{ y: -3, x: -3 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 450, damping: 15 }}
                className="bg-[#050505] border-2 border-white p-4 transition-all relative group h-full flex flex-col justify-between"
                style={{
                  boxShadow: `4px 4px 0px 0px ${card.shadowColor}`
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="p-1.5 bg-black border border-white">
                      {card.icon}
                    </span>
                    <span
                      className="text-[10px] font-black px-1.5 py-0.5 border border-white uppercase text-black"
                      style={{ backgroundColor: card.accent }}
                    >
                      {card.badge}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white group-hover:text-[#39FF14] transition-colors flex items-center gap-1">
                    {card.title}
                  </h4>

                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                    {card.desc}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-neutral-800 flex items-center justify-between text-[10px] text-neutral-400 group-hover:text-white transition-colors">
                  <span>LAUNCH MODULE</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            </NavLink>
          ))}
        </div>
      </div>

      {/* Interactive Floating AI Chatbot Modal */}
      <FloatingAiBotModal playClickSound={playUiClick} />
    </motion.div>
  );
}
