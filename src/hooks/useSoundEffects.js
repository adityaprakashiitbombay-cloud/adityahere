import { useState, useEffect, useRef, useCallback } from 'react';

// Global shared AudioContext to prevent context creation limits
let globalAudioCtx = null;

function getAudioContext() {
  if (!globalAudioCtx && typeof window !== 'undefined') {
    const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
    if (AudioCtxClass) {
      globalAudioCtx = new AudioCtxClass();
    }
  }
  if (globalAudioCtx && globalAudioCtx.state === 'suspended') {
    globalAudioCtx.resume().catch(() => {});
  }
  return globalAudioCtx;
}

export function useSoundEffects() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const romanceeAudioRef = useRef(null);

  useEffect(() => {
    // Preload HTML5 Audio Element for romancee.mp3
    try {
      romanceeAudioRef.current = new Audio('/romancee.mp3');
      romanceeAudioRef.current.volume = 0.7;
    } catch (e) {
      console.warn("Audio preloading fallback initialized.");
    }
  }, []);

  // Universal Click Listener to unlock AudioContext on first user interaction
  useEffect(() => {
    const unlockAudio = () => {
      const ctx = getAudioContext();
      if (ctx && ctx.state === 'suspended') {
        ctx.resume();
      }
    };
    window.addEventListener('click', unlockAudio, { once: true });
    window.addEventListener('keydown', unlockAudio, { once: true });
    return () => {
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
  }, []);

  // Crisp Cyber Mechanical Click Sound Synthesizer
  const playNormalClickSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const audioCtx = getAudioContext();
      if (!audioCtx) return;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(950, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(250, audioCtx.currentTime + 0.06);

      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.06);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }, [soundEnabled]);

  // Standard UI Click Sound
  const playUiClick = useCallback(() => {
    playNormalClickSound();
  }, [playNormalClickSound]);

  // High-Energy Victory Confetti Audio (romancee.mp3 + Web Audio Fanfare)
  const playConfettiSound = useCallback(() => {
    if (!soundEnabled) return;

    // 1. Play HTML5 romancee.mp3 track
    if (romanceeAudioRef.current) {
      romanceeAudioRef.current.currentTime = 0;
      romanceeAudioRef.current.play().catch(() => {
        playNormalClickSound();
      });
    }

    // 2. Play Web Audio Synthesized Chime Burst
    try {
      const audioCtx = getAudioContext();
      if (!audioCtx) return;

      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0.25, audioCtx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.08 + 0.3);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(audioCtx.currentTime + idx * 0.08);
        osc.stop(audioCtx.currentTime + idx * 0.08 + 0.3);
      });
    } catch (e) {}
  }, [soundEnabled, playNormalClickSound]);

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => !prev);
  }, []);

  return {
    soundEnabled,
    setSoundEnabled,
    toggleSound,
    playUiClick,
    playHeavenlyMusic: playNormalClickSound,
    playConfettiSound,
  };
}
