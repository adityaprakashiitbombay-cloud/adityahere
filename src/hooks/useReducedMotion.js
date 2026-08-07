import { useState, useEffect } from 'react';

/**
 * Hook to detect and respect user's system accessibility preference for reduced motion
 */
export function useReducedMotion() {
  const [reduceMotion, setReduceMotion] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e) => setReduceMotion(e.matches);

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return reduceMotion;
}
