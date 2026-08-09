import React from 'react';

const CHIPS = ['marks', 'jee', 'ioqm', 'mentors', 'friends', 'worldview'];

export default function QuickCommandChips({ onSelectCommand }) {
  return (
    <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-1.5 pt-0.5 scrollbar-none touch-pan-x w-full">
      <span className="text-[11px] text-neutral-400 font-mono font-bold shrink-0">QUICK CMDS:</span>
      {CHIPS.map((cmd) => (
        <button
          key={cmd}
          type="button"
          onClick={() => onSelectCommand(cmd)}
          className="px-3 py-1.5 text-xs font-mono font-bold border border-white bg-[#000000] text-white hover:bg-[#39FF14] hover:text-black transition-all cursor-pointer shadow-[2px_2px_0px_0px_#222] hover:shadow-[3px_3px_0px_0px_#ffffff] shrink-0 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none min-h-[44px] sm:min-h-[34px] flex items-center justify-center select-none"
        >
          &gt; {cmd}
        </button>
      ))}
    </div>
  );
}
