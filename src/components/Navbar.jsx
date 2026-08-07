import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Calendar, Zap, Terminal, MessageSquare, Volume2, VolumeX, Menu, X } from 'lucide-react';
import LiveAge from './LiveAge';
import BrandLogo from './BrandLogo';
import CommandPalette from './CommandPalette';

export default function Navbar({ soundEnabled, setSoundEnabled, playUiClick }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'HOME', icon: <Home className="w-4 h-4" /> },
    { path: '/timeline', label: 'TIMELINE', icon: <Calendar className="w-4 h-4" /> },
    { path: '/expertise', label: 'EXPERTISE', icon: <Zap className="w-4 h-4" /> },
    { path: '/terminal', label: 'TERMINAL', icon: <Terminal className="w-4 h-4" /> },
    { path: '/feedback', label: 'FEEDBACK', icon: <MessageSquare className="w-4 h-4" /> },
  ];

  const handleNavClick = () => {
    if (playUiClick) playUiClick();
    setMobileMenuOpen(false);
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 350, damping: 20 }
    }
  };

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
      className="w-full border-b-3 border-white bg-[#000000] sticky top-0 z-40 px-4 md:px-8 py-3 shadow-[0px_4px_0px_0px_#39FF14]"
    >
      <div className="max-w-3xl mx-auto flex items-center justify-between font-mono">
        {/* Brand Logo Link */}
        <NavLink
          to="/"
          onClick={handleNavClick}
          className="flex items-center gap-3 group"
        >
          <motion.div
            whileHover={{ x: -3, y: -3, transition: { type: "spring", stiffness: 400, damping: 10 } }}
            whileTap={{ scale: 0.95 }}
            className="hover:shadow-[6px_6px_0px_0px_#39FF14] transition-all"
          >
            <BrandLogo size="md" />
          </motion.div>
          <span className="text-xl font-black tracking-tight text-white group-hover:text-[#39FF14] transition-colors">
            aditya<span className="text-[#39FF14]">here.</span>
          </span>
        </NavLink>

        {/* Staggered Desktop Nav Items & Live Age Ticker */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="hidden md:flex items-center gap-2"
        >
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <motion.div key={item.path} variants={itemVariants}>
                <NavLink to={item.path} onClick={handleNavClick}>
                  <motion.div
                    whileHover={{ x: -3, y: -3, transition: { type: "spring", stiffness: 400, damping: 10 } }}
                    whileTap={{ scale: 0.96 }}
                    className={`px-3 py-1.5 text-xs font-bold font-mono border-2 border-white flex items-center gap-1.5 transition-all ${
                      isActive
                        ? 'bg-[#39FF14] text-black shadow-[6px_6px_0px_0px_#ffffff]'
                        : 'bg-[#000000] text-white hover:bg-neutral-900 shadow-[2px_2px_0px_0px_#39FF14] hover:shadow-[6px_6px_0px_0px_#39FF14]'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </motion.div>
                </NavLink>
              </motion.div>
            );
          })}

          {/* Live Age 50ms Decimal Counter */}
          <motion.div variants={itemVariants}>
            <LiveAge />
          </motion.div>

          {/* Sound FX Toggle */}
          <motion.div variants={itemVariants}>
            <motion.button
              whileHover={{ x: -3, y: -3, transition: { type: "spring", stiffness: 400, damping: 10 } }}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                if (playUiClick) playUiClick();
              }}
              className={`p-1.5 border-2 border-white font-bold transition-all ml-1 ${
                soundEnabled
                  ? 'bg-[#39FF14] text-black shadow-[6px_6px_0px_0px_#39FF14]'
                  : 'bg-[#181818] text-neutral-400 shadow-[2px_2px_0px_0px_#444] hover:shadow-[6px_6px_0px_0px_#39FF14]'
              }`}
              title="Toggle Sound Effects"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Mobile Hamburger & Controls */}
        <div className="flex md:hidden items-center gap-2">
          <motion.button
            whileHover={{ x: -2, y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 border-2 border-white bg-[#000000]"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#39FF14]" /> : <VolumeX className="w-4 h-4 text-neutral-500" />}
          </motion.button>

          <motion.button
            whileHover={{ x: -2, y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 bg-[#39FF14] text-black font-bold border-2 border-white shadow-[2px_2px_0px_0px_#ffffff]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden mt-3 pt-3 border-t-2 border-white font-mono space-y-2 bg-[#000000] max-w-3xl mx-auto"
        >
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink key={item.path} to={item.path} onClick={handleNavClick}>
                <div
                  className={`p-2.5 text-xs font-bold border-2 border-white flex items-center gap-2 mb-2 ${
                    isActive
                      ? 'bg-[#39FF14] text-black shadow-[3px_3px_0px_0px_#ffffff]'
                      : 'bg-[#000000] text-white'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </div>
              </NavLink>
            );
          })}
        </motion.div>
      )}
    </motion.nav>
  );
}
