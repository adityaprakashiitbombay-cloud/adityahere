import React, { useEffect, useRef } from 'react';

const MATRIX_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*!?<>/~';

export default function MatrixDecodeText({ text = "adityahere.", className = "" }) {
  const spanRef = useRef(null);

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
          spanRef.current.innerText = text
            .split('')
            .map((char, index) => {
              if (char === ' ') return ' ';
              if (index < iteration) {
                return text[index];
              }
              return MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
            })
            .join('');
        }

        iteration += 1 / 2;
      }

      if (iteration <= text.length) {
        animationFrameId = requestAnimationFrame(animate);
      } else if (spanRef.current) {
        spanRef.current.innerText = text;
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [text]);

  return <span ref={spanRef} className={className}>{text}</span>;
}
