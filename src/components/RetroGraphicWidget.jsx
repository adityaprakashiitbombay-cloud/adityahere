import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Magnet, Sparkles, RefreshCw, Zap, ShieldAlert, Cpu } from 'lucide-react';

export default function RetroGraphicWidget() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [mode, setMode] = useState('repulse'); // 'repulse' | 'attract' | 'vortex'
  const [particleCount, setParticleCount] = useState(48);

  const mousePos = useRef({ x: -1000, y: -1000, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;

    // Grid Node Initialization
    const rows = 6;
    const cols = 8;
    const nodes = [];

    const width = canvas.width;
    const height = canvas.height;
    const paddingX = 25;
    const paddingY = 25;
    const stepX = (width - paddingX * 2) / (cols - 1);
    const stepY = (height - paddingY * 2) / (rows - 1);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const baseX = paddingX + c * stepX;
        const baseY = paddingY + r * stepY;
        nodes.push({
          baseX,
          baseY,
          x: baseX,
          y: baseY,
          vx: 0,
          vy: 0,
          row: r,
          col: c
        });
      }
    }

    // Mouse Tracking Event Handlers
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mousePos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true
      };
    };

    const handleMouseLeave = () => {
      mousePos.current = { x: -1000, y: -1000, active: false };
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // 60FPS Physics Render Loop
    let angle = 0;
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      angle += 0.02;

      const mx = mousePos.current.x;
      const my = mousePos.current.y;
      const radius = 90; // Interaction radius

      // Update Node Physics (Physics Spring & Antigravity Distortion)
      nodes.forEach((node) => {
        const dx = mx - node.baseX;
        const dy = my - node.baseY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let targetX = node.baseX;
        let targetY = node.baseY;

        if (dist < radius && mousePos.current.active) {
          const force = (radius - dist) / radius;
          const angleToMouse = Math.atan2(dy, dx);

          if (mode === 'repulse') {
            targetX = node.baseX - Math.cos(angleToMouse) * force * 45;
            targetY = node.baseY - Math.sin(angleToMouse) * force * 45;
          } else if (mode === 'attract') {
            targetX = node.baseX + Math.cos(angleToMouse) * force * 35;
            targetY = node.baseY + Math.sin(angleToMouse) * force * 35;
          } else if (mode === 'vortex') {
            const perpAngle = angleToMouse + Math.PI / 2;
            targetX = node.baseX + Math.cos(perpAngle) * force * 35;
            targetY = node.baseY + Math.sin(perpAngle) * force * 35;
          }
        } else {
          // Add subtle ambient wave motion
          targetX += Math.sin(angle + node.row) * 2;
          targetY += Math.cos(angle + node.col) * 2;
        }

        // Spring Force Physics
        const ax = (targetX - node.x) * 0.15;
        const ay = (targetY - node.y) * 0.15;
        node.vx = (node.vx + ax) * 0.75;
        node.vy = (node.vy + ay) * 0.75;
        node.x += node.vx;
        node.y += node.vy;
      });

      // Draw Dynamic Force-Field Grid Lines (Electric Green Distortion)
      ctx.lineWidth = 1.5;

      // Draw Horizontal Grid Lines
      for (let r = 0; r < rows; r++) {
        ctx.beginPath();
        for (let c = 0; c < cols; c++) {
          const idx = r * cols + c;
          const n = nodes[idx];
          if (c === 0) ctx.moveTo(n.x, n.y);
          else ctx.lineTo(n.x, n.y);
        }
        ctx.strokeStyle = '#39FF14';
        ctx.globalAlpha = 0.35;
        ctx.stroke();
      }

      // Draw Vertical Grid Lines
      for (let c = 0; c < cols; c++) {
        ctx.beginPath();
        for (let r = 0; r < rows; r++) {
          const idx = r * cols + c;
          const n = nodes[idx];
          if (r === 0) ctx.moveTo(n.x, n.y);
          else ctx.lineTo(n.x, n.y);
        }
        ctx.strokeStyle = '#39FF14';
        ctx.globalAlpha = 0.35;
        ctx.stroke();
      }

      // Draw Mouse Force-Field Circle
      if (mousePos.current.active) {
        ctx.strokeStyle = '#FF5500';
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(mx, my, radius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#FF5500';
        ctx.beginPath();
        ctx.arc(mx, my, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Vertex Nodes (Glowing Electric Green Dots)
      ctx.globalAlpha = 1.0;
      nodes.forEach((n) => {
        const dx = mx - n.x;
        const dy = my - n.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const isNear = dist < radius && mousePos.current.active;

        ctx.fillStyle = isNear ? '#FF5500' : '#39FF14';
        ctx.shadowColor = isNear ? '#FF5500' : '#39FF14';
        ctx.shadowBlur = isNear ? 12 : 6;

        ctx.beginPath();
        ctx.arc(n.x, n.y, isNear ? 4.5 : 3, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.shadowBlur = 0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mode]);

  return (
    <div
      ref={containerRef}
      className="bg-[#000000] border-3 border-white p-4 relative flex flex-col items-center justify-between shadow-[6px_6px_0px_0px_#39FF14] group overflow-hidden"
    >
      {/* Neo-Brutalist Technical Corner Markers */}
      <span className="absolute top-1 left-2 text-[#39FF14] font-mono text-xs font-bold">┌</span>
      <span className="absolute top-1 right-2 text-[#39FF14] font-mono text-xs font-bold">┐</span>
      <span className="absolute bottom-1 left-2 text-[#39FF14] font-mono text-xs font-bold">└</span>
      <span className="absolute bottom-1 right-2 text-[#39FF14] font-mono text-xs font-bold">┘</span>

      {/* Header Bar */}
      <div className="w-full flex items-center justify-between text-xs font-mono font-bold text-neutral-300 mb-2">
        <span className="flex items-center gap-1.5 text-[#39FF14]">
          <Magnet className="w-4 h-4 text-[#39FF14] animate-pulse" /> ANTIGRAVITY FIELD
        </span>

        {/* Mode Switcher Buttons */}
        <div className="flex border border-white bg-[#08090C] text-[10px]">
          <button
            onClick={() => setMode('repulse')}
            className={`px-2 py-0.5 font-mono ${mode === 'repulse' ? 'bg-[#39FF14] text-black font-black' : 'text-neutral-300 hover:text-white'}`}
          >
            REPULSION
          </button>
          <button
            onClick={() => setMode('attract')}
            className={`px-2 py-0.5 font-mono border-l border-white ${mode === 'attract' ? 'bg-[#39FF14] text-black font-black' : 'text-neutral-300 hover:text-white'}`}
          >
            MAGNETIC
          </button>
          <button
            onClick={() => setMode('vortex')}
            className={`px-2 py-0.5 font-mono border-l border-white ${mode === 'vortex' ? 'bg-[#39FF14] text-black font-black' : 'text-neutral-300 hover:text-white'}`}
          >
            VORTEX
          </button>
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={320}
        height={180}
        className="cursor-crosshair my-2 border border-neutral-800 bg-[#050505] w-full"
      />

      <div className="w-full text-center text-[10px] text-neutral-400 font-mono pt-2 border-t border-neutral-800 flex items-center justify-between">
        <span>Hover cursor to distort force-field lines</span>
        <span className="text-[#39FF14] font-bold">60 FPS REALTIME</span>
      </div>
    </div>
  );
}
