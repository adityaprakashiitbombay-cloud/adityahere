import confetti from 'canvas-confetti';

// Electric Matrix Neon Color Palette
const NEON_PALETTE = ['#39FF14', '#00E5FF', '#FF007F', '#FFE600', '#BF00FF', '#FFFFFF'];

/**
 * High-Impact Multi-Stage Fireworks Confetti Blast
 */
export function fireMatrixConfetti(options = {}) {
  const defaults = {
    origin: { y: 0.6 }
  };

  const opts = { ...defaults, ...options };

  // Stage 1: Explosive Center Starburst
  confetti({
    particleCount: 160,
    spread: 100,
    startVelocity: 55,
    origin: opts.origin,
    colors: NEON_PALETTE,
    shapes: ['square', 'circle'],
    scalar: 1.2,
    drift: 0,
    ticks: 300
  });

  // Stage 2: Left Neon Stream Cannon (150ms delay)
  setTimeout(() => {
    confetti({
      particleCount: 90,
      angle: 60,
      spread: 70,
      origin: { x: 0.05, y: 0.75 },
      colors: ['#39FF14', '#00E5FF', '#FFFFFF'],
      startVelocity: 65,
      scalar: 1.1,
      ticks: 250
    });
  }, 120);

  // Stage 3: Right Cyber Stream Cannon (280ms delay)
  setTimeout(() => {
    confetti({
      particleCount: 90,
      angle: 120,
      spread: 70,
      origin: { x: 0.95, y: 0.75 },
      colors: ['#FF007F', '#FFE600', '#BF00FF'],
      startVelocity: 65,
      scalar: 1.1,
      ticks: 250
    });
  }, 250);

  // Stage 4: Top Rain Fireworks (450ms delay)
  setTimeout(() => {
    confetti({
      particleCount: 70,
      spread: 120,
      origin: { x: 0.5, y: 0.3 },
      colors: NEON_PALETTE,
      startVelocity: 35,
      scalar: 1.3,
      ticks: 350
    });
  }, 420);
}

/**
 * Super Academic 10th Score Victory Celebration Fireworks
 */
export function fireAcademicVictoryConfetti() {
  const duration = 2.5 * 1000;
  const animationEnd = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 7,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#39FF14', '#00E5FF', '#FFFFFF']
    });
    confetti({
      particleCount: 7,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#FF007F', '#FFE600', '#BF00FF']
    });

    if (Date.now() < animationEnd) {
      requestAnimationFrame(frame);
    }
  };

  fireMatrixConfetti();
  frame();
}
