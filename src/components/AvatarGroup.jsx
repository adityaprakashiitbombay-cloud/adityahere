import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Sample default avatars (including Skyleen, Shadcn, Adam Wathan, Guillermo Rauch, Jhey, David Haz & Close Friends)
export const DEFAULT_AVATARS = [
  {
    src: 'https://pbs.twimg.com/profile_images/1948770261848756224/oPwqXMD6_400x400.jpg',
    fallback: 'SK',
    tooltip: 'Skyleen',
    role: 'UI Designer'
  },
  {
    src: 'https://pbs.twimg.com/profile_images/1593304942210478080/TUYae5z7_400x400.jpg',
    fallback: 'CN',
    tooltip: 'Shadcn',
    role: 'Creator of shadcn/ui'
  },
  {
    src: 'https://pbs.twimg.com/profile_images/1677042510839857154/Kq4tpySA_400x400.jpg',
    fallback: 'AW',
    tooltip: 'Adam Wathan',
    role: 'Creator of Tailwind CSS'
  },
  {
    src: 'https://pbs.twimg.com/profile_images/1783856060249595904/8TfcCN0r_400x400.jpg',
    fallback: 'GR',
    tooltip: 'Guillermo Rauch',
    role: 'CEO of Vercel'
  },
  {
    src: 'https://pbs.twimg.com/profile_images/1534700564810018816/anAuSfkp_400x400.jpg',
    fallback: 'JH',
    tooltip: 'Jhey',
    role: 'Creative Dev'
  },
  {
    src: 'https://pbs.twimg.com/profile_images/1927474594102784000/Al0g-I6o_400x400.jpg',
    fallback: 'DH',
    tooltip: 'David Haz',
    role: 'Animator'
  },
];

export function AvatarGroup({ children, className = '' }) {
  return (
    <div className={`flex items-center -space-x-3.5 hover:space-x-0.5 transition-all duration-300 ${className}`}>
      {children}
    </div>
  );
}

export function Avatar({ children, className = '', index = 0 }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      relative="true"
      className="relative group cursor-pointer"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ y: -8, scale: 1.18, zIndex: 40 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className={`relative rounded-full border-2 border-white/40 overflow-hidden shadow-lg shadow-black/50 glass-pill p-0.5 ${className}`}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { isHovered });
          }
          return child;
        })}
      </div>
    </motion.div>
  );
}

export function AvatarImage({ src, alt = '' }) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) return null;

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
      className="w-full h-full object-cover rounded-full"
    />
  );
}

export function AvatarFallback({ children }) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-500/80 to-cyan-500/80 text-black font-extrabold text-xs rounded-full uppercase">
      {children}
    </div>
  );
}

export function AvatarGroupTooltip({ children, isHovered, role }) {
  return (
    <AnimatePresence>
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, y: 6, scale: 0.85 }}
          animate={{ opacity: 1, y: -42, scale: 1 }}
          exit={{ opacity: 0, y: 4, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 22 }}
          className="absolute left-1/2 -translate-x-1/2 top-0 pointer-events-none z-50 whitespace-nowrap"
        >
          <div className="bg-slate-900/90 backdrop-blur-md border border-white/25 px-3 py-1.5 rounded-xl shadow-2xl flex flex-col items-center">
            <span className="text-xs font-bold text-white tracking-wide">{children}</span>
            {role && <span className="text-[10px] text-cyan-300 font-mono">{role}</span>}
            {/* Tooltip Caret Pointer */}
            <div className="w-2 h-2 bg-slate-900 border-r border-b border-white/20 rotate-45 -mb-2 mt-0.5" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function AvatarGroupDemo({ avatars = DEFAULT_AVATARS }) {
  return (
    <AvatarGroup>
      {avatars.map((avatar, index) => (
        <Avatar key={index} index={index} className="w-11 h-11 border-2 border-emerald-400/50">
          <AvatarImage src={avatar.src} alt={avatar.tooltip} />
          <AvatarFallback>{avatar.fallback}</AvatarFallback>
          <AvatarGroupTooltip isHovered={false} role={avatar.role}>
            {avatar.tooltip}
          </AvatarGroupTooltip>
        </Avatar>
      ))}
    </AvatarGroup>
  );
}
