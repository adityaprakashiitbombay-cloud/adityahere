import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

/**
 * Unified Background System: Single-Canvas, Hardware-Accelerated 60FPS
 * Automatically pauses when document is hidden / off-screen.
 */
export default function UnifiedBackgroundSystem({ quality = 'high', opacity = 0.20 }) {
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

    // Safe resize handler
    let columns = 40;
    let drops = [];

    const handleResize = () => {
      try {
        const w = Math.max(320, window.innerWidth || 1024);
        const h = Math.max(480, window.innerHeight || 768);
        canvas.width = w;
        canvas.height = h;

        const fontSize = 14;
        columns = Math.max(1, Math.floor(w / fontSize));
        drops = new Array(columns).fill(1);
      } catch (e) {}
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const chars = '0123456789ABCDEF⚛️📐IOQMRMONSEP PathFinder Irodov E=mc² ∫dx √x π';
    const fontSize = 14;

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

      try {
        // Fade canvas
        ctx.fillStyle = 'rgba(0, 0, 0, 0.07)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Character Fill with dynamic theme primary color
        const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim() || '#39FF14';
        ctx.fillStyle = primaryColor;
        ctx.font = `bold ${fontSize}px monospace`;

        for (let i = 0; i < drops.length; i++) {
          const text = chars[Math.floor(Math.random() * chars.length)];
          ctx.fillText(text, i * fontSize, drops[i] * fontSize);

          if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        }
      } catch (e) {}
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [reduceMotion, quality]);

  if (reduceMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{ opacity }}
      className="fixed inset-0 pointer-events-none z-0 select-none w-full h-full"
    />
  );
}
