import React from 'react';
import { Bot, Cpu } from 'lucide-react';

export default function AiThinkingDots({ 
  label = "NEMOTRON 5.0 IS PROCESSING", 
  subtext = "Synthesizing neural knowledge base...",
  size = "md" 
}) {
  const dotSizes = {
    sm: "w-1.5 h-1.5",
    md: "w-2.5 h-2.5",
    lg: "w-3.5 h-3.5"
  };

  const currentDotSize = dotSizes[size] || dotSizes.md;

  return (
    <div className="bg-[#050505] border-2 border-white/80 p-3 sm:p-4 my-2 relative overflow-hidden font-mono shadow-[4px_4px_0px_0px_var(--color-primary,#39FF14)] animate-pulse">
      {/* Corner Tech Brackets */}
      <span className="absolute top-1 left-1.5 text-[var(--color-primary,#39FF14)] text-[10px] font-bold">┌</span>
      <span className="absolute top-1 right-1.5 text-[#00E5FF] text-[10px] font-bold">┐</span>
      <span className="absolute bottom-1 left-1.5 text-[#FF007F] text-[10px] font-bold">└</span>
      <span className="absolute bottom-1 right-1.5 text-[#FFE600] text-[10px] font-bold">┘</span>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {/* Animated AI Bot Icon */}
          <div className="p-1.5 bg-black border border-[var(--color-primary,#39FF14)] shadow-[2px_2px_0px_0px_var(--color-primary,#39FF14)] shrink-0">
            <Bot className="w-4 h-4 text-[var(--color-primary,#39FF14)] animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2 text-xs font-black text-white uppercase tracking-wider">
              <span>{label}</span>
              <span className="text-[9px] bg-[var(--color-primary,#39FF14)] text-black px-1 font-bold">
                THINKING
              </span>
            </div>
            {subtext && (
              <p className="text-[10px] text-neutral-400 font-mono mt-0.5 flex items-center gap-1">
                <Cpu className="w-3 h-3 text-[#00E5FF]" /> {subtext}
              </p>
            )}
          </div>
        </div>

        {/* Animated 3 Dots Indicator (Gradients with Staggered Bounce) */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black border border-white/40 shadow-[inset_0px_0px_8px_rgba(57,255,20,0.2)] shrink-0">
          <div
            className={`${currentDotSize} rounded-full bg-[var(--color-primary,#39FF14)] shadow-[0_0_8px_#39FF14] dot-bounce-1`}
          />
          <div
            className={`${currentDotSize} rounded-full bg-[#00E5FF] shadow-[0_0_8px_#00E5FF] dot-bounce-2`}
          />
          <div
            className={`${currentDotSize} rounded-full bg-[#FFE600] shadow-[0_0_8px_#FFE600] dot-bounce-3`}
          />
        </div>
      </div>
    </div>
  );
}
