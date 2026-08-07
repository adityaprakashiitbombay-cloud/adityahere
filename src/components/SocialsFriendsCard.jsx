import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Users, ExternalLink, Copy, Check, Heart } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';
import TerminalTextEffect from './TerminalTextEffect';

export default function SocialsFriendsCard({ playClickSound }) {
  const [copiedHandle, setCopiedHandle] = useState(null);
  const [activeTab, setActiveTab] = useState('socials');

  const copyToClipboard = (text, name) => {
    if (playClickSound) playClickSound();
    navigator.clipboard.writeText(text);
    setCopiedHandle(name);
    setTimeout(() => setCopiedHandle(null), 2000);
  };

  return (
    <motion.div
      whileHover={{ x: -4, y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="brutal-card p-6 flex flex-col justify-between relative overflow-hidden bg-[#000000] border-3 border-white shadow-[6px_6px_0px_0px_#39FF14]"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none font-mono text-8xl font-black text-[#FF007F]">
        04
      </div>

      <div>
        {/* Header with Switcher */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex border-2 border-white bg-[#000000]">
            <button
              onClick={() => { setActiveTab('socials'); if (playClickSound) playClickSound(); }}
              className={`px-2.5 py-1 text-xs font-bold font-mono transition-colors ${
                activeTab === 'socials' ? 'bg-[#FF007F] text-white' : 'text-neutral-300 hover:bg-neutral-800'
              }`}
            >
              Handles
            </button>
            <button
              onClick={() => { setActiveTab('friends'); if (playClickSound) playClickSound(); }}
              className={`px-2.5 py-1 text-xs font-bold font-mono transition-colors border-l-2 border-white ${
                activeTab === 'friends' ? 'bg-[#FF007F] text-white' : 'text-neutral-300 hover:bg-neutral-800'
              }`}
            >
              Close Friends
            </button>
          </div>
          {activeTab === 'socials' ? <Share2 className="w-5 h-5 text-[#FF007F]" /> : <Users className="w-5 h-5 text-[#FF007F]" />}
        </div>

        {activeTab === 'socials' ? (
          <div>
            <h3 className="text-xl font-black text-white mb-1 tracking-tight font-mono">
              <TerminalTextEffect text="Social Handles" speed={30} />
            </h3>
            <p className="text-xs text-neutral-400 font-mono mb-4">
              Click handle to copy or connect:
            </p>

            {/* Social Links List */}
            <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
              {portfolioData.socials.map((s, idx) => (
                <div
                  key={idx}
                  onClick={() => copyToClipboard(s.handle, s.name)}
                  className="bg-[#000000] border-2 border-white p-2.5 flex items-center justify-between cursor-pointer hover:bg-[#181818] shadow-[2px_2px_0px_0px_#ffffff] hover:shadow-[3px_3px_0px_0px_#FF007F] transition-all group font-mono"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-7 h-7 border border-white flex items-center justify-center text-xs font-bold"
                      style={{ backgroundColor: s.color + '22', color: s.color }}
                    >
                      {s.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-[#39FF14] transition-colors">
                        {s.name}
                      </div>
                      <div className="text-[11px] text-neutral-400 font-mono">
                        {s.handle}
                      </div>
                    </div>
                  </div>

                  <button
                    className="p-1 text-neutral-400 hover:text-white font-mono"
                    title="Copy Handle"
                  >
                    {copiedHandle === s.name ? (
                      <span className="text-[10px] text-[#39FF14] font-bold flex items-center gap-0.5 font-mono">
                        <Check className="w-3.5 h-3.5" /> COPIED
                      </span>
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Close Friends List */
          <div>
            <h3 className="text-xl font-black text-white mb-1 tracking-tight flex items-center gap-2 font-mono">
              <TerminalTextEffect text="Close Friends" speed={30} />
              <Heart className="w-4 h-4 text-[#FF007F] fill-[#FF007F]" />
            </h3>
            <p className="text-xs text-neutral-400 font-mono mb-4">
              Core inner circle & school colleagues:
            </p>

            <div className="grid grid-cols-1 gap-2.5">
              {portfolioData.closeFriends.map((friend, idx) => (
                <div
                  key={idx}
                  className="bg-[#000000] border-2 border-white p-3 shadow-[3px_3px_0px_0px_#FF007F]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-[#39FF14] font-mono">
                      {friend.name}
                    </span>
                    <span className="text-[10px] bg-[#FF007F] text-white px-2 py-0.5 font-bold uppercase font-mono">
                      {friend.tag}
                    </span>
                  </div>
                  <div className="text-xs text-neutral-400 font-mono mt-1">
                    🏫 {friend.school}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-neutral-800 text-[10px] text-neutral-500 font-mono flex items-center justify-between">
        <span>7 Channels / 4 Friends</span>
        <span className="text-[#FF007F]">CONNECT</span>
      </div>
    </motion.div>
  );
}
