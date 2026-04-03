const links = [
  { label: 'GitHub',   href: 'https://github.com/adam-olser' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/adam-olser' },
  { label: 'Email',    href: 'mailto:adam.olser@gmail.com' },
];

export function Footer() {
  return (
    <footer className="w-full py-16 px-8 sm:px-12 md:px-24 bg-surface-container-low">
      <div className="max-w-[1440px] mx-auto flex justify-end">
        <div className="flex gap-8">
          {links.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('mailto') ? undefined : '_blank'}
              rel={href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
              className="text-[10px] uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors font-medium"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
