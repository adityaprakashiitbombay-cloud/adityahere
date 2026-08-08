import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import AiThinkingDots from '../AiThinkingDots';

export default function TerminalHistory({ history, terminalEndRef, isApiLoading }) {
  const [copiedIdx, setCopiedIdx] = useState(null);

  const handleCopy = (text, idx) => {
    navigator.clipboard?.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="bg-[#000000] border-2 border-white p-4 h-[320px] overflow-y-auto font-mono text-xs text-[#39FF14] space-y-3 shadow-[inset_0px_0px_10px_rgba(0,0,0,0.9)] scroll-smooth">
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

          {item.type === 'thinking' && (
            <AiThinkingDots 
              label="NEMOTRON 5.0 IS THINKING" 
              subtext={item.text || "Synthesizing response from neural knowledge base..."} 
            />
          )}

          {item.type === 'agent' && (
            <div className="text-[#39FF14] bg-[#020702] p-3.5 border-l-4 border-[#39FF14] border-t border-b border-r border-[#39FF14]/30 mt-2 font-mono relative shadow-[inset_0px_0px_15px_rgba(57,255,20,0.08)]">
              {/* High-Tech Agent Response Badge Header */}
              <div className="flex items-center justify-between text-[10px] text-[#39FF14] font-black uppercase pb-2 mb-2 border-b border-[#39FF14]/20 select-none">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#39FF14] animate-ping" />
                  <span className="tracking-wider">🤖 NEMOTRON 5.0 LOGICAL AGENT</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(item.text, idx)}
                  className="bg-black hover:bg-[#39FF14] hover:text-black border border-[#39FF14] text-[#39FF14] px-2 py-0.5 text-[9px] flex items-center gap-1 transition-colors cursor-pointer font-bold shadow-[2px_2px_0px_0px_#39FF14]"
                  title="Copy response text"
                >
                  {copiedIdx === idx ? <Check className="w-3 h-3 text-[#39FF14]" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedIdx === idx ? 'COPIED' : 'COPY'}</span>
                </button>
              </div>

              {/* Formatted Clean Response Body */}
              <div className="text-white text-xs leading-relaxed space-y-1 font-mono">
                {item.text.split('\n').map((line, lIdx) => {
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
            </div>
          )}

        </div>
      ))}

      {/* Fallback inline thinking status if isApiLoading is true and last item isn't thinking */}
      {isApiLoading && history[history.length - 1]?.type !== 'thinking' && (
        <AiThinkingDots 
          label="NEMOTRON 5.0 IS PROCESSING" 
          subtext="Executing command..." 
        />
      )}

      <div ref={terminalEndRef} />
    </div>
  );
}

