import React, { useState, useEffect } from 'react';

export default function TerminalTextEffect({ text, speed = 25, delay = 0, className = "" }) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);

    const startTimeout = setTimeout(() => {
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          setIsTyping(false);
          clearInterval(interval);
        }
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [text, speed, delay]);

  return (
    <span className={className}>
      {displayedText}
      <span className={`inline-block w-2 h-4 bg-[#39FF14] ml-1 align-middle ${isTyping ? 'animate-pulse' : 'animate-blink'}`} />
    </span>
  );
}
