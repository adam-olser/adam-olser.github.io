import { useCallback, useEffect, useRef } from 'react';

const CHARS = '01アイウエオカキクケコ<>{}[]ABCDEF';
const FONT_SIZE = 14;
const DURATION = 2500;
const FADE_START = 1500;

export function MatrixRain({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stableOnDone = useCallback(onDone, [onDone]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const cols = Math.floor(canvas.width / FONT_SIZE);
    const drops = Array.from({ length: cols }, () => Math.random() * -40);
    const start = performance.now();
    let rafId: number;

    const draw = () => {
      const elapsed = performance.now() - start;
      if (elapsed >= DURATION) {
        stableOnDone();
        return;
      }

      const opacity =
        elapsed < FADE_START
          ? 1
          : 1 - (elapsed - FADE_START) / (DURATION - FADE_START);

      ctx.fillStyle = 'rgba(4, 8, 8, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${FONT_SIZE}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        ctx.fillStyle = `rgba(0, 255, 200, ${opacity})`;
        ctx.fillText(char, i * FONT_SIZE, drops[i] * FONT_SIZE);
        if (drops[i] * FONT_SIZE > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i] += 0.5;
      }

      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafId);
  }, [stableOnDone]);

  return <canvas ref={canvasRef} className="fixed inset-0 z-[9999] pointer-events-none" />;
}
