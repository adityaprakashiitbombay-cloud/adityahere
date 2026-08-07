import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Baby, BookOpen, GraduationCap, Award, Zap, MapPin, Target, Sparkles, Compass, CheckCircle2 } from 'lucide-react';
import { fireAcademicVictoryConfetti } from '../utils/confettiEffects';
import { portfolioData } from '../data/portfolioData';
import MatrixDecodeText from '../components/MatrixDecodeText';
import { springBounce, cardHoverEffect } from '../animations/variants';

const ERA_COLORS = [
  { border: '#FF007F', shadow: '#FF007F', badgeBg: '#FF007F', text: 'white' },
  { border: '#00E5FF', shadow: '#00E5FF', badgeBg: '#00E5FF', text: 'black' },
  { border: '#FFE600', shadow: '#FFE600', badgeBg: '#FFE600', text: 'black' },
  { border: '#39FF14', shadow: '#39FF14', badgeBg: '#39FF14', text: 'black' },
  { border: '#00E5FF', shadow: '#00E5FF', badgeBg: '#00E5FF', text: 'black' },
];

export default function TimelinePage({ playUiClick, playHeavenlyMusic }) {
  const [selectedYearIndex, setSelectedYearIndex] = useState(3); // Default to Class 10th milestone (2024–2026)

  const triggerAcademicCelebration = () => {
    if (playHeavenlyMusic) playHeavenlyMusic();
    fireAcademicVictoryConfetti();
  };

  const getMilestoneIcon = (iconName, isFuture, idx) => {
    if (isFuture) return <Zap className="w-5 h-5 text-[#00E5FF] animate-pulse" />;
    switch (iconName) {
      case 'Baby': return <Baby className="w-5 h-5 text-[#FF007F]" />;
      case 'BookOpen': return <BookOpen className="w-5 h-5 text-[#00E5FF]" />;
      case 'GraduationCap': return <GraduationCap className="w-5 h-5 text-[#FFE600]" />;
      case 'Award': return <Award className="w-5 h-5 text-[#39FF14]" />;
      case 'Zap': return <Zap className="w-5 h-5 text-[#00E5FF]" />;
      default: return <GraduationCap className="w-5 h-5 text-[#39FF14]" />;
    }
  };

  const activeMilestone = portfolioData.milestones[selectedYearIndex];
  const activeColor = ERA_COLORS[selectedYearIndex] || ERA_COLORS[3];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
      className="max-w-3xl mx-auto px-4 md:px-6 py-8 space-y-8 font-mono relative"
    >
      {/* Header Cyber Dashboard Card */}
      <motion.div
        {...cardHoverEffect}
        className="brutal-card p-6 bg-[#050505] border-3 border-white shadow-[6px_6px_0px_0px_#FFE600] relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none font-mono text-8xl font-black text-[#FFE600]">
          CHRONO
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <span className="bg-[#FFE600] text-black font-black px-3 py-1 text-xs border-2 border-white shadow-[2px_2px_0px_0px_#ffffff] font-mono">
            INTERACTIVE TRAJECTORY DASHBOARD
          </span>
          <span className="text-xs text-[#00E5FF] font-bold font-mono flex items-center gap-1">
            <Compass className="w-3.5 h-3.5" /> 2011 ➔ 2026 & BEYOND
          </span>
        </div>

        <h1 className="text-3xl font-black text-white tracking-tight font-mono">
          <MatrixDecodeText text="Educational & Future Roadmap" className="text-white" />
        </h1>
        <p className="text-xs text-neutral-400 mt-1 font-mono">
          Explore foundational milestones, Olympiad qualifications, and IIT JEE 2028 targets:
        </p>

        {/* Horizontal Multi-Tone Track Selector */}
        <div className="mt-6 flex items-center justify-between border-2 border-white bg-[#000000] p-2 overflow-x-auto gap-2 shadow-[4px_4px_0px_0px_#00E5FF]">
          {portfolioData.milestones.map((m, idx) => {
            const isSelected = selectedYearIndex === idx;
            const eraColor = ERA_COLORS[idx] || ERA_COLORS[3];
            return (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                onClick={() => {
                  setSelectedYearIndex(idx);
                  if (m.highlight && !m.isFuture) {
                    triggerAcademicCelebration();
                  } else if (playUiClick) {
                    playUiClick();
                  }
                }}
                style={{
                  backgroundColor: isSelected ? eraColor.badgeBg : '#000000',
                  color: isSelected ? eraColor.text : '#ffffff',
                  boxShadow: isSelected ? '3px 3px 0px 0px #ffffff' : 'none'
                }}
                className="px-3 py-2 text-xs font-black font-mono border-2 border-white whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {getMilestoneIcon(m.icon, m.isFuture, idx)}
                <span>{m.year}</span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Active Milestone Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedYearIndex}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.3 }}
          whileHover={{ x: -4, y: -4 }}
          style={{
            borderColor: activeColor.border,
            boxShadow: `6px 6px 0px 0px ${activeColor.shadow}`
          }}
          className="brutal-card p-6 md:p-8 bg-[#050505] border-3"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <span
              style={{ backgroundColor: activeColor.badgeBg, color: activeColor.text }}
              className="font-black px-3 py-1 text-xs border-2 border-white shadow-[2px_2px_0px_0px_#ffffff]"
            >
              {activeMilestone.year}
            </span>
            <span className="text-xs text-neutral-400 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#00E5FF]" /> {activeMilestone.location}
            </span>
          </div>

          <h2 className="text-2xl font-black text-white mt-2 flex items-center gap-2">
            {getMilestoneIcon(activeMilestone.icon, activeMilestone.isFuture, selectedYearIndex)} {activeMilestone.title}
          </h2>

          <p className="text-sm text-neutral-300 mt-3 leading-relaxed border-l-4 border-white pl-4 py-2 bg-[#000000]">
            "{activeMilestone.description}"
          </p>

          {/* Academic Victory Highlight & Olympiads Badges */}
          {activeMilestone.achievement && (
            <motion.div
              whileHover={{ x: -4, y: -4 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              onClick={triggerAcademicCelebration}
              className="mt-4 bg-[#000000] border-2 border-[#39FF14] p-4 cursor-pointer shadow-[4px_4px_0px_0px_#39FF14] hover:shadow-[6px_6px_0px_0px_#00E5FF] transition-all"
            >
              <div className="flex items-center justify-between mb-1.5 text-xs text-[#39FF14] font-bold">
                <span>🏆 ACADEMIC ACHIEVEMENT & OLYMPIADS</span>
                <span className="bg-[#39FF14] text-black px-2 py-0.5 text-[10px] animate-bounce">TAP FOR FIREWORKS 🎉</span>
              </div>
              <p className="text-sm font-bold text-white mb-3">
                {activeMilestone.achievement}
              </p>

              {/* Olympiad High-Contrast Badges Row */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-800 text-center text-xs font-black">
                <div className="bg-[#050505] border-2 border-[#00E5FF] p-2 text-[#00E5FF] shadow-[2px_2px_0px_0px_#00E5FF]">
                  <span className="block text-lg">2X</span>
                  <span className="text-[10px] text-white">IOQM QUALIFIED</span>
                </div>
                <div className="bg-[#050505] border-2 border-[#FFE600] p-2 text-[#FFE600] shadow-[2px_2px_0px_0px_#FFE600]">
                  <span className="block text-lg">1X</span>
                  <span className="text-[10px] text-white">RMO QUALIFIED</span>
                </div>
                <div className="bg-[#050505] border-2 border-[#FF007F] p-2 text-[#FF007F] shadow-[2px_2px_0px_0px_#FF007F]">
                  <span className="block text-lg">1X</span>
                  <span className="text-[10px] text-white">NSEP QUALIFIED</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Future Roadmap Card Special Section */}
          {activeMilestone.isFuture && (
            <div className="mt-5 pt-4 border-t-2 border-neutral-800">
              <div className="flex items-center gap-2 text-xs font-bold text-[#00E5FF] mb-3">
                <Target className="w-4 h-4 text-[#00E5FF]" />
                <span>FUTURE TARGET PILLARS (2026–2028 & BEYOND):</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-bold">
                <div className="p-2 bg-[#000000] border border-[#00E5FF] text-[#00E5FF] shadow-[2px_2px_0px_0px_#00E5FF]">
                  ⚛️ ADVANCED PHYSICS
                </div>
                <div className="p-2 bg-[#000000] border border-[#39FF14] text-[#39FF14] shadow-[2px_2px_0px_0px_#39FF14]">
                  📐 PURE MATHEMATICS
                </div>
                <div className="p-2 bg-[#000000] border border-[#FF007F] text-[#FF007F] shadow-[2px_2px_0px_0px_#FF007F]">
                  🧪 CHEMISTRY (JEE ADV)
                </div>
                <div className="p-2 bg-[#000000] border border-[#FFE600] text-[#FFE600] shadow-[2px_2px_0px_0px_#FFE600]">
                  🤖 AI SYSTEMS & CODE
                </div>
              </div>
            </div>
          )}

          {activeMilestone.mentors && (
            <div className="mt-5 pt-4 border-t-2 border-neutral-800">
              <p className="text-xs text-[#FFE600] font-bold uppercase tracking-wider mb-2">
                Samarthya Classes & Pioneer Academy Mentors:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {activeMilestone.mentors.map((mentor, midx) => (
                  <div key={midx} className="bg-[#000000] p-3 border-2 border-white shadow-[2px_2px_0px_0px_#ffffff]">
                    <span className="text-[#FFE600] font-bold">{mentor.name}</span> ({mentor.subject})
                    <p className="text-[11px] text-neutral-400 mt-1">{mentor.note}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeMilestone.friends && (
            <div className="mt-4 text-xs text-neutral-400">
              <strong className="text-white">Colleagues / Friends:</strong> {activeMilestone.friends.join(', ')}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Full Vertical Scroll Track */}
      <div className="space-y-6 pt-4">
        <div className="text-xs text-neutral-400 font-mono uppercase tracking-widest border-b border-neutral-800 pb-2 flex items-center justify-between">
          <span>// CHRONOLOGICAL SCROLL TRAJECTORY</span>
          <span className="text-[#39FF14]">5 MILESTONES LOADED</span>
        </div>

        <div className="relative border-l-3 border-[#39FF14] pl-6 space-y-6 ml-3">
          {portfolioData.milestones.map((m, idx) => {
            const eraColor = ERA_COLORS[idx] || ERA_COLORS[3];
            const isCurrent = selectedYearIndex === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                whileHover={{ x: -4, y: -4 }}
                onClick={() => {
                  setSelectedYearIndex(idx);
                  if (m.highlight && !m.isFuture) {
                    triggerAcademicCelebration();
                  } else if (playUiClick) {
                    playUiClick();
                  }
                }}
                style={{
                  borderColor: isCurrent ? eraColor.border : '#ffffff',
                  boxShadow: isCurrent ? `6px 6px 0px 0px ${eraColor.shadow}` : '4px 4px 0px 0px #ffffff'
                }}
                className="relative p-5 border-3 bg-[#050505] cursor-pointer transition-all"
              >
                <div
                  style={{ backgroundColor: eraColor.badgeBg }}
                  className="absolute -left-[31px] top-5 w-4 h-4 border-2 border-black"
                />

                <div className="flex items-center justify-between mb-1">
                  <span
                    style={{ backgroundColor: eraColor.badgeBg, color: eraColor.text }}
                    className="text-xs font-black px-2 py-0.5 font-mono"
                  >
                    {m.year}
                  </span>
                  <span className="text-xs text-neutral-400 font-mono flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#00E5FF]" /> {m.location}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mt-1 flex items-center gap-2">
                  {getMilestoneIcon(m.icon, m.isFuture, idx)} {m.title}
                </h3>

                <p className="text-xs text-neutral-300 mt-2 leading-relaxed">
                  {m.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
