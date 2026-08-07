import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

/**
 * Unified Background System: Single-Canvas, Hardware-Accelerated 60FPS
 * Automatically pauses when document is hidden / off-screen.
 */
export default function UnifiedBackgroundSystem({ quality = 'high', opacity = 0.12 }) {
  const canvasRef = useRef(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let lastTime = 0;
    const targetFps = quality === 'low' ? 30 : 60;
    const frameInterval = 1000 / targetFps;

    // Resize handler
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Matrix characters
    const chars = '0123456789ABCDEF⚛️📐IOQMRMONSEP';
    const fontSize = 14;
    const columns = Math.floor(window.innerWidth / fontSize);
    const drops = new Array(columns).fill(1);

    // Visibility Observer to pause when tab/window is hidden
    let isVisible = true;
    const handleVisibilityChange = () => {
      isVisible = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const render = (currentTime) => {
      animationFrameId = requestAnimationFrame(render);

      if (!isVisible) return;

      const elapsed = currentTime - lastTime;
      if (elapsed < frameInterval) return;
      lastTime = currentTime - (elapsed % frameInterval);

      // Fade canvas
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#39FF14';
      ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [reduceMotion, quality]);

  if (reduceMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ opacity }}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
}
