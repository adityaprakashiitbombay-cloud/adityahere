import React, { useEffect, useRef } from 'react';

export default function MatrixRainBackground({ isActive }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Make canvas full screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Matrix characters - binary, letters, and physics symbols
    const chars = '0101010101010101ABCDEFGHIJKLMNOPQRSTUVWXYZ⚛️λπθΣΩ∞√';
    const charArr = chars.split('');

    const fontSize = 14;
    let columns = Math.floor(canvas.width / fontSize);
    let drops = Array(columns).fill(1);

    // Track active colors (alternate or blend MyProfile colors: green & orange)
    let frame = 0;

    const draw = () => {
      frame++;
      // Semi-transparent black background to create tail effect
      ctx.fillStyle = 'rgba(5, 5, 5, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fontSize = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = charArr[Math.floor(Math.random() * charArr.length)];
        
        // Alternate column colors between neon green (#39FF14) and neon orange (#FF5500)
        // or keep them mostly subtle green with orange heads
        const isOrangeColumn = (i % 6 === 0);
        
        if (isOrangeColumn) {
          ctx.fillStyle = 'rgba(255, 85, 0, 0.15)'; // dim orange for trailing
        } else {
          ctx.fillStyle = 'rgba(57, 255, 20, 0.12)'; // dim green for trailing
        }

        // Highlight the lead character in each column in solid white/light color
        if (Math.random() > 0.98) {
          ctx.fillStyle = isOrangeColumn ? '#FF8844' : '#AAFFAA';
        }

        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillText(text, x, y);

        // Reset drop back to top after it hits the bottom
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        // Move drop downwards
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33); // approx 30 fps

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isActive]);

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none opacity-25 z-0"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
