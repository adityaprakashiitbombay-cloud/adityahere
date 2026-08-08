import React, { useState, useEffect } from 'react';

export default function LiveAge({ className = '' }) {
  const [liveAge, setLiveAge] = useState('15.0000000');

  useEffect(() => {
    const calculateExactAge = () => {
      const birthDate = new Date('2011-05-11T00:00:00');
      const now = new Date();
      const diffMs = now.getTime() - birthDate.getTime();
      const years = diffMs / (1000 * 60 * 60 * 24 * 365.25);
      setLiveAge(years.toFixed(7));
    };

    calculateExactAge();
    const interval = setInterval(calculateExactAge, 60);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`inline-flex items-center gap-1.5 bg-[#080808] border border-white/70 px-2.5 py-1 font-mono text-[11px] whitespace-nowrap select-none shadow-[2px_2px_0px_0px_#00E5FF] shrink-0 ${className}`}
    >
      <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse shrink-0" />
      <span className="text-neutral-400">AGE:</span>
      <span className="text-[#39FF14] font-black tracking-wide tabular-nums">{liveAge}</span>
      <span className="text-neutral-500 text-[10px]">YRS</span>
    </div>
  );
}
