import { lazy, Suspense, useCallback, useState } from 'react';
import confetti from 'canvas-confetti';
import { useShake, requestMotionPermission } from '../hooks/useShake';
import { AVATAR_URL, GITHUB_URL } from '../links';
import type { HeroProgress } from './HeroCanvas';

// three.js is large, so the canvas loads after the first paint.
const HeroCanvas = lazy(() => import('./HeroCanvas'));

type ConfettiOptions = Parameters<typeof confetti>[0];

function fireConfetti() {
  const count = 200;
  const defaults = { origin: { y: 0.6 } };

  function fire(ratio: number, opts: ConfettiOptions) {
    confetti({ ...defaults, ...opts, particleCount: Math.floor(count * ratio) });
  }

  const colors = ['#00FFC8', '#040808', '#b4ffeb', '#00c8a0', '#80ffe8', '#d2fffa'];
  fire(0.25, { spread: 26, startVelocity: 55, colors });
  fire(0.2,  { spread: 60, colors });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8, colors });
  fire(0.1,  { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2, colors });
  fire(0.1,  { spread: 120, startVelocity: 45, colors });
}

const STACK = ['TypeScript', 'Next.js', 'React', 'GraphQL', 'REST APIs'];
const REDUCE_MOTION =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function Hero() {
  const [progress, setProgress] = useState<HeroProgress>({ picked: 0, lines: [] });

  const handleShake = useCallback(() => fireConfetti(), []);
  useShake(handleShake);

  const hint = `Karel has picked up ${progress.picked} ${progress.picked === 1 ? 'beeper' : 'beepers'}.`;

  return (
    <section className="px-8 sm:px-12 md:px-24 max-w-[1440px] mx-auto pt-4 pb-10">
      <div className="relative min-h-[560px] md:min-h-[600px] grid items-end overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container">
        {/* Plain dot grid shows until the canvas loads, and stays if WebGL is unavailable */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-40"
          style={{ backgroundImage: 'radial-gradient(rgb(var(--color-on-surface-variant) / 0.5) 1px, transparent 1.5px)', backgroundSize: '28px 28px' }}
        />
        <Suspense fallback={null}>
          <HeroCanvas onProgress={setProgress} reduceMotion={REDUCE_MOTION} />
        </Suspense>

        {/* Portrait, top right */}
        <button
          onClick={() => { requestMotionPermission(); fireConfetti(); }}
          aria-label="Click for a surprise"
          className="absolute top-3 right-3 sm:top-7 sm:right-7 z-20 w-16 h-16 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl overflow-hidden border-2 border-primary shadow-glow cursor-pointer hover:scale-105 transition-transform duration-300 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <img src={AVATAR_URL} alt="Portrait of Adam Olšer" width={96} height={96} className="w-full h-full object-cover" />
        </button>

        {/* Career log, filled by Karel's pickups */}
        <div
          aria-live="polite"
          className="hidden lg:block absolute z-20 bottom-7 right-7 w-[min(360px,34%)] pointer-events-none rounded-lg border border-outline-variant/30 bg-surface-container/85 backdrop-blur px-4 py-3 font-mono text-[11.5px] leading-[1.7]"
        >
          <div className="mb-1 text-[10px] uppercase tracking-[0.12em] text-on-surface-variant">career.log</div>
          {progress.lines.length === 0 ? (
            <p className="text-on-surface-variant">Karel is collecting beepers. Each one is a piece of my story.</p>
          ) : (
            progress.lines.map(([when, what]) => (
              <p key={when + what} className="break-words">
                <span className="mr-2 text-on-surface-variant">{when}</span>
                <span className="mr-1.5 text-primary">✓</span>
                {what}
              </p>
            ))
          )}
        </div>

        {/* Name and intro, bottom left */}
        <div className="relative z-10 pointer-events-none flex flex-col gap-4 p-6 pt-40 sm:p-10 md:p-12 bg-gradient-to-t from-surface-container via-surface-container/70 to-transparent">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Software engineer · Barcelona</span>
          <h1 className="text-[clamp(3rem,12vw,8.5rem)] font-black leading-[0.92] tracking-[-0.05em] text-on-surface">
            Adam<br /><span className="text-primary">Olšer</span>
          </h1>
          <p className="max-w-[40ch] text-on-surface-variant text-lg md:text-xl leading-snug">
            I build software that people use every day and rarely have to think about.
          </p>
          <div className="flex flex-wrap gap-2">
            {STACK.map((t) => (
              <span key={t} className="px-3 py-1 bg-surface-container-high text-[11px] font-bold uppercase tracking-wider rounded text-on-surface-variant">
                {t}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3 pointer-events-auto">
            <a
              href="#work"
              className="inline-flex items-center justify-center bg-primary text-on-primary px-8 py-4 rounded-amethyst text-sm font-bold hover:shadow-glow hover:-translate-y-0.5 transition-all duration-200 active:scale-95"
            >
              View work
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 rounded-amethyst text-sm font-bold border border-outline-variant/40 text-on-surface hover:border-primary/60 hover:text-primary transition-all duration-200"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
      <p className="mt-3 font-mono text-[11px] text-on-surface-variant">{hint}</p>
    </section>
  );
}
