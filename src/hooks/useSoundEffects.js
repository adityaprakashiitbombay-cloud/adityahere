import { useState, useEffect, useRef, useCallback } from 'react';

// Global shared AudioContext and pre-decoded audio buffer
let globalAudioCtx = null;
let globalDecodedAudioBuffer = null;

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

// Pre-fetch & decode victory audio buffer immediately on load
if (typeof window !== 'undefined') {
  fetch('/romancee.mp3')
    .then((res) => res.arrayBuffer())
    .then((buf) => {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) {
        const ctx = globalAudioCtx || new AudioCtxClass();
        globalAudioCtx = ctx;
        return ctx.decodeAudioData(buf);
      }
    })
    .then((decoded) => {
      globalDecodedAudioBuffer = decoded;
    })
    .catch(() => {});
}

export function useSoundEffects() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const romanceeAudioRef = useRef(null);

  useEffect(() => {
    // Preload HTML5 Audio Element for romancee.mp3
    try {
      romanceeAudioRef.current = new Audio('/romancee.mp3');
      romanceeAudioRef.current.volume = 0.85;
    } catch (e) {}
  }, []);

  // Universal Listener to unlock AudioContext on any user gesture
  useEffect(() => {
    const unlockAudio = () => {
      const ctx = getAudioContext();
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      try {
        if (ctx && ctx.state === 'running') {
          const buffer = ctx.createBuffer(1, 1, 22050);
          const source = ctx.createBufferSource();
          source.buffer = buffer;
          source.connect(ctx.destination);
          source.start(0);
        }
      } catch (e) {}
    };

    const events = ['click', 'mousemove', 'mouseenter', 'touchstart', 'touchend', 'pointerdown', 'keydown', 'scroll'];
    events.forEach((evt) => window.addEventListener(evt, unlockAudio, { passive: true }));

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, unlockAudio));
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

  // Exclusive Confetti Audio: romancee.mp3 plays ONLY when confetti is fired
  const playConfettiSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      if (globalDecodedAudioBuffer) {
        const audioCtx = getAudioContext();
        if (audioCtx) {
          if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
          const src = audioCtx.createBufferSource();
          src.buffer = globalDecodedAudioBuffer;
          const gainNode = audioCtx.createGain();
          gainNode.gain.setValueAtTime(0.85, audioCtx.currentTime);
          src.connect(gainNode);
          gainNode.connect(audioCtx.destination);
          src.start(0);
          return;
        }
      }
      if (romanceeAudioRef.current) {
        romanceeAudioRef.current.currentTime = 0;
        romanceeAudioRef.current.volume = 0.85;
        romanceeAudioRef.current.play().catch(() => {});
      } else {
        const audio = new Audio('/romancee.mp3');
        audio.volume = 0.85;
        audio.play().catch(() => {});
      }
    } catch (e) {
      playNormalClickSound();
    }
  }, [soundEnabled, playNormalClickSound]);

  const playHeavenlyMusic = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const audio = new Audio(encodeURI('/heavenly music.mp3'));
      audio.volume = 0.75;
      audio.play().catch(() => {
        // Fallback to untitled.mp3 if available
        const fallbackAudio = new Audio('/untitled.mp3');
        fallbackAudio.volume = 0.75;
        fallbackAudio.play().catch(() => {});
      });
    } catch (e) {
      playNormalClickSound();
    }
  }, [soundEnabled, playNormalClickSound]);

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => !prev);
  }, []);

  return {
    soundEnabled,
    setSoundEnabled,
    toggleSound,
    playUiClick,
    playHeavenlyMusic,
    playConfettiSound,
  };
}
