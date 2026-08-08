import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Terminal, Home, Calendar, Shield, MessageSquare, Sparkles, Volume2, VolumeX, Lock, ArrowRight, X } from 'lucide-react';
import { modalVariants } from '../animations/variants';
import { fireMatrixConfetti } from '../utils/confettiEffects';

export default function CommandPalette({ soundEnabled, setSoundEnabled, playUiClick }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Cmd+K or Ctrl+K or Cmd+P
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K' || e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        if (playUiClick) playUiClick();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playUiClick]);

  const closePalette = () => {
    if (playUiClick) playUiClick();
    setIsOpen(false);
    setQuery('');
  };

  const handleAction = (actionFn) => {
    if (playUiClick) playUiClick();
    actionFn();
    closePalette();
  };

  const COMMANDS = [
    {
      id: 'nav-home',
      group: 'Navigation',
      title: 'Go to Home / Bio',
      shortcut: '⌘H',
      icon: <Home className="w-4 h-4 text-[#39FF14]" />,
      action: () => navigate('/')
    },
    {
      id: 'nav-timeline',
      group: 'Navigation',
      title: 'Go to Educational Timeline (2011–2028)',
      shortcut: '⌘T',
      icon: <Calendar className="w-4 h-4 text-[#00E5FF]" />,
      action: () => navigate('/timeline')
    },
    {
      id: 'nav-expertise',
      group: 'Navigation',
      title: 'Go to Passions, Domains & Values',
      shortcut: '⌘E',
      icon: <Shield className="w-4 h-4 text-[#FFE600]" />,
      action: () => navigate('/expertise')
    },
    {
      id: 'nav-terminal',
      group: 'Navigation',
      title: 'Go to Logical AI Terminal CLI',
      shortcut: '⌘L',
      icon: <Terminal className="w-4 h-4 text-[#39FF14]" />,
      action: () => navigate('/terminal')
    },
    {
      id: 'nav-feedback',
      group: 'Navigation',
      title: 'Go to Community Feedback Board',
      shortcut: '⌘F',
      icon: <MessageSquare className="w-4 h-4 text-[#FF007F]" />,
      action: () => navigate('/feedback')
    },
    {
      id: 'act-confetti',
      group: 'Actions',
      title: 'Trigger Matrix Victory Fireworks',
      shortcut: '🎉',
      icon: <Sparkles className="w-4 h-4 text-[#FFE600]" />,
      action: () => fireMatrixConfetti()
    },
    {
      id: 'act-sound',
      group: 'Actions',
      title: soundEnabled ? 'Mute Sound Effects' : 'Unmute Sound Effects',
      shortcut: '🔊',
      icon: soundEnabled ? <VolumeX className="w-4 h-4 text-neutral-400" /> : <Volume2 className="w-4 h-4 text-[#39FF14]" />,
      action: () => setSoundEnabled((prev) => !prev)
    },
    {
      id: 'act-admin',
      group: 'Actions',
      title: 'Enter Admin Override (ALPHA1845 in Terminal)',
      shortcut: '🔒',
      icon: <Lock className="w-4 h-4 text-[#00E5FF]" />,
      action: () => navigate('/terminal?q=ALPHA1845')
    }
  ];

  const filteredCommands = COMMANDS.filter((cmd) =>
    cmd.title.toLowerCase().includes(query.toLowerCase()) ||
    cmd.group.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      {/* Mobile / Screen Command Trigger Button */}
      <button
        type="button"
        onClick={() => {
          if (playUiClick) playUiClick();
          setIsOpen(true);
        }}
        className="hidden sm:flex items-center gap-1.5 bg-black border border-white px-2 py-1 text-[11px] font-mono font-bold text-neutral-300 hover:text-white hover:border-[#39FF14] transition-all shadow-[2px_2px_0px_0px_#ffffff] cursor-pointer"
        title="Open Command Palette (Ctrl+K)"
      >
        <Search className="w-3 h-3 text-[#39FF14]" />
        <span>COMMANDS</span>
        <kbd className="bg-[#111] px-1 text-[9px] border border-neutral-700 text-neutral-400">Ctrl+K</kbd>
      </button>

      {/* Command Palette Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/85 backdrop-blur-sm font-mono">
            <motion.div
              variants={modalVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full max-w-xl bg-[#050505] border-3 border-white shadow-[10px_10px_0px_0px_#39FF14] relative overflow-hidden"
            >
              {/* Corner Neon Brackets */}
              <span className="absolute top-2 left-2 text-[#39FF14] text-xs font-bold select-none">┌</span>
              <span className="absolute top-2 right-2 text-[#00E5FF] text-xs font-bold select-none">┐</span>
              <span className="absolute bottom-2 left-2 text-[#FF007F] text-xs font-bold select-none">└</span>
              <span className="absolute bottom-2 right-2 text-[#FFE600] text-xs font-bold select-none">┘</span>

              {/* Input Header */}
              <div className="flex items-center gap-3 p-4 border-b-2 border-white bg-black">
                <Search className="w-5 h-5 text-[#39FF14] shrink-0 animate-pulse" />
                <input
                  type="text"
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Type a command or jump to page (Home, Timeline, Terminal, Admin)..."
                  className="w-full bg-transparent text-sm text-white placeholder-neutral-500 outline-none font-mono font-bold"
                />
                <button
                  onClick={closePalette}
                  className="text-neutral-400 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Command List Stream */}
              <div className="max-h-80 overflow-y-auto p-3 space-y-1.5">
                {filteredCommands.length === 0 ? (
                  <div className="text-center py-8 text-xs text-neutral-500 font-mono">
                    No matching commands found for "{query}".
                  </div>
                ) : (
                  filteredCommands.map((cmd) => (
                    <button
                      key={cmd.id}
                      type="button"
                      onClick={() => handleAction(cmd.action)}
                      className="w-full text-left bg-black hover:bg-[#111] border border-neutral-800 hover:border-[#39FF14] p-3 text-xs text-white transition-all flex items-center justify-between group cursor-pointer shadow-[2px_2px_0px_0px_#111] hover:shadow-[3px_3px_0px_0px_#39FF14]"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 bg-[#050505] border border-neutral-700 group-hover:border-white">
                          {cmd.icon}
                        </div>
                        <div>
                          <div className="font-bold text-white group-hover:text-[#39FF14] transition-colors">
                            {cmd.title}
                          </div>
                          <span className="text-[10px] text-neutral-500 uppercase">
                            {cmd.group}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-neutral-900 border border-neutral-700 px-1.5 py-0.5 text-neutral-300">
                          {cmd.shortcut}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-neutral-600 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </button>
                  ))
                )}
              </div>

              {/* Palette Footer Help */}
              <div className="border-t-2 border-neutral-800 p-2.5 bg-black text-[10px] text-neutral-400 flex items-center justify-between">
                <span>Use <kbd className="text-white font-bold">Esc</kbd> to close</span>
                <span className="text-[#39FF14]">⌘K POWER USER PALETTE</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
