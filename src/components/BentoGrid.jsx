import React from 'react';
import { motion } from 'framer-motion';
import HeroTimelineCard from './HeroTimelineCard';
import IdeologiesCard from './IdeologiesCard';
import ExpertiseCard from './ExpertiseCard';
import SocialsFriendsCard from './SocialsFriendsCard';
import ArtworkQuotesCard from './ArtworkQuotesCard';
import VisitorFeedbackCard from './VisitorFeedbackCard';
import TerminalAgentCard from './TerminalAgentCard';

export default function BentoGrid({ playClickSound }) {
  // Staggered Container Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-8">
      {/* 
        Single Vertical Column Bento Box Stack:
        - max-w-3xl mx-auto flex flex-col gap-8
        - Staggered entry load
        - Electric green (#39FF14) hard offset shadows
      */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-8"
      >
        {/* Module 1: Core Hero & Bio & Timeline */}
        <motion.div variants={itemVariants}>
          <HeroTimelineCard playClickSound={playClickSound} />
        </motion.div>

        {/* Module 2: Identity & Ideologies Box */}
        <motion.div variants={itemVariants}>
          <IdeologiesCard playClickSound={playClickSound} />
        </motion.div>

        {/* Module 3: Expertise & Core Passions */}
        <motion.div variants={itemVariants}>
          <ExpertiseCard playClickSound={playClickSound} />
        </motion.div>

        {/* Module 4: Handles & Close Friends Box */}
        <motion.div variants={itemVariants}>
          <SocialsFriendsCard playClickSound={playClickSound} />
        </motion.div>

        {/* Module 5: Personal Writings & Quotes */}
        <motion.div variants={itemVariants}>
          <ArtworkQuotesCard playClickSound={playClickSound} />
        </motion.div>

        {/* Module 6: Visitor Feedback Box (Supabase + Local) */}
        <motion.div variants={itemVariants}>
          <VisitorFeedbackCard playClickSound={playClickSound} />
        </motion.div>

        {/* Module 7: Interactive AI Agent CLI with Secret ALPHA key */}
        <motion.div variants={itemVariants}>
          <TerminalAgentCard playClickSound={playClickSound} />
        </motion.div>
      </motion.div>

      {/* Tech & Academic Ecosystem Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-8 bg-[#000000] border-3 border-white p-6 shadow-[6px_6px_0px_0px_#39FF14] hover:shadow-[10px_10px_0px_0px_#39FF14] transition-all"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-neutral-300">
          <div className="flex items-center gap-2 font-black text-[#39FF14]">
            <span>:: TECH & ACADEMIC ECOSYSTEM ::</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 font-bold text-white uppercase tracking-wider text-[11px]">
            <span className="bg-[#121318] px-2.5 py-1 border border-neutral-700 hover:border-[#39FF14]">
              ⚛️ REACT 19
            </span>
            <span className="bg-[#121318] px-2.5 py-1 border border-neutral-700 hover:border-[#39FF14]">
              ⚡ TAILWIND CSS
            </span>
            <span className="bg-[#121318] px-2.5 py-1 border border-neutral-700 hover:border-[#39FF14]">
              🟢 SUPABASE DB
            </span>
            <span className="bg-[#121318] px-2.5 py-1 border border-neutral-700 hover:border-[#FF5500]">
              🎯 ALLEN PATNA
            </span>
            <span className="bg-[#121318] px-2.5 py-1 border border-neutral-700 hover:border-[#00E5FF]">
              🤖 AI MATRIX
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
