import { useEffect, useRef, useState, type ReactNode } from 'react';

// Content is always visible. The reveal only slides it up a little as it scrolls into view.
export function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) { setOn(true); return; }
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) { setOn(true); io.disconnect(); }
    }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-transform duration-700 ease-out motion-reduce:transition-none motion-reduce:transform-none ${on ? 'translate-y-0' : 'translate-y-5'} ${className}`}
    >
      {children}
    </div>
  );
}
