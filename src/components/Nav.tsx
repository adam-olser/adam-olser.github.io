import { useCallback, useRef, useState, useEffect } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { MatrixRain } from './MatrixRain';

interface NavProps {
  isDark: boolean;
  onThemeToggle: () => void;
}

export function Nav({ isDark, onThemeToggle }: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showMatrix, setShowMatrix] = useState(false);
  const tapCount = useRef(0);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogoTap = () => {
    tapCount.current += 1;
    if (tapTimer.current) clearTimeout(tapTimer.current);
    if (tapCount.current >= 3) {
      tapCount.current = 0;
      setShowMatrix(true);
    } else {
      tapTimer.current = setTimeout(() => { tapCount.current = 0; }, 500);
    }
  };

  const handleMatrixDone = useCallback(() => setShowMatrix(false), []);

  const links = [
    { label: 'Work', href: '#work' },
    { label: 'Skills', href: '#skills' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <>
      {showMatrix && <MatrixRain onDone={handleMatrixDone} />}
      <nav
        className={`sticky top-0 w-full h-20 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-surface/80 backdrop-blur-xl shadow-none'
            : 'bg-transparent'
        }`}
      >
        <div className="flex justify-between items-center px-8 md:px-24 max-w-[1440px] mx-auto h-full">
          {/* Logo */}
          <a href="#" className="flex items-center no-underline" onClick={handleLogoTap}>
            <span className="w-10 h-8 bg-primary rounded-lg flex items-center justify-center text-on-primary font-black text-sm select-none tracking-tight px-2">
              AO
            </span>
          </a>

          {/* Desktop nav links */}
          <div className="hidden sm:flex items-center gap-10">
            {links.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="text-on-surface-variant font-medium text-sm tracking-tight hover:text-primary transition-colors duration-200"
              >
                {label}
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle isDark={isDark} onToggle={onThemeToggle} />
            <button
              className="sm:hidden flex items-center justify-center text-on-surface"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              <span className="material-symbols-outlined">
                {menuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="sm:hidden bg-surface/95 backdrop-blur-xl border-t border-outline-variant/10 px-8 py-6 flex flex-col gap-6">
            {links.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="text-on-surface font-semibold text-lg tracking-tight hover:text-primary transition-colors"
              >
                {label}
              </a>
            ))}
          </div>
        )}
      </nav>
    </>
  );
}
