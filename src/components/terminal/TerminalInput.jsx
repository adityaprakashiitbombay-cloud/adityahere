import React, { useState, useRef } from 'react';
import { Send, CornerDownLeft, Terminal as TerminalIcon } from 'lucide-react';

export default function TerminalInput({
  input,
  setInput,
  onSubmit,
  isAdminUnlocked,
  isApiLoading
}) {
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [commandHistory, setCommandHistory] = useState([]);
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e?.preventDefault();
    const cleanInput = input.trim();
    if (!cleanInput) return;

    setCommandHistory((prev) => [cleanInput, ...prev]);
    setHistoryIndex(-1);
    onSubmit(cleanInput);

    // On mobile devices, keep focus or allow smooth continuation without jarring blur
    if (window.innerWidth > 768) {
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
        const nextIdx = historyIndex + 1;
        setHistoryIndex(nextIdx);
        setInput(commandHistory[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      if (historyIndex > 0) {
        const prevIdx = historyIndex - 1;
        setHistoryIndex(prevIdx);
        setInput(commandHistory[prevIdx]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="mt-4 flex flex-wrap sm:flex-nowrap items-stretch gap-2 font-mono"
    >
      {/* Clean Modern Prompt Tag (No admin@matrix) */}
      <div 
        onClick={() => inputRef.current?.focus()}
        className="bg-[#000000] border-2 border-white px-2.5 sm:px-3 py-2 text-xs font-bold text-[#39FF14] flex items-center gap-1.5 shrink-0 select-none cursor-pointer shadow-[2px_2px_0px_0px_#39FF14]"
      >
        <TerminalIcon className="w-3.5 h-3.5 text-[#39FF14] animate-pulse hidden sm:inline-block" />
        <span className="tracking-tight">
          aditya<span className="text-white">:</span><span className="text-[#00E5FF]">~</span><span className="text-white">$</span><span className="ml-1.5 inline-block w-2 h-3.5 bg-[#39FF14] animate-cursor-blink align-middle translate-y-[-1px]"></span>
        </span>
      </div>

      {/* Android & Touch-Optimized Input Field */}
      <div className="relative flex-1 min-w-[180px]">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={(e) => {
            setTimeout(() => {
              e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
          }}
          placeholder={
            isApiLoading 
              ? "AI Model is executing query..." 
              : "Ask anything (Marks, IIT JEE, Olympiads, Physics)..."
          }
          disabled={isApiLoading}
          // Mobile & Android-specific enhancements
          inputMode="text"
          enterKeyHint="send"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck="false"
          // text-[16px] prevents Android Chrome and iOS Safari from auto-zooming on input focus
          className="w-full bg-[#000000] border-2 border-white px-3 py-2.5 sm:py-2 text-[16px] sm:text-xs text-white placeholder-neutral-500 focus:border-[#39FF14] focus:shadow-[0px_0px_10px_rgba(57,255,20,0.3)] outline-none font-mono transition-all disabled:opacity-50 min-h-[48px] sm:min-h-[38px] rounded-none"
        />
        
        {/* Subtle Enter Hint on Desktop */}
        <div className="hidden md:flex absolute right-2.5 top-1/2 -translate-y-1/2 items-center gap-1 text-[10px] text-neutral-500 pointer-events-none">
          <CornerDownLeft className="w-3 h-3 text-[#39FF14]" />
        </div>
      </div>

      {/* Mobile-Friendly Command History Navigation Buttons */}
      {commandHistory.length > 0 && (
        <div className="flex sm:hidden items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => {
              if (historyIndex < commandHistory.length - 1) {
                const nextIdx = historyIndex + 1;
                setHistoryIndex(nextIdx);
                setInput(commandHistory[nextIdx]);
              }
            }}
            className="bg-[#111111] text-[#39FF14] border border-[#39FF14] px-2 py-2 text-[10px] font-bold min-h-[48px] min-w-[40px] flex items-center justify-center active:scale-95"
            title="Previous Command"
          >
            ▲
          </button>
          <button
            type="button"
            onClick={() => {
              if (historyIndex > 0) {
                const prevIdx = historyIndex - 1;
                setHistoryIndex(prevIdx);
                setInput(commandHistory[prevIdx]);
              } else if (historyIndex === 0) {
                setHistoryIndex(-1);
                setInput('');
              }
            }}
            className="bg-[#111111] text-[#39FF14] border border-[#39FF14] px-2 py-2 text-[10px] font-bold min-h-[48px] min-w-[40px] flex items-center justify-center active:scale-95"
            title="Next Command"
          >
            ▼
          </button>
        </div>
      )}

      {/* Touch-Friendly Submit Button */}
      <button
        type="submit"
        disabled={isApiLoading || !input.trim()}
        className="w-full sm:w-auto bg-[#39FF14] hover:bg-[#4dff2b] text-black font-black px-4 py-2.5 sm:py-2 text-xs flex items-center justify-center gap-1.5 uppercase transition-all shrink-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed border-2 border-white shadow-[3px_3px_0px_0px_#ffffff] active:translate-x-0.5 active:translate-y-0.5 min-h-[44px] sm:min-h-[38px]"
      >
        <span>EXECUTE</span>
        <Send className="w-3.5 h-3.5" />
      </button>
    </form>
  );
}
