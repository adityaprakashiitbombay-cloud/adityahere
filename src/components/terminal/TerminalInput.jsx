import React, { useState } from 'react';
import { Send, CornerDownLeft } from 'lucide-react';

export default function TerminalInput({
  input,
  setInput,
  onSubmit,
  isAdminUnlocked,
  isApiLoading
}) {
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [commandHistory, setCommandHistory] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setCommandHistory((prev) => [input, ...prev]);
    setHistoryIndex(-1);
    onSubmit(input);
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
    <form onSubmit={handleSubmit} className="mt-4 flex items-center gap-2 font-mono">
      <div className="bg-[#000000] border-2 border-white px-3 py-2 text-xs font-bold text-[#39FF14] flex items-center gap-1 shrink-0">
        <span>{isAdminUnlocked ? 'admin@matrix:~$' : 'visitor@aditya:~$'}</span>
      </div>

      <div className="relative flex-1">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isApiLoading ? "AI Model is thinking..." : "Type any question (Marks, JEE, Olympiads, Physics, AI) or command..."}
          disabled={isApiLoading}
          className="w-full bg-[#000000] border-2 border-white px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-[#39FF14] focus:shadow-[4px_4px_0px_0px_#39FF14] outline-none font-mono transition-all disabled:opacity-50"
        />
      </div>

      <button
        type="submit"
        disabled={isApiLoading}
        className="brutal-btn px-4 py-2 text-xs flex items-center gap-1.5 font-bold uppercase transition-all shrink-0 cursor-pointer disabled:opacity-50"
      >
        <span>EXECUTE</span>
        <Send className="w-3.5 h-3.5" />
      </button>
    </form>
  );
}
