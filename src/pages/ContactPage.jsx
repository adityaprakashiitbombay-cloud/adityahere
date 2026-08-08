import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Share2,
  Copy,
  Check,
  ExternalLink,
  Instagram,
  Send,
  Twitter,
  MessageSquare,
  Globe,
  MessageCircle,
  Linkedin,
  Github,
  Mail,
  Phone,
  Sparkles,
  UserCheck,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { portfolioData } from '../data/portfolioData';
import MatrixDecodeText from '../components/MatrixDecodeText';

export default function ContactPage({ playClickSound }) {
  const [copiedHandle, setCopiedHandle] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all'); // 'all' | 'socials' | 'dev' | 'homies'

  const socialsList = portfolioData.socials || [];
  const homiesList = portfolioData.closeFriends || [];

  const handleCopy = (text, name) => {
    if (playClickSound) playClickSound();
    navigator.clipboard.writeText(text);
    setCopiedHandle(name);
    setTimeout(() => setCopiedHandle(null), 2500);

    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.8 },
      colors: ['#39FF14', '#00E5FF', '#FF007F']
    });
  };

  const getSocialIcon = (iconName) => {
    switch (iconName) {
      case 'Instagram': return <Instagram className="w-5 h-5" />;
      case 'Send': return <Send className="w-5 h-5" />;
      case 'Twitter': return <Twitter className="w-5 h-5" />;
      case 'MessageSquare': return <MessageSquare className="w-5 h-5" />;
      case 'Globe': return <Globe className="w-5 h-5" />;
      case 'MessageCircle': return <MessageCircle className="w-5 h-5" />;
      case 'Linkedin': return <Linkedin className="w-5 h-5" />;
      case 'Github': return <Github className="w-5 h-5" />;
      case 'Mail': return <Mail className="w-5 h-5" />;
      default: return <Share2 className="w-5 h-5" />;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="max-w-3xl mx-auto px-4 md:px-6 py-8 space-y-8 font-mono"
    >
      {/* Header Banner */}
      <div className="bg-[#000000] border-3 border-white p-6 relative shadow-[6px_6px_0px_0px_#39FF14]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-neutral-800 pb-4">
          <div>
            <span className="text-xs font-bold text-[#39FF14] uppercase tracking-widest flex items-center gap-1.5 font-mono mb-1">
              <Share2 className="w-4 h-4 text-[#39FF14] animate-spin" /> OFFICIAL CONTACT & SOCIAL MATRIX
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white font-mono">
              <MatrixDecodeText text="HANDLES & CONTACTS" className="text-white" />
            </h1>
          </div>

          <span className="bg-[#39FF14] text-black font-black px-3 py-1 text-xs border-2 border-white uppercase shadow-[2px_2px_0px_0px_#ffffff]">
            CONNECT DIRECTLY
          </span>
        </div>

        <p className="text-xs text-neutral-300 font-mono mt-4 leading-relaxed border-l-3 border-[#00E5FF] pl-3">
          Explore all official social handles, communication platforms, and verified homie networks for <strong className="text-[#39FF14]">adityahere.</strong> Tap any card to instantly copy handle or visit link!
        </p>
      </div>

      {/* Copy Toast Notification */}
      <AnimatePresence>
        {copiedHandle && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 z-50 bg-[#39FF14] text-black font-mono font-black px-4 py-2 border-2 border-white shadow-[4px_4px_0px_0px_#ffffff] flex items-center gap-2 text-xs"
          >
            <Check className="w-4 h-4" />
            <span>COPIED "{copiedHandle}" HANDLE TO CLIPBOARD! 📋</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Social Handles Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between font-mono text-xs text-neutral-400">
          <span className="text-[#39FF14] font-bold flex items-center gap-1">
            <Sparkles className="w-4 h-4" /> OFFICIAL HANDLES ({socialsList.length})
          </span>
          <span>CLICK CARD TO COPY</span>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {socialsList.map((item, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ x: -4, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="bg-[#000000] border-2 border-white p-4 shadow-[4px_4px_0px_0px_#39FF14] hover:shadow-[6px_6px_0px_0px_#00E5FF] transition-all cursor-pointer relative group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="p-2 border border-white bg-[#101010]"
                      style={{ color: item.color || '#39FF14' }}
                    >
                      {getSocialIcon(item.icon)}
                    </div>
                    <span className="font-bold text-sm text-white font-mono">{item.name}</span>
                  </div>

                  <span className="text-[10px] bg-[#181818] border border-neutral-700 text-neutral-300 px-2 py-0.5 font-mono">
                    VERIFIED
                  </span>
                </div>

                <div className="bg-[#080808] border border-neutral-800 p-2.5 my-2 flex items-center justify-between">
                  <code className="text-xs text-[#39FF14] font-mono font-bold truncate">
                    {item.handle}
                  </code>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(item.handle, item.name);
                    }}
                    className="p-1 text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
                    title="Copy Handle"
                  >
                    {copiedHandle === item.name ? (
                      <Check className="w-3.5 h-3.5 text-[#39FF14]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-neutral-800 text-[11px] font-mono">
                <button
                  onClick={() => handleCopy(item.handle, item.name)}
                  className="text-neutral-400 group-hover:text-[#39FF14] flex items-center gap-1 font-bold transition"
                >
                  <Copy className="w-3 h-3" /> COPY HANDLE
                </button>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-[#00E5FF] hover:underline flex items-center gap-1 font-bold"
                >
                  VISIT <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Homies Network Section */}
      <div className="bg-[#000000] border-3 border-white p-6 shadow-[6px_6px_0px_0px_#00E5FF] space-y-4">
        <div className="flex items-center justify-between border-b-2 border-neutral-800 pb-3">
          <span className="text-xs font-bold text-[#00E5FF] flex items-center gap-2 font-mono">
            <UserCheck className="w-4 h-4" /> CLOSE HOMIES NETWORK ({homiesList.length})
          </span>
          <span className="bg-[#00E5FF] text-black font-mono font-bold text-[10px] px-2 py-0.5">
            VERIFIED FRIENDS
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
          {homiesList.map((friend, index) => (
            <div
              key={index}
              className="bg-[#050505] border border-white p-3 flex items-center justify-between shadow-[2px_2px_0px_0px_#ffffff]"
            >
              <div>
                <span className="font-bold text-white text-xs block">{friend.name}</span>
                <span className="text-[10px] text-[#39FF14] block">{friend.tag}</span>
              </div>
              <span className="text-[10px] text-neutral-400 border border-neutral-700 px-2 py-0.5 bg-[#101010]">
                {friend.school}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Direct Contact Prompt Banner */}
      <div className="bg-[#39FF14] text-black p-5 border-3 border-white shadow-[6px_6px_0px_0px_#ffffff] font-mono text-center space-y-2">
        <h3 className="text-base font-black uppercase tracking-tight">
          ⚡ WANT TO UPDATE OR ADD MORE HANDLES?
        </h3>
        <p className="text-xs font-bold leading-relaxed max-w-xl mx-auto">
          Send your updated handle list (Instagram, Telegram, GitHub, Email, Discord, X) directly in chat, and they'll instantly populate here!
        </p>
      </div>
    </motion.div>
  );
}
