import React from 'react';

export default function Skeleton({ className = '', variant = 'rect' }) {
  const baseStyles = 'bg-neutral-900 border border-neutral-800 animate-shimmer';
  
  if (variant === 'circle') {
    return <div className={`rounded-full ${baseStyles} ${className}`} />;
  }

  if (variant === 'text') {
    return <div className={`h-4 w-full ${baseStyles} ${className}`} />;
  }

  return <div className={`${baseStyles} ${className}`} />;
}
