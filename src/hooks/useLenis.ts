import { useEffect } from 'react';
import Lenis from 'lenis';

// Smooth wheel and trackpad scrolling, plus eased jumps for #anchor links.
// Skipped entirely for visitors who ask for reduced motion.
export function useLenis() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ lerp: 0.2, anchors: { offset: -80 } });
    let id = requestAnimationFrame(function raf(t) {
      lenis.raf(t);
      id = requestAnimationFrame(raf);
    });
    return () => {
      cancelAnimationFrame(id);
      lenis.destroy();
    };
  }, []);
}
