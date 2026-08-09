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
    <div className="relative border-2 border-white bg-[#000000]">
      {/* CRT Scanline Overlay */}
      <div className="absolute inset-0 cyber-scanlines pointer-events-none mix-blend-overlay opacity-40 z-10"></div>
      
      <div className="p-3.5 sm:p-4 h-[340px] md:h-[420px] max-h-[55vh] overflow-y-auto font-mono text-xs text-[#39FF14] space-y-3 shadow-[inset_0px_0px_10px_rgba(0,0,0,0.9)] scroll-smooth overscroll-contain relative z-0">
      {history.map((item, idx) => (
        <div key={idx} className="leading-relaxed whitespace-pre-wrap relative group">
          {item.type === 'user' && (
            <div className="text-white font-bold flex items-start gap-2 font-mono break-all">
              <span className="text-[#39FF14]">&gt;</span>
              <span className="break-words">{item.text}</span>
            </div>
          )}

          {item.type === 'system' && (
            <div className="text-neutral-400 italic border-b border-neutral-800 pb-1 font-mono break-words">
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
            <div className="text-[#39FF14] bg-[#020702] p-3 sm:p-3.5 border-l-4 border-[#39FF14] border-t border-b border-r border-[#39FF14]/30 mt-2 font-mono relative shadow-[inset_0px_0px_15px_rgba(57,255,20,0.08)]">
              {/* High-Tech Agent Response Badge Header */}
              <div className="flex items-center justify-between text-[10px] text-[#39FF14] font-black uppercase pb-2 mb-2 border-b border-[#39FF14]/20 select-none">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#39FF14] animate-ping" />
                  <span className="tracking-wider">🤖 NEMOTRON 5.0 LOGICAL AGENT</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(item.text, idx)}
                  className="bg-black hover:bg-[#39FF14] hover:text-black border border-[#39FF14] text-[#39FF14] px-2.5 py-1 text-[10px] flex items-center gap-1 transition-colors cursor-pointer font-bold shadow-[2px_2px_0px_0px_#39FF14] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none min-h-[34px]"
                  title="Copy response text"
                >
                  {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-[#39FF14]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedIdx === idx ? 'COPIED' : 'COPY'}</span>
                </button>
              </div>

              {/* Formatted Clean Response Body */}
              <div className="text-white text-xs leading-relaxed space-y-1 font-mono overflow-x-auto max-w-full">
                {item.text.split('\n').map((line, lIdx) => {
                  const trimmed = line.trim();
                  if (!trimmed) return <div key={lIdx} className="h-1" />;
                  
                  const isHeader = trimmed.startsWith('🌐') || trimmed.startsWith('====') || trimmed.startsWith('----');
                  const isDevHeader = trimmed.startsWith('DEVICE ') || trimmed.startsWith('1.') || trimmed.startsWith('2.');
                  const isBullet = (trimmed.startsWith('•') || trimmed.startsWith('- ')) && !isDevHeader;
                  const isFormula = !isHeader && (trimmed.includes('∛') || trimmed.includes('√') || trimmed.includes('xₙ') || trimmed.includes('³') || trimmed.includes('²'));

                  return (
                    <div 
                      key={lIdx} 
                      className={`${
                        isHeader
                          ? 'text-[#00E5FF] font-bold text-xs border-b border-[#00E5FF]/30 pb-0.5 my-1'
                          : isDevHeader
                            ? 'text-[#39FF14] bg-[#091a09] px-2 py-1 border-l-4 border-[#39FF14] font-bold my-1 font-mono text-[11px]'
                            : isBullet 
                              ? 'text-[#00E5FF] pl-2 border-l-2 border-[#00E5FF] my-0.5 font-semibold text-[11px]' 
                              : isFormula 
                                ? 'text-[#FFE600] bg-black/60 px-2 py-1 border border-[#FFE600]/40 font-mono my-1 font-bold' 
                                : 'text-neutral-200 text-[11px] break-words'
                      }`}
                    >
                      {line}
                    </div>
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
    </div>
  );
}

