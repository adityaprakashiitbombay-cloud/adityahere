import React from 'react';
import { Terminal as TerminalIcon, Cpu, Trash2 } from 'lucide-react';

export default function TerminalHeader({
  isAdminUnlocked,
  isApiConnected,
  onClear,
  playClickSound
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b-2 border-neutral-800">
      <div className="flex items-center gap-3">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 bg-[#39FF14] border border-white" />
          <span className="w-3 h-3 bg-[#00E5FF] border border-white" />
          <span className="w-3 h-3 bg-[#FF007F] border border-white" />
        </div>

        <span className="text-xs font-black font-mono text-white flex items-center gap-2">
          <TerminalIcon className="w-4 h-4 text-[#39FF14]" /> LOGICAL AI AGENT // NEMOTRON 3 ENGINE
        </span>
      </div>

      {/* Status Badges */}
      <div className="flex items-center gap-2">
        <span className="bg-[#39FF14] text-black font-mono font-bold text-[10px] px-2.5 py-0.5 border border-white flex items-center gap-1">
          <Cpu className="w-3.5 h-3.5 text-black" /> {isApiConnected ? 'NVIDIA NEMOTRON 3 ONLINE' : 'API: [ENCRYPTED & SECURE]'}
        </span>

        <span className="bg-[#181818] text-neutral-300 font-mono text-[10px] px-2.5 py-0.5 border border-neutral-700 font-bold uppercase">
          {isAdminUnlocked ? 'ADMIN OVERRIDE ACTIVE' : 'GUEST ACCESS // SYSTEM SECURE'}
        </span>

        <button
          onClick={() => {
            if (playClickSound) playClickSound();
            onClear();
          }}
          className="text-xs font-mono text-neutral-400 hover:text-white flex items-center gap-1 ml-1 cursor-pointer"
          title="Clear Console"
        >
          <Trash2 className="w-3.5 h-3.5" /> CLEAR
        </button>
      </div>
    </div>
  );
}
