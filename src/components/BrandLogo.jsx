import React from 'react';
import logoImg from '../assets/logo.png';

export default function BrandLogo({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
    xl: 'w-24 h-24'
  };

  return (
    <div className={`bg-[#000000] border-2 border-[#39FF14] p-0.5 shadow-[2px_2px_0px_0px_#39FF14] flex items-center justify-center overflow-hidden ${sizeClasses[size] || sizeClasses.md} ${className}`}>
      <img
        src={logoImg}
        alt="adityahere Official Logo Monogram"
        className="w-full h-full object-cover rounded-none"
      />
    </div>
  );
}
