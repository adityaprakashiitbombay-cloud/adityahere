import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Palette, Sparkles, Check } from 'lucide-react';
import { fireMatrixConfetti } from '../utils/confettiEffects';

export const THEMES = [
  { id: 'matrix', name: 'MATRIX GREEN', primary: '#39FF14', secondary: '#00E5FF', accent: '#FFE600', danger: '#FF007F' },
  { id: 'cyber', name: 'CYBER CYAN', primary: '#00E5FF', secondary: '#FF007F', accent: '#39FF14', danger: '#FFE600' },
  { id: 'sunset', name: 'NEON SUNSET', primary: '#FF007F', secondary: '#FFE600', accent: '#00E5FF', danger: '#39FF14' },
  { id: 'solar', name: 'SOLAR GOLD', primary: '#FFE600', secondary: '#39FF14', accent: '#FF007F', danger: '#00E5FF' },
  { id: 'hyper', name: 'HYPER PURPLE', primary: '#B026FF', secondary: '#00E5FF', accent: '#39FF14', danger: '#FF007F' }
];

export function applyTheme(themeId) {
  const theme = THEMES.find((t) => t.id === themeId) || THEMES[0];
  const root = document.documentElement;
  
  root.setAttribute('data-theme', theme.id);
  root.style.setProperty('--color-primary', theme.primary);
  root.style.setProperty('--color-primary-glow', `${theme.primary}66`);
  root.style.setProperty('--color-secondary', theme.secondary);
  root.style.setProperty('--color-secondary-glow', `${theme.secondary}66`);
  root.style.setProperty('--color-accent', theme.accent);
  root.style.setProperty('--color-danger', theme.danger);
  root.style.setProperty('--shadow-primary', `6px 6px 0px 0px ${theme.primary}`);
  root.style.setProperty('--shadow-secondary', `6px 6px 0px 0px ${theme.secondary}`);
  
  try {
    localStorage.setItem('adityahere_theme', theme.id);
  } catch (e) {}
}

export default function ThemeSwitcher({ playClickSound }) {
  const [currentTheme, setCurrentTheme] = useState(() => {
    try {
      return localStorage.getItem('adityahere_theme') || 'matrix';
    } catch (e) {
      return 'matrix';
    }
  });

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    applyTheme(currentTheme);
  }, []);

  const handleSelectTheme = (themeId) => {
    if (playClickSound) playClickSound();
    setCurrentTheme(themeId);
    applyTheme(themeId);
    setIsOpen(false);
  };

  return (
    <div className="relative font-mono">
      {/* Theme Switcher Button */}
      <motion.button
        whileHover={{ x: -2, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          if (playClickSound) playClickSound();
          setIsOpen(!isOpen);
        }}
        className="px-2.5 py-1 text-[11px] font-black border-2 border-white bg-black text-white flex items-center gap-1.5 shadow-[3px_3px_0px_0px_var(--color-primary,#39FF14)] hover:shadow-[5px_5px_0px_0px_var(--color-primary,#39FF14)] transition-all cursor-pointer"
        title="Change Portfolio Color Theme"
      >
        <Palette className="w-3.5 h-3.5 text-[var(--color-primary,#39FF14)] animate-spin-slow" />
        <span className="hidden sm:inline-block uppercase tracking-wider">THEME</span>
        <span
          className="w-2.5 h-2.5 rounded-full border border-white"
          style={{ backgroundColor: THEMES.find((t) => t.id === currentTheme)?.primary || '#39FF14' }}
        />
      </motion.button>

      {/* Popover Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.95 }}
          className="absolute right-0 top-10 z-50 bg-[#000000] border-3 border-white p-2.5 w-48 shadow-[6px_6px_0px_0px_#ffffff] space-y-1.5"
        >
          <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest px-1 pb-1 border-b border-neutral-800 flex items-center justify-between">
            <span>SELECT THEME</span>
            <Sparkles className="w-3 h-3 text-[var(--color-primary,#39FF14)]" />
          </div>

          {THEMES.map((t) => {
            const isSelected = currentTheme === t.id;
            return (
              <button
                key={t.id}
                onClick={() => handleSelectTheme(t.id)}
                className={`w-full p-1.5 text-left text-[10px] font-black uppercase font-mono border-2 transition-all flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-white text-black border-white shadow-[2px_2px_0px_0px_#000000]'
                    : 'bg-black text-neutral-300 border-neutral-800 hover:border-white hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 border border-black shadow-[1px_1px_0px_0px_#ffffff]"
                    style={{ backgroundColor: t.primary }}
                  />
                  <span>{t.name}</span>
                </div>
                {isSelected && <Check className="w-3 h-3 text-black" />}
              </button>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
