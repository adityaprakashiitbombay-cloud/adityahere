import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import EntrySplash from './components/EntrySplash';
import HomePage from './pages/HomePage';
import TimelinePage from './pages/TimelinePage';
import ExpertisePage from './pages/ExpertisePage';
import TerminalPage from './pages/TerminalPage';
import FeedbackPage from './pages/FeedbackPage';
import BrandLogo from './components/BrandLogo';
import DynamicTopTicker from './components/DynamicTopTicker';
import UnifiedBackgroundSystem from './components/UnifiedBackgroundSystem';
import { useSoundEffects } from './hooks/useSoundEffects';

export default function App() {
  // Splash boot sequence triggers on refresh with instant pre-rendering underneath
  const [showSplash, setShowSplash] = useState(true);

  const { soundEnabled, setSoundEnabled, playUiClick, playHeavenlyMusic, playConfettiSound } = useSoundEffects();
  const location = useLocation();

  const handleFinishSplash = () => {
    setShowSplash(false);
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col font-mono selection:bg-[#39FF14] selection:text-black overflow-x-hidden relative">
      {/* Accessible Skip Link */}
      <a href="#main-content" className="skip-link font-mono">
        Skip to Main Content
      </a>

      {/* Hardware-Accelerated 60FPS Unified Background Matrix */}
      <UnifiedBackgroundSystem quality="high" opacity={0.12} />

      {/* 1. Main Page Layout (Pre-loaded and ready underneath while splash displays) */}
      <div className="flex flex-col min-h-screen relative z-10">
        {/* Dynamic Newsflash & Seamless Continuous Marquee Ticker Bar */}
        <DynamicTopTicker playUiClick={playUiClick} />

        {/* Permanent Navigation Bar */}
        <Navbar
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          playUiClick={playUiClick}
        />

        {/* Router Views Container with Framer Motion Page Transitions */}
        <main id="main-content" className="flex-1">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route
                path="/"
                element={
                  <HomePage
                    playUiClick={playUiClick}
                    playHeavenlyMusic={playHeavenlyMusic}
                    playConfettiSound={playConfettiSound}
                  />
                }
              />
              <Route
                path="/timeline"
                element={
                  <TimelinePage
                    playUiClick={playUiClick}
                    playHeavenlyMusic={playHeavenlyMusic}
                    playConfettiSound={playConfettiSound}
                  />
                }
              />
              <Route
                path="/expertise"
                element={<ExpertisePage playClickSound={playUiClick} />}
              />
              <Route
                path="/terminal"
                element={<TerminalPage playClickSound={playUiClick} />}
              />
              <Route
                path="/feedback"
                element={<FeedbackPage playClickSound={playUiClick} />}
              />
            </Routes>
          </AnimatePresence>
        </main>

        {/* Clean Footer */}
        <footer className="border-t-[3px] border-white bg-[#000000] py-8 px-4 mt-12 shadow-[0px_-4px_0px_0px_#39FF14]">
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-400">
            <div className="flex items-center gap-2.5">
              <BrandLogo size="md" />
              <span className="bg-[#39FF14] text-black font-bold px-2 py-0.5 border border-white">
                AH. v5.0
              </span>
              <span>&copy; 2026 adityahere. Built with React Router & Framer Motion.</span>
            </div>

            <div className="flex items-center gap-4 text-white">
              <span className="text-[#00E5FF]">⚡ Allen Patna (Ashiyana Digha Branch)</span>
              <span className="text-[#39FF14]">● SYSTEM ONLINE</span>
            </div>
          </div>
        </footer>
      </div>

      {/* 2. Top-Layer Splash Curtain (Lifts smoothly upward when boot sequence is ready) */}
      <AnimatePresence>
        {showSplash && (
          <EntrySplash onFinish={handleFinishSplash} onComplete={handleFinishSplash} />
        )}
      </AnimatePresence>
    </div>
  );
}
