import React from 'react';

const CHIPS = ['marks', 'jee', 'ioqm', 'mentors', 'friends', 'worldview'];

export default function QuickCommandChips({ onSelectCommand }) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-3">
      <span className="text-[11px] text-neutral-400 font-mono font-bold">QUICK CMDS:</span>
      {CHIPS.map((cmd) => (
        <button
          key={cmd}
          type="button"
          onClick={() => onSelectCommand(cmd)}
          className="px-2.5 py-1 text-xs font-mono font-bold border border-white bg-[#000000] text-white hover:bg-[#39FF14] hover:text-black transition-all cursor-pointer shadow-[2px_2px_0px_0px_#222] hover:shadow-[3px_3px_0px_0px_#ffffff]"
        >
          &gt; {cmd}
        </button>
      ))}
    </div>
  );
}
