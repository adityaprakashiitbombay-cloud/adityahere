import React, { useState, Component } from 'react';
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
import AdminFloatingToolbar from './components/admin/AdminFloatingToolbar';
import { useSoundEffects } from './hooks/useSoundEffects';

// Global Error Boundary — auto-resets on route change so navigating away from a crashed page auto-recovers
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  // Auto-reset when the route (locationKey prop) changes
  componentDidUpdate(prevProps) {
    if (this.state.hasError && prevProps.locationKey !== this.props.locationKey) {
      this.setState({ hasError: false, error: null });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#000000] text-white p-6 font-mono flex flex-col items-center justify-center text-center">
          <div className="max-w-xl border-3 border-[#39FF14] p-6 shadow-[8px_8px_0px_0px_#39FF14] bg-[#050505] space-y-4">
            <h1 className="text-xl font-black text-[#39FF14]">⚡ SYSTEM AUTO-RECOVERY</h1>
            <p className="text-xs text-neutral-300">
              A runtime rendering glitch occurred. Try navigating to another page or reload.
            </p>
            <div className="bg-black border border-red-500 p-3 text-left text-xs text-red-400 font-mono overflow-auto max-h-48 whitespace-pre-wrap">
              {this.state.error?.toString() || 'Unknown Error'}
            </div>
            <div className="flex gap-3 justify-center flex-wrap">
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="bg-[#00E5FF] text-black font-black px-4 py-2 text-xs border border-white uppercase cursor-pointer shadow-[2px_2px_0px_0px_#ffffff]"
              >
                ↩ TRY AGAIN
              </button>
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.href = '/';
                }}
                className="bg-[#39FF14] text-black font-black px-4 py-2 text-xs border border-white uppercase cursor-pointer shadow-[2px_2px_0px_0px_#ffffff]"
              >
                CLEAR CACHE & GO HOME
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

import { fireAcademicVictoryConfetti } from './utils/confettiEffects';
import { updateVisitorDwellTime, logVisitorActivity } from './lib/supabaseClient';

export default function App() {
  // Show system boot // stage 1 splash screen on load
  const [showSplash, setShowSplash] = useState(true);
  const hasFiredAutoFireworksRef = React.useRef(false);

  const { soundEnabled, setSoundEnabled, playUiClick, playHeavenlyMusic, playConfettiSound } = useSoundEffects();
  const location = useLocation();

  // Track live user dwell time & route navigation activities
  React.useEffect(() => {
    const pathName = location.pathname || '/';
    logVisitorActivity(`Navigated to ${pathName}`);
  }, [location.pathname]);

  React.useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
      updateVisitorDwellTime(elapsedSeconds);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleFinishSplash = () => {
    setShowSplash(false);
    if (!hasFiredAutoFireworksRef.current) {
      hasFiredAutoFireworksRef.current = true;
      // Trigger sound & fireworks sparkles synchronously at the exact moment 4.5s stage 1 completes
      if (playConfettiSound) playConfettiSound();
      fireAcademicVictoryConfetti();
    }
  };


  return (
    <ErrorBoundary locationKey={location.pathname}>
      {/* Hidden Pre-buffered Victory Audio Track */}
      <audio id="global-victory-audio" src="/romancee.mp3" preload="auto" className="hidden" />

      <div className="min-h-screen bg-[#000000] text-white flex flex-col font-mono selection:bg-[#39FF14] selection:text-black overflow-x-hidden relative">
        {/* Accessible Skip Link */}
        <a href="#main-content" className="skip-link font-mono">
          Skip to Main Content
        </a>

        {/* Hardware-Accelerated 60FPS Unified Background Matrix */}
        <UnifiedBackgroundSystem quality="high" opacity={0.20} />

        {/* 1. Main Page Layout (Instant mount with zero lag) */}
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

          {/* Global Admin Matrix Toolbar (Visible across all tabs when unlocked with ALPHA1845) */}
          <AdminFloatingToolbar />

          {/* Ultra-Clean Single-Line Neo-Brutalist Footer */}
          <footer className="border-t-[3px] border-white bg-[#000000] py-4 px-4 mt-12 shadow-[0px_-4px_0px_0px_var(--color-primary,#39FF14)] font-mono">
            <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[11px] text-neutral-300">
              <BrandLogo size="sm" />
              
              <span className="bg-[var(--color-primary,#39FF14)] text-black font-black px-1.5 py-0.5 border border-white text-[10px]">
                AH. v5.0
              </span>

              <span className="text-neutral-500 hidden sm:inline">•</span>

              <span className="font-semibold text-white">
                &copy; 2026 adityahere. Built with React Router & Framer Motion.
              </span>

              <span className="text-neutral-500 hidden sm:inline">•</span>

              <span className="text-[#00E5FF] font-bold flex items-center gap-1">
                📍 Patna
              </span>

              <span className="text-neutral-500 hidden sm:inline">•</span>

              <div className="flex items-center gap-1.5 text-[#39FF14] font-bold">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#39FF14] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#39FF14]" />
                </span>
                <span className="tracking-wide">SYSTEM ONLINE</span>
              </div>
            </div>
          </footer>
        </div>

        {/* 2. Top-Layer Splash Curtain (Rendered only when active) */}
        <AnimatePresence>
          {showSplash && (
            <EntrySplash onFinish={handleFinishSplash} onComplete={handleFinishSplash} />
          )}
        </AnimatePresence>
      </div>
    </ErrorBoundary>
  );
}
