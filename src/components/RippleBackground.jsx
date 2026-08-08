import React, { useEffect, useRef } from 'react';

export default function RippleBackground({ isActive = true }) {
  const canvasRef = useRef(null);
  const ripplesRef = useRef([]);

  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const colors = [
      'rgba(0, 229, 255, ',   // Neon Cyan
      'rgba(57, 255, 20, ',   // Neon Green
      'rgba(157, 78, 221, ',  // Neon Purple
      'rgba(255, 0, 127, '    // Neon Pink
    ];

    const addRipple = (x, y, maxR = 160) => {
      const colorBase = colors[Math.floor(Math.random() * colors.length)];
      ripplesRef.current.push({
        x,
        y,
        radius: 4,
        maxRadius: maxR,
        speed: 2 + Math.random() * 1.5,
        alpha: 0.7,
        colorBase
      });
      // Cap max active ripples for performance
      if (ripplesRef.current.length > 25) {
        ripplesRef.current.shift();
      }
    };

    // Auto-spawn ambient ripples periodically
    const ambientInterval = setInterval(() => {
      if (Math.random() > 0.4) {
        const ax = Math.random() * canvas.width;
        const ay = Math.random() * canvas.height;
        addRipple(ax, ay, 120 + Math.random() * 80);
      }
    }, 1800);

    // Mouse pointer listener
    let lastMove = 0;
    const handlePointerMove = (e) => {
      const now = Date.now();
      if (now - lastMove > 120) { // Throttle move ripples
        lastMove = now;
        addRipple(e.clientX, e.clientY, 100);
      }
    };

    const handlePointerDown = (e) => {
      // Big click ripple
      addRipple(e.clientX, e.clientY, 220);
      addRipple(e.clientX, e.clientY, 140);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerdown', handlePointerDown);

    let animId;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = ripplesRef.current.length - 1; i >= 0; i--) {
        const r = ripplesRef.current[i];
        r.radius += r.speed;
        r.alpha *= 0.965; // Fade out

        if (r.alpha < 0.01 || r.radius >= r.maxRadius) {
          ripplesRef.current.splice(i, 1);
          continue;
        }

        // Draw primary glowing ring
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `${r.colorBase}${r.alpha})`;
        ctx.lineWidth = Math.max(0.5, (1 - r.radius / r.maxRadius) * 3.5);
        ctx.stroke();

        // Draw inner secondary wave ring
        if (r.radius > 20) {
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.radius * 0.65, 0, Math.PI * 2);
          ctx.strokeStyle = `${r.colorBase}${r.alpha * 0.5})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(ambientInterval);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Background Ambient Glowing Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/15 blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-500/15 blur-[140px] animate-pulse" style={{ animationDuration: '6s' }} />
      <div className="absolute top-[40%] left-[30%] w-[450px] h-[450px] rounded-full bg-purple-600/10 blur-[130px]" />

      {/* Dynamic Ripple Canvas */}
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
