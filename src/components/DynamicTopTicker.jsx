import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, X, Sparkles, Award, Zap, Cpu, BookOpen, Heart, Flame, MessageSquare, Rocket, Trophy, Sigma, Atom, GraduationCap, Edit3 } from 'lucide-react';
import { usePortfolio } from '../hooks/usePortfolio';

const ANNOUNCEMENTS = [
  // GROUP 1 (Badges 1 to 4: Academics, Olympiads & Institutions)
  {
    id: 1,
    tag: 'OLYMPIAD & ACADEMICS',
    title: '🏆 OLYMPIADS & 95.4%',
    message: 'IOQM Qualified (2x) • RMO Qualified (1x) • NSEP Qualified (1x) • 95.4% in 10th (100% in IT)!',
    bg: 'bg-[#FFE600]',
    color: 'text-black',
    icon: <Trophy className="w-3.5 h-3.5" />,
    animType: 'kinetic'
  },
  {
    id: 2,
    tag: 'MATHS & PHYSICS OLYMPIADS',
    title: '📐 IOQM • RMO • NSEP',
    message: 'Stage 1 & 2 Mathematics (IOQM/RMO) + National Standard Physics Olympiad (NSEP) Qualifier',
    bg: 'bg-[#00E5FF]',
    color: 'text-black',
    icon: <Sigma className="w-3.5 h-3.5 animate-pulse" />,
    animType: 'glitch'
  },
  {
    id: 3,
    tag: 'LIVE MISSION',
    title: '⚛️ IIT JEE 2028',
    message: '2-Year Classroom Program @ Allen Patna (Ashiyana Digha Branch) | Focus: Physics & Maths',
    bg: 'bg-[#39FF14]',
    color: 'text-black',
    icon: <Atom className="w-3.5 h-3.5 animate-spin" />,
    animType: 'typing'
  },
  {
    id: 4,
    tag: 'ALMA MATER & COACHING',
    title: '🏫 SAMARTHYA & PIONEER',
    message: 'Samarthya Classes, Pioneer Academy Lalganj & St. Michaels (Mentored by Neha Mam & Ajit Sir)',
    bg: 'bg-[#FF007F]',
    color: 'text-black',
    icon: <GraduationCap className="w-3.5 h-3.5" />,
    animType: 'bounce'
  },
  // GROUP 2 (Badges 5 to 8: Alma Mater, Worldview, Passions & Vault)
  {
    id: 5,
    tag: 'WORLDVIEW & VALUES',
    title: '🧠 CORE PRINCIPLES',
    message: 'Secular Rationalist (Atheist), Gender Equality (Feminist) & Progressive Leftist',
    bg: 'bg-[#00E5FF]',
    color: 'text-black',
    icon: <Heart className="w-3.5 h-3.5" />,
    animType: 'shimmer'
  },
  {
    id: 6,
    tag: 'PASSIONS & CRAFT',
    title: '🏏 CRICKET & SYSTEMS',
    message: 'Passionate about Cricket Analytics, Agentic AI, Autonomous Workflows & Physics Mechanics',
    bg: 'bg-[#39FF14]',
    color: 'text-black',
    icon: <Flame className="w-3.5 h-3.5" />,
    animType: 'laser'
  },
  {
    id: 7,
    tag: 'COMMUNITY VAULT',
    title: '💬 VISITOR BOARD',
    message: 'Leave a direct private note or public feedback for Aditya with live Supabase sync!',
    bg: 'bg-[#FFE600]',
    color: 'text-black',
    icon: <MessageSquare className="w-3.5 h-3.5" />,
    animType: 'pulse'
  },
  {
    id: 8,
    tag: 'FUTURE ROADMAP',
    title: '🚀 JEE ADVANCED & BEYOND',
    message: 'Targeting Top 100 AIR in JEE Advanced 2028 & Building Intelligent Autonomous Systems',
    bg: 'bg-[#FF007F]',
    color: 'text-black',
    icon: <Rocket className="w-3.5 h-3.5 animate-pulse" />,
    animType: 'rocket'
  }
];

export default function DynamicTopTicker({ playUiClick }) {
  const { isAdmin } = usePortfolio();
  // Phases: 'group1' (20s) -> 'morph1' (4s) -> 'group2' (20s) -> 'morph2' (4s)
  const [phase, setPhase] = useState('group1');
  const [badgeIdx, setBadgeIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Main Cycle Timer: 20s Group (5s per badge) & 4s Morph
  useEffect(() => {
    if (isPaused) return; // Freeze timer if user hovers on badge or morph

    let timer;
    if (phase === 'group1') {
      // Show Badges 1-4 for 20 seconds (5.0s per badge)
      setBadgeIdx(0);
      timer = setTimeout(() => {
        setPhase('morph1');
      }, 20000);
    } else if (phase === 'morph1') {
      // Morph back to continuous marquee for exactly 4 seconds (not increased)
      timer = setTimeout(() => {
        setPhase('group2');
      }, 4000);
    } else if (phase === 'group2') {
      // Show Badges 5-8 for 20 seconds (5.0s per badge)
      setBadgeIdx(4);
      timer = setTimeout(() => {
        setPhase('morph2');
      }, 20000);
    } else if (phase === 'morph2') {
      // Morph back to continuous marquee for exactly 4 seconds, then repeat cycle
      timer = setTimeout(() => {
        setPhase('group1');
      }, 4000);
    }

    return () => clearTimeout(timer);
  }, [phase, isPaused]);

  // Sub-timer: Cycles through the 4 badges every 5.0 seconds (increased by 1 sec, pauses on hover)
  useEffect(() => {
    if (isPaused) return;
    if (phase !== 'group1' && phase !== 'group2') return;

    const baseOffset = phase === 'group1' ? 0 : 4;
    const subInterval = setInterval(() => {
      setBadgeIdx((prev) => {
        const nextRelative = (prev - baseOffset + 1) % 4;
        return baseOffset + nextRelative;
      });
    }, 5000);

    return () => clearInterval(subInterval);
  }, [phase, isPaused]);

  const handleManualTrigger = () => {
    if (playUiClick) playUiClick();
    if (phase === 'morph1') {
      setPhase('group2');
    } else if (phase === 'morph2') {
      setPhase('group1');
    } else {
      setBadgeIdx((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }
  };

  const handleDismiss = (e) => {
    e.stopPropagation();
    if (playUiClick) playUiClick();
    if (phase === 'group1') {
      setPhase('morph1');
    } else {
      setPhase('morph2');
    }
  };

  const isFlashActive = phase === 'group1' || phase === 'group2';
  const defaultAlert = ANNOUNCEMENTS[0] || {
    id: 1,
    tag: 'OLYMPIAD & ACADEMICS',
    title: '🏆 OLYMPIADS & 95.4%',
    message: 'IOQM Qualified (2x) • RMO Qualified (1x) • NSEP Qualified (1x) • 95.4% in 10th (100% in IT)!',
    bg: 'bg-[#FFE600]',
    color: 'text-black',
    animType: 'kinetic'
  };
  const currentAlert = ANNOUNCEMENTS[badgeIdx] || defaultAlert;

  // Dynamic animation variants for creative variety
  const getBadgeVariants = (animType) => {
    switch (animType) {
      case 'kinetic':
        return {
          initial: { x: -60, opacity: 0, scale: 0.95 },
          animate: { x: 0, opacity: 1, scale: 1 },
          exit: { x: 60, opacity: 0, scale: 0.95 }
        };
      case 'glitch':
        return {
          initial: { y: -25, opacity: 0, skewX: -6 },
          animate: { y: 0, opacity: 1, skewX: 0 },
          exit: { y: 25, opacity: 0, skewX: 6 }
        };
      case 'typing':
        return {
          initial: { opacity: 0, scale: 0.92 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 1.05 }
        };
      case 'bounce':
        return {
          initial: { y: 30, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          exit: { y: -30, opacity: 0 }
        };
      case 'shimmer':
        return {
          initial: { opacity: 0, rotateX: 45 },
          animate: { opacity: 1, rotateX: 0 },
          exit: { opacity: 0, rotateX: -45 }
        };
      case 'laser':
        return {
          initial: { x: 80, opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: -80, opacity: 0 }
        };
      case 'rocket':
        return {
          initial: { y: 40, opacity: 0, scale: 0.9 },
          animate: { y: 0, opacity: 1, scale: 1 },
          exit: { y: -40, opacity: 0, scale: 1.1 }
        };
      default:
        return {
          initial: { y: -20, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          exit: { y: 20, opacity: 0 }
        };
    }
  };

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative z-50 border-b-2 border-white select-none shadow-[0px_2px_0px_0px_#ffffff] font-mono overflow-hidden"
    >
      <AnimatePresence mode="wait">
        {isFlashActive ? (
          /* POP-UP / FLASH ANNOUNCEMENT MODE (5.0s reading time per badge, pauses on hover) */
          <motion.div
            key={`flash-${currentAlert.id}-${badgeIdx}`}
            variants={getBadgeVariants(currentAlert.animType)}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: "spring", stiffness: 420, damping: 24 }}
            className={`${currentAlert.bg} ${currentAlert.color} font-black text-xs py-2 px-3 flex items-center justify-between shadow-[inset_0px_0px_12px_rgba(0,0,0,0.25)] cursor-pointer`}
            onClick={handleManualTrigger}
            title={isPaused ? "Paused on hover - move mouse away to resume" : "Click to view next announcement"}
          >
            <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
              <span className="bg-black text-white px-2 py-0.5 text-[10px] uppercase font-mono tracking-wider border border-white flex items-center gap-1.5 shrink-0 shadow-[1px_1px_0px_0px_#ffffff]">
                {currentAlert.icon}
                <span>{currentAlert.tag}</span>
              </span>

              <span className="bg-black text-white px-2 py-0.5 text-[10px] uppercase font-mono border border-white shrink-0 hidden sm:inline-block">
                {currentAlert.title}
              </span>

              <span className="text-xs truncate font-mono tracking-tight font-extrabold text-black">
                {currentAlert.message}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0 ml-2">
              {/* Status indicator when paused */}
              {isPaused && (
                <span className="text-[10px] bg-black text-[#39FF14] px-1.5 py-0.5 border border-white font-mono hidden md:inline-block">
                  [ PAUSED ]
                </span>
              )}

              {/* Dynamic Badge Progress Bar (5.0s) */}
              <div className="w-10 h-1.5 bg-black/30 border border-black/40 overflow-hidden hidden md:block">
                <motion.div
                  key={badgeIdx}
                  initial={{ width: "0%" }}
                  animate={{ width: isPaused ? "50%" : "100%" }}
                  transition={{ duration: 5.0, ease: "linear" }}
                  className="h-full bg-black"
                />
              </div>

              {/* Badge 1-8 Counter */}
              <span className="text-[10px] bg-black text-white px-1.5 py-0.5 border border-white font-mono hidden md:inline-block font-bold">
                {badgeIdx + 1} / {ANNOUNCEMENTS.length}
              </span>

              <button
                onClick={handleDismiss}
                className="bg-black text-white hover:bg-neutral-800 p-0.5 border border-white transition-all shadow-[1px_1px_0px_0px_#ffffff]"
                title="Dismiss to normal scroll"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        ) : (
          /* 4-SECOND MORPH / CONTINUOUS MARQUEE MODE (Stops on hover) */
          <motion.div
            key={`morph-${phase}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={handleManualTrigger}
            className="bg-[#39FF14] text-black font-black text-xs py-1.5 overflow-hidden cursor-pointer group"
            title={isPaused ? "Paused on hover" : "Click to trigger latest newsflash popup"}
          >
            <div className={`animate-marquee-smooth font-mono ${isPaused ? '[animation-play-state:paused]' : ''}`}>
              {/* Block 1 */}
              <div className="inline-flex items-center gap-6 px-4 shrink-0">
                <span>⚡ adityahere. // DEVELOPER PORTFOLIO</span>
                <span>◆</span>
                <span>🏆 IOQM (2x) • RMO (1x) • NSEP (1x) QUALIFIER</span>
                <span>◆</span>
                <span>🎓 CLASS 10TH: 95.4% (100% IN IT)</span>
                <span>◆</span>
                <span>⚛️ IIT JEE ASPIRANT 2026–2028 @ ALLEN PATNA</span>
                <span>◆</span>
                <span>🏫 SAMARTHYA CLASSES, PIONEER ACADEMY & ST. MICHAELS</span>
                <span>◆</span>
                <span>🧠 ATHEIST / FEMINIST / LEFTIST</span>
                <span>◆</span>
                <span>🏏 CRICKET / 🤖 AI / 💡 INNOVATION / ⚛️ PHYSICS</span>
                <span>◆</span>
                <span className="bg-black text-[#39FF14] px-1.5 py-0.2 text-[10px] uppercase border border-white">
                  📢 LIVE FLASH ROTATION
                </span>
                <span>◆</span>
              </div>

              {/* Block 2 (Exact Duplicate for 100% Seamless Infinite Loop) */}
              <div className="inline-flex items-center gap-6 px-4 shrink-0" aria-hidden="true">
                <span>⚡ adityahere. // DEVELOPER PORTFOLIO</span>
                <span>◆</span>
                <span>🏆 IOQM (2x) • RMO (1x) • NSEP (1x) QUALIFIER</span>
                <span>◆</span>
                <span>🎓 CLASS 10TH: 95.4% (100% IN IT)</span>
                <span>◆</span>
                <span>⚛️ IIT JEE ASPIRANT 2026–2028 @ ALLEN PATNA</span>
                <span>◆</span>
                <span>🏫 SAMARTHYA CLASSES, PIONEER ACADEMY & ST. MICHAELS</span>
                <span>◆</span>
                <span>🧠 ATHEIST / FEMINIST / LEFTIST</span>
                <span>◆</span>
                <span>🏏 CRICKET / 🤖 AI / 💡 INNOVATION / ⚛️ PHYSICS</span>
                <span>◆</span>
                <span className="bg-black text-[#39FF14] px-1.5 py-0.2 text-[10px] uppercase border border-white">
                  📢 LIVE FLASH ROTATION
                </span>
                <span>◆</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
