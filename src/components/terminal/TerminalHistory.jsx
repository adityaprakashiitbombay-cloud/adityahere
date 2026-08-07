import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function TerminalHistory({ history, terminalEndRef }) {
  const [copiedIdx, setCopiedIdx] = useState(null);

  const handleCopy = (text, idx) => {
    navigator.clipboard?.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="bg-[#000000] border-2 border-white p-4 h-[280px] overflow-y-auto font-mono text-xs text-[#39FF14] space-y-3 shadow-[inset_0px_0px_10px_rgba(0,0,0,0.9)]">
      {history.map((item, idx) => (
        <div key={idx} className="leading-relaxed whitespace-pre-wrap relative group">
          {item.type === 'user' && (
            <div className="text-white font-bold flex items-start gap-2 font-mono">
              <span className="text-[#39FF14]">&gt;</span>
              <span>{item.text}</span>
            </div>
          )}

          {item.type === 'system' && (
            <div className="text-neutral-400 italic border-b border-neutral-800 pb-1 font-mono">
              {item.text}
            </div>
          )}

          {item.type === 'agent' && (
            <div className="text-[#39FF14] bg-[#000000] p-3 border-l-3 border-[#39FF14] mt-1 font-mono border-t border-b border-r border-neutral-800 relative">
              <div>{item.text}</div>
              <button
                type="button"
                onClick={() => handleCopy(item.text, idx)}
                className="opacity-0 group-hover:opacity-100 absolute top-2 right-2 bg-neutral-900 border border-neutral-700 text-neutral-300 hover:text-white p-1 text-[10px] flex items-center gap-1 transition-opacity cursor-pointer"
                title="Copy response"
              >
                {copiedIdx === idx ? <Check className="w-3 h-3 text-[#39FF14]" /> : <Copy className="w-3 h-3" />}
                <span>{copiedIdx === idx ? 'COPIED' : 'COPY'}</span>
              </button>
            </div>
          )}
        </div>
      ))}
      <div ref={terminalEndRef} />
    </div>
  );
}
