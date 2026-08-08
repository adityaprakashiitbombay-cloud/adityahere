import confetti from 'canvas-confetti';

// Electric Matrix Neon Color Palette
const NEON_PALETTE = ['#39FF14', '#00E5FF', '#FF007F', '#FFE600', '#BF00FF', '#FFFFFF'];

/**
 * High-Impact Multi-Stage Fireworks Confetti Blast
 * Auto-detects device size: 50% reduced particle count on mobile screens.
 * High-velocity trajectory shoots particles all the way to screen center.
 */
export function fireMatrixConfetti(options = {}) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const scale = isMobile ? 0.5 : 1.0;

  const defaults = {
    origin: { y: 0.6 }
  };

  const opts = { ...defaults, ...options };

  // Stage 1: Explosive High-Velocity Center Starburst (Shoots up to middle of screen)
  confetti({
    particleCount: Math.floor(160 * scale),
    spread: 110,
    startVelocity: 70,
    origin: opts.origin,
    colors: NEON_PALETTE,
    shapes: ['square', 'circle', 'star'],
    scalar: isMobile ? 1.0 : 1.3,
    drift: 0,
    ticks: 350,
    gravity: 0.7,
    decay: 0.93
  });

  // Stage 2: Left High-Velocity Stream Cannon (120ms delay)
  setTimeout(() => {
    confetti({
      particleCount: Math.floor(90 * scale),
      angle: 60,
      spread: 75,
      origin: { x: isMobile ? 0 : 0.05, y: 0.75 },
      colors: ['#39FF14', '#00E5FF', '#FFFFFF'],
      startVelocity: isMobile ? 65 : 82,
      scalar: isMobile ? 0.95 : 1.2,
      ticks: 320,
      gravity: 0.75
    });
  }, 120);

  // Stage 3: Right High-Velocity Stream Cannon (250ms delay)
  setTimeout(() => {
    confetti({
      particleCount: Math.floor(90 * scale),
      angle: 120,
      spread: 75,
      origin: { x: isMobile ? 1 : 0.95, y: 0.75 },
      colors: ['#FF007F', '#FFE600', '#BF00FF'],
      startVelocity: isMobile ? 65 : 82,
      scalar: isMobile ? 0.95 : 1.2,
      ticks: 320,
      gravity: 0.75
    });
  }, 250);

  // Stage 4: Top Rain Fireworks (420ms delay)
  setTimeout(() => {
    confetti({
      particleCount: Math.floor(70 * scale),
      spread: 130,
      origin: { x: 0.5, y: 0.25 },
      colors: NEON_PALETTE,
      startVelocity: 45,
      scalar: isMobile ? 1.0 : 1.35,
      ticks: 380
    });
  }, 420);
}

/**
 * Super Academic 10th Score Victory Celebration Fireworks
 */
export function fireAcademicVictoryConfetti() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const count = isMobile ? 4 : 8;

  const duration = 2.5 * 1000;
  const animationEnd = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: count,
      angle: 60,
      spread: 60,
      origin: { x: 0, y: 0.75 },
      startVelocity: isMobile ? 50 : 70,
      colors: ['#39FF14', '#00E5FF', '#FFFFFF']
    });
    confetti({
      particleCount: count,
      angle: 120,
      spread: 60,
      origin: { x: 1, y: 0.75 },
      startVelocity: isMobile ? 50 : 70,
      colors: ['#FF007F', '#FFE600', '#BF00FF']
    });

    if (Date.now() < animationEnd) {
      requestAnimationFrame(frame);
    }
  };

  fireMatrixConfetti();
  frame();
}

/**
 * TYPE 2: All Other Interactive / Button Micro Confetti (Fired on button and tab clicks)
 */
export function fireButtonConfetti(originX = 0.5, originY = 0.5) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const palette = NEON_PALETTE;

  confetti({
    particleCount: isMobile ? 12 : 22,
    spread: 55,
    startVelocity: 35,
    origin: { x: originX, y: originY },
    colors: palette,
    shapes: ['star', 'circle'],
    scalar: isMobile ? 0.65 : 0.75,
    gravity: 0.9,
    ticks: 150
  });
}
