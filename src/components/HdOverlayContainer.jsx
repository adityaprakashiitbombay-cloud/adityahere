import React from 'react';
import { motion } from 'framer-motion';

export default function HdOverlayContainer({ children, className = '' }) {
  return (
    <div className={`relative overflow-hidden bg-[#000000] border-3 border-white shadow-[6px_6px_0px_0px_#39FF14] ${className}`}>
      {/* CRT Scanline Beam & Grid Layer */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0),rgba(255,255,255,0)_50%,rgba(0,0,0,0.4)_50%,rgba(0,0,0,0.4))] bg-[size:100%_4px] pointer-events-none z-20 opacity-30" />

      {/* Holographic Laser Beam Overlay */}
      <div className="absolute inset-x-0 h-16 bg-gradient-to-b from-[#39FF14]/0 via-[#00E5FF]/20 to-[#39FF14]/0 pointer-events-none z-20 animate-scanbeam opacity-60" />

      {/* Chromatic Aberration Border Accent */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-[#39FF14] via-[#00E5FF] to-[#FF007F] pointer-events-none z-20 animate-pulse" />

      {/* Container Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
