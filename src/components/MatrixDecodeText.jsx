import React, { useEffect, useRef } from 'react';

const MATRIX_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*!?<>/~';

export default function MatrixDecodeText({ text = "adityahere.", className = "" }) {
  const spanRef = useRef(null);
  const safeText = typeof text === 'string' ? text : String(text || '');

  useEffect(() => {
    if (!spanRef.current) return;

    let iteration = 0;
    let animationFrameId = null;
    let lastTime = performance.now();

    const animate = (now) => {
      // Throttle to 30 FPS for optimal performance without dropping frames
      if (now - lastTime >= 35) {
        lastTime = now;
        if (spanRef.current) {
          spanRef.current.innerText = safeText
            .split('')
            .map((char, index) => {
              if (char === ' ') return ' ';
              if (index < iteration) {
                return safeText[index];
              }
              return MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
            })
            .join('');
        }

        iteration += 1 / 2;
      }

      if (iteration <= safeText.length) {
        animationFrameId = requestAnimationFrame(animate);
      } else if (spanRef.current) {
        spanRef.current.innerText = safeText;
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [safeText]);

  return <span ref={spanRef} className={className}>{safeText}</span>;
}
