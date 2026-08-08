import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, X, Terminal, Copy, Check, Sparkles, RefreshCw } from 'lucide-react';
import { saveAiChatConversation, logVisitorActivity } from '../lib/supabaseClient';
import AiThinkingDots from './AiThinkingDots';

export default function FloatingAiBotModal({ playClickSound }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleOpen = () => {
    if (playClickSound) playClickSound();
    setIsOpen(true);
    logVisitorActivity('Opened AI Quick Chat Bot');
  };

  const handleClose = () => {
    if (playClickSound) playClickSound();
    setIsOpen(false);
  };

  const handleCopyResponse = () => {
    if (aiResponse) {
      navigator.clipboard?.writeText(aiResponse);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const executeInlineQuery = async (e) => {
    e?.preventDefault();
    const promptToSend = query.trim();
    if (!promptToSend || isProcessing) return;

    if (playClickSound) playClickSound();
    setIsProcessing(true);
    setAiResponse(null);
    logVisitorActivity(`Asked AI: "${promptToSend.slice(0, 40)}"`);


    // Call API / synthesize response with thinking delay
    try {
      const response = await fetchAiAnswer(promptToSend);
      setAiResponse(response);
      saveAiChatConversation({
        userPrompt: promptToSend,
        aiResponse: response,
        source: 'Floating Quick Bot'
      });
    } catch (err) {
      setAiResponse("⚡ System Online. Aditya is a 15-year-old IIT JEE 2028 Aspirant at Allen Patna with 95.4% in 10th (100% IT) & Olympiad credentials (IOQM 2x, RMO 1x, NSEP 1x).");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRedirectToTerminal = () => {
    if (playClickSound) playClickSound();
    setIsOpen(false);
    const prompt = query.trim() || 'Tell me about Aditya';
    navigate(`/terminal?q=${encodeURIComponent(prompt)}`);
  };

  return (
    <>
      {/* Floating Trigger Button (Bottom-Right of screen with Continuous Float Animation) */}
      <div className="fixed bottom-6 right-6 z-40 font-mono">
        <motion.button
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          whileHover={{ scale: 1.08, x: -3, y: -3 }}
          whileTap={{ scale: 0.94 }}
          onClick={handleOpen}
          className="bg-black border-2 border-white px-3.5 py-2 shadow-[4px_4px_0px_0px_var(--color-primary,#39FF14)] hover:shadow-[6px_6px_0px_0px_var(--color-primary,#39FF14)] transition-all flex items-center gap-2.5 group cursor-pointer relative overflow-hidden font-mono"
          title="Ask Aditya's AI Assistant"
        >
          {/* Perfectly Circular Pulsing Green LED Radar Ring */}
          <div className="relative flex items-center justify-center w-3 h-3 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#39FF14] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#39FF14] shadow-[0_0_8px_#39FF14]" />
          </div>

          <div className="flex items-center gap-1.5 text-xs font-black text-white group-hover:text-[var(--color-primary,#39FF14)] transition-colors">
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Bot className="w-4 h-4 text-[var(--color-primary,#39FF14)]" />
            </motion.div>
            <span className="tracking-wider uppercase font-mono font-black text-xs sm:text-sm">ASK AI</span>
          </div>

          <span className="hidden sm:inline-block bg-[var(--color-primary,#39FF14)] text-black text-[9px] font-black px-1.5 py-0.2 border border-black uppercase font-mono tracking-wider shadow-[1px_1px_0px_0px_#ffffff]">
            NEMOTRON 5.0
          </span>
        </motion.button>
      </div>

      {/* Cyber Quick-Chat Floating Popover Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[440px] bg-[#050505] border-3 border-white p-5 font-mono shadow-[10px_10px_0px_0px_var(--color-primary,#39FF14)]"
          >
            {/* Corner Neon Brackets */}
            <span className="absolute top-2 left-2 text-[var(--color-primary,#39FF14)] text-sm font-bold">┌</span>
            <span className="absolute top-2 right-2 text-[#00E5FF] text-sm font-bold">┐</span>
            <span className="absolute bottom-2 left-2 text-[#FF007F] text-sm font-bold">└</span>
            <span className="absolute bottom-2 right-2 text-[#FFE600] text-sm font-bold">┘</span>

            {/* Modal Top Header */}
            <div className="flex items-center justify-between border-b-2 border-white pb-3 mb-4">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  className="p-2 bg-black border-2 border-[var(--color-primary,#39FF14)] shadow-[3px_3px_0px_0px_var(--color-primary,#39FF14)]"
                >
                  <Bot className="w-5 h-5 text-[var(--color-primary,#39FF14)]" />
                </motion.div>
                <div>
                  <h3 className="text-xs sm:text-sm font-black text-white uppercase flex items-center gap-1.5 tracking-tight">
                    <span>ADITYA AI ASSISTANT</span>
                    <span className="text-[9px] bg-[var(--color-primary,#39FF14)] text-black px-1 py-0.2 font-mono font-black border border-white">
                      V5.0
                    </span>
                  </h3>
                  <p className="text-[10px] text-neutral-400 font-mono mt-0.5">
                    Live Neural Agent • Real-Time Processing
                  </p>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="bg-black hover:bg-neutral-800 border-2 border-white text-white p-1.5 shadow-[2px_2px_0px_0px_#ffffff] active:scale-95 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Animated Thinking 3-Dot Status Indicator */}
            {isProcessing && (
              <AiThinkingDots 
                label="AI BOT THINKING" 
                subtext="Synthesizing neural response..." 
                size="md" 
              />
            )}

            {/* AI Response Display Card */}
            {!isProcessing && aiResponse && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#020702] border-2 border-[#39FF14] p-3.5 mb-4 shadow-[4px_4px_0px_0px_#39FF14] relative font-mono text-xs text-white leading-relaxed shadow-[inset_0px_0px_12px_rgba(57,255,20,0.08)]"
              >
                <div className="flex items-center justify-between text-[10px] text-[#39FF14] font-black uppercase mb-2 border-b border-[#39FF14]/20 pb-1.5 select-none">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#39FF14] animate-ping" />
                    <span>🤖 NEMOTRON 5.0 RESPONSE</span>
                  </span>
                  <button
                    onClick={handleCopyResponse}
                    className="bg-black hover:bg-[#39FF14] hover:text-black border border-[#39FF14] text-[#39FF14] px-2 py-0.5 text-[9px] flex items-center gap-1 transition-colors cursor-pointer font-bold shadow-[1px_1px_0px_0px_#39FF14]"
                  >
                    {copied ? <Check className="w-3 h-3 text-[#39FF14]" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'COPIED' : 'COPY'}</span>
                  </button>
                </div>
                
                <div className="text-white text-xs leading-relaxed space-y-1 font-mono">
                  {aiResponse.split('\n').map((line, lIdx) => {
                    const trimmed = line.trim();
                    if (!trimmed) return <div key={lIdx} className="h-1.5" />;

                    const isBullet = trimmed.startsWith('•') || trimmed.startsWith('-') || /^\d+\./.test(trimmed);
                    const isFormula = trimmed.includes('=') || trimmed.includes('∛') || trimmed.includes('√') || trimmed.includes('xₙ') || trimmed.includes('³') || trimmed.includes('²');

                    return (
                      <p 
                        key={lIdx} 
                        className={`${
                          isBullet 
                            ? 'text-[#00E5FF] pl-2 border-l-2 border-[#00E5FF] my-1 font-semibold' 
                            : isFormula 
                              ? 'text-[#FFE600] bg-black/60 px-2 py-1 border border-[#FFE600]/40 font-mono my-1 font-bold' 
                              : 'text-neutral-200'
                        }`}
                      >
                        {line}
                      </p>
                    );
                  })}
                </div>

                <div className="mt-3 pt-2 border-t border-neutral-800 flex justify-between items-center text-[10px]">
                  <button
                    onClick={() => { setAiResponse(null); setQuery(''); }}
                    className="text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer font-mono"
                  >
                    <RefreshCw className="w-3 h-3 text-[#00E5FF]" /> Clear & Ask New
                  </button>
                  <button
                    onClick={handleRedirectToTerminal}
                    className="text-[#39FF14] hover:underline font-bold flex items-center gap-1 cursor-pointer font-mono"
                  >
                    <Terminal className="w-3 h-3" /> Full Terminal CLI →
                  </button>
                </div>
              </motion.div>
            )}


            {/* Question Input Form */}
            {!isProcessing && (
              <form onSubmit={executeInlineQuery} className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-neutral-300 uppercase mb-1">
                    Type Your Question (JEE, Olympiads, 10th score, Physics):
                  </label>
                  <textarea
                    required
                    autoFocus
                    rows={2}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g. Tell me about Class 10th score, Allen Patna preparation, IOQM Olympiad..."
                    className="w-full bg-black border-2 border-white p-2.5 text-xs text-white placeholder-neutral-500 focus:border-[var(--color-primary,#39FF14)] focus:shadow-[3px_3px_0px_0px_var(--color-primary,#39FF14)] outline-none transition-all resize-none font-mono"
                  />
                </div>

                <div className="flex items-center justify-between pt-1 gap-2">
                  <button
                    type="button"
                    onClick={handleRedirectToTerminal}
                    className="text-[10px] text-neutral-400 hover:text-white flex items-center gap-1 font-mono cursor-pointer"
                  >
                    <Terminal className="w-3.5 h-3.5 text-[#00E5FF]" /> Open Terminal CLI
                  </button>

                  <button
                    type="submit"
                    disabled={!query.trim()}
                    className="bg-[var(--color-primary,#39FF14)] text-black font-black px-4 py-2 text-xs uppercase border-2 border-white shadow-[3px_3px_0px_0px_#ffffff] hover:shadow-[5px_5px_0px_0px_#ffffff] disabled:opacity-40 transition-all flex items-center gap-1.5 cursor-pointer font-mono"
                  >
                    <span>ASK AI</span>
                    <Send className="w-3 h-3 fill-black" />
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Helper to fetch AI answer with realistic thinking delay
async function fetchAiAnswer(prompt) {
  const p = prompt.toLowerCase();
  
  // Simulate thinking delay for realistic 3-dot animated processing
  await new Promise((res) => setTimeout(res, 850));

  if (p.includes('mark') || p.includes('score') || p.includes('10th') || p.includes('percent')) {
    return "Aditya scored 95.4% overall in Class 10th CBSE with a perfect 100/100 score in Information Technology (IT)! 💯";
  }
  if (p.includes('allen') || p.includes('jee') || p.includes('patna') || p.includes('iit')) {
    return "Aditya is preparing for IIT JEE 2028 at Allen Patna (Ashiyana Digha Branch) targeting JEE Advanced with Pathfinder & Irodov Physics problem solving.";
  }
  if (p.includes('olympiad') || p.includes('ioqm') || p.includes('rmo') || p.includes('nsep')) {
    return "Aditya is a 2x IOQM (Mathematics Olympiad Stage 1), 1x RMO (Stage 2 Regional Maths Olympiad), and 1x NSEP (National Standard Exam in Physics) qualifier!";
  }
  if (p.includes('mentor') || p.includes('teacher') || p.includes('neha') || p.includes('ajit')) {
    return "Key foundational mentors: Neha Mam (English & Communication) and Ajit Sir (Mathematics & Problem Solving) from Pioneer Academy & Samarthya Classes.";
  }
  if (p.includes('ideolog') || p.includes('atheist') || p.includes('feminist') || p.includes('leftist')) {
    return "Worldview: Atheist (empirical rationalism), Feminist (gender equality), Leftist (secular progressivism). Motto: 'Inspired by no one.'";
  }

  return `🤖 System Online. I am Aditya's live AI agent. Aditya is a 15-year-old IIT JEE 2028 aspirant @ Allen Patna with 95.4% in 10th (100% IT) and IOQM 2x / RMO 1x / NSEP 1x Olympiad credentials.`;
}
