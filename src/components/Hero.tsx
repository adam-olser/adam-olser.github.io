import { useCallback, useState } from 'react';
import confetti from 'canvas-confetti';
import type { GitHubUser } from '../hooks/useGitHub';
import { useShake } from '../hooks/useShake';

interface HeroProps {
  user: GitHubUser | null;
}

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

export function Hero({ user }: HeroProps) {
  const [years, setYears] = useState(7);
  const [bump, setBump] = useState(false);

  const handleYearsClick = () => {
    setYears(y => (y >= 999 ? 7 : y + 1));
    setBump(true);
    setTimeout(() => setBump(false), 200);
  };

  const handleShake = useCallback(() => fireConfetti(), []);
  useShake(handleShake);

  return (
    <section className="relative flex flex-col justify-center px-8 sm:px-12 md:px-24 max-w-[1440px] mx-auto pt-16 pb-24 overflow-hidden">
      {/* Ambient radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-container/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Mobile avatar — absolute top-right, hidden on md+ */}
      <button
        onClick={fireConfetti}
        aria-label="Click for a surprise"
        className="md:hidden absolute top-4 right-8 w-16 h-16 rounded-full overflow-hidden border-2 border-primary/60 shadow-md cursor-pointer hover:scale-105 transition-all duration-300 active:scale-95 focus:outline-none z-20"
      >
        <img
          src={user?.avatar_url || '/header.jpg'}
          alt="Adam Olser"
          className="w-full h-full object-cover"
        />
      </button>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8 lg:gap-16 items-center">
        {/* Left: headline + CTAs */}
        <div className="flex flex-col justify-center">
          <h1 className="text-[2.5rem] sm:text-[3rem] md:text-[3.5rem] lg:text-[4.5rem] font-black leading-[0.95] tracking-tightest text-on-surface mb-6">
            Adam <span className="text-primary">Olšer</span>
          </h1>
          <p className="text-on-surface-variant text-lg max-w-md mb-8 leading-relaxed">
            Software engineer at Kiwi.com.{' '}
            <button
              onClick={handleYearsClick}
              aria-label="Years of experience"
              className={`font-bold text-primary tabular-nums inline-block transition-transform duration-150 focus:outline-none ${
                bump ? 'scale-125' : 'scale-100'
              }`}
            >
              {years}+
            </button>
            {' '}years building authentication and user infrastructure for millions of travellers.
          </p>
          <div className="flex flex-wrap gap-2 mb-10">
            {STACK.map((t) => (
              <span
                key={t}
                className="px-3 py-1 bg-surface-container text-[11px] font-bold uppercase tracking-wider rounded text-on-surface-variant"
              >
                {t}
              </span>
            ))}
          </div>
          <div className="flex flex-row items-center gap-4">
            <a
              href="#work"
              className="inline-flex items-center justify-center bg-primary text-on-primary px-8 py-4 rounded-amethyst text-sm font-bold hover:shadow-glow hover:-translate-y-0.5 transition-all duration-200 active:scale-95"
            >
              View Work
            </a>
            <a
              href="mailto:adam.olser@gmail.com"
              className="inline-flex items-center justify-center px-8 py-4 rounded-amethyst text-sm font-bold border border-outline-variant/30 text-on-surface-variant hover:border-primary/40 hover:text-primary transition-all duration-200"
            >
              Get in Touch
            </a>
          </div>
        </div>

        {/* Right: profile image — hidden on mobile, visible from md up */}
        <div className="hidden md:flex items-center justify-center">
          <button
            onClick={fireConfetti}
            aria-label="Click for a surprise"
            className="w-36 md:w-44 lg:w-56 xl:w-64 aspect-square rounded-full overflow-hidden border-4 border-primary/60 shadow-lg cursor-pointer hover:scale-105 transition-all duration-300 active:scale-95 focus:outline-none flex-shrink-0"
          >
            <img
              src={user?.avatar_url || '/header.jpg'}
              alt="Adam Olser"
              className="w-full h-full object-cover"
            />
          </button>
        </div>
      </div>
    </section>
  );
}
