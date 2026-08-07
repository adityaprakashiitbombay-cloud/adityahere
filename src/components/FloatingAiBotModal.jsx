import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, X, Terminal, Zap } from 'lucide-react';
import { saveAiChatConversation } from '../lib/supabaseClient';

export default function FloatingAiBotModal({ playClickSound }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleOpen = () => {
    if (playClickSound) playClickSound();
    setIsOpen(true);
  };

  const handleClose = () => {
    if (playClickSound) playClickSound();
    setIsOpen(false);
  };

  const handleSendToTerminal = (e) => {
    e?.preventDefault();
    const promptToSend = query.trim();
    if (!promptToSend) return;

    if (playClickSound) playClickSound();

    // Log the initial user query into AI chat logs
    saveAiChatConversation({
      userPrompt: promptToSend,
      aiResponse: 'Transferred query to Terminal Logical Agent shell.',
      source: 'Floating Home Bot'
    });

    setIsOpen(false);
    setQuery('');

    // Smoothly redirect to Terminal with the pre-populated question
    navigate(`/terminal?q=${encodeURIComponent(promptToSend)}`);
  };

  return (
    <>
      {/* Floating Trigger Button (Bottom-Right of screen) */}
      <div className="fixed bottom-6 right-6 z-40 font-mono">
        <motion.button
          whileHover={{ scale: 1.08, x: -3, y: -3 }}
          whileTap={{ scale: 0.94 }}
          transition={{ type: "spring", stiffness: 450, damping: 15 }}
          onClick={handleOpen}
          className="bg-black border-3 border-white px-3.5 py-2.5 shadow-[5px_5px_0px_0px_#39FF14] hover:shadow-[7px_7px_0px_0px_#00E5FF] transition-all flex items-center gap-2.5 group cursor-pointer"
          title="Ask Aditya's AI Assistant"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#39FF14] opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#39FF14]" />
          </span>

          <div className="flex items-center gap-1.5 text-xs font-black text-white group-hover:text-[#39FF14] transition-colors">
            <Bot className="w-4 h-4 text-[#39FF14]" />
            <span className="tracking-wide">ASK AI</span>
          </div>

          <span className="hidden sm:inline-block bg-[#39FF14] text-black text-[9px] font-black px-1.5 py-0.2 border border-black uppercase">
            NEMOTRON
          </span>
        </motion.button>
      </div>

      {/* Cyber Quick-Chat Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-mono">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="w-full max-w-lg bg-[#050505] border-3 border-white p-6 relative shadow-[10px_10px_0px_0px_#00E5FF]"
            >
              {/* Corner Neon Brackets */}
              <span className="absolute top-2 left-2 text-[#39FF14] text-sm font-bold">┌</span>
              <span className="absolute top-2 right-2 text-[#00E5FF] text-sm font-bold">┐</span>
              <span className="absolute bottom-2 left-2 text-[#FF007F] text-sm font-bold">└</span>
              <span className="absolute bottom-2 right-2 text-[#FFE600] text-sm font-bold">┘</span>

              {/* Modal Top Header */}
              <div className="flex items-center justify-between border-b-2 border-white pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-black border border-white">
                    <Bot className="w-5 h-5 text-[#39FF14] animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white uppercase flex items-center gap-1.5">
                      <span>ADITYA AI ASSISTANT</span>
                      <span className="text-[9px] bg-[#00E5FF] text-black px-1.5 py-0.2 font-mono font-bold">
                        V5.0
                      </span>
                    </h3>
                    <p className="text-[10px] text-neutral-400">
                      Ask any question → Instant answer in Terminal Shell
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleClose}
                  className="bg-black hover:bg-neutral-800 border border-white text-white p-1 shadow-[2px_2px_0px_0px_#ffffff] active:scale-95 transition-transform cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Question Input Form */}
              <form onSubmit={handleSendToTerminal} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-300 uppercase mb-1.5">
                    Your Question for Aditya AI:
                  </label>
                  <div className="relative">
                    <textarea
                      required
                      autoFocus
                      rows={4}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Type any question here (e.g. Tell me about Class 10th score, Allen Patna preparation, Olympiads, mentors, or physics problems)..."
                      className="w-full bg-black border-2 border-white p-3 text-xs text-white placeholder-neutral-600 focus:border-[#39FF14] focus:shadow-[4px_4px_0px_0px_#39FF14] outline-none transition-all resize-none font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-neutral-500 flex items-center gap-1">
                    <Terminal className="w-3 h-3 text-[#00E5FF]" /> Auto-redirects to Terminal CLI
                  </span>

                  <button
                    type="submit"
                    className="bg-[#39FF14] hover:bg-[#4fff2e] text-black font-black px-5 py-2 text-xs uppercase border-2 border-white shadow-[4px_4px_0px_0px_#ffffff] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>SUBMIT QUESTION</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
