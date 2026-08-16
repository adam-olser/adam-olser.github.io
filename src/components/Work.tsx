import { useState } from 'react';
import type { Repository } from '../hooks/useGitHub';

interface WorkProps {
  repositories: Repository[];
  error: boolean;
}

const FEATURED = ['ganba-hero', 'qr-studio', 'qr-studio-spacelift-demo', 'nextjs-blog'];

const DESCRIPTIONS: Record<string, string> = {
  'ganba-hero':           'Japanese language learning app with spaced repetition — React Native + Web (PWA)',
  'qr-studio':            'QR code generator with advanced styling, logo integration, and export options',
  'qr-studio-spacelift-demo': 'Infrastructure-as-Code workflow with OpenTofu and Spacelift, including policy-as-code and drift detection',
  'nextjs-blog':          'Static blog built with Next.js — SSG, file-based routing, and markdown content pipeline',
  'react-web':            'React fundamentals project — component composition, state management, and API integration',
  'react-redux-games-db': 'Game discovery app using Redux and the RAWG API — real-time search and filtering',
  'SW-DB':                'Star Wars character database — REST API integration, search filtering, and responsive layout',
  'rickmortyshop':        'Rick & Morty themed e-commerce app — TypeScript, cart state, and character API integration',
  'RandomAirportPicker':  'Random airport discovery tool — CSS animations and REST API integration',
};

// Fixes for repos where the GitHub homepage field is missing or malformed
const FORCED_HOMEPAGES: Record<string, string> = {
  'ganba-hero': 'https://adam-olser.github.io/ganba-hero/',
  'nextjs-blog': 'https://nextjs-blog.adam-olser.vercel.app',
};

function toTitle(name: string) {
  return name.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
}

function screenshotUrl(url: string) {
  return `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`;
}

function ProjectCard({ repo, offset }: { repo: Repository; offset: boolean }) {
  const [imgFailed, setImgFailed] = useState(false);
  const description = DESCRIPTIONS[repo.name] || repo.description || 'A project built with care.';
  const homepage = repo.homepage || FORCED_HOMEPAGES[repo.name] || '';
  const primaryHref = homepage || repo.html_url;
  const initials = toTitle(repo.name)
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('');

  return (
    <div className={`group ${offset ? 'sm:mt-24' : ''}`}>
      {/* Thumbnail — links to demo or source */}
      <a
        href={primaryHref}
        target="_blank"
        rel="noopener noreferrer"
        className="block relative aspect-[16/10] bg-surface-container rounded-xl overflow-hidden mb-8 transition-all duration-500 group-hover:scale-[0.98]"
      >
        {imgFailed ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-surface-container to-primary-container/10 select-none">
            <span className="text-4xl font-black tracking-tighter text-primary/50">{initials}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50">{toTitle(repo.name)}</span>
          </div>
        ) : (
          <img
            src={homepage ? screenshotUrl(homepage) : `https://opengraph.githubassets.com/1/adam-olser/${repo.name}`}
            alt={`${toTitle(repo.name)} preview`}
            className="w-full h-full object-cover object-top"
            loading="lazy"
            onError={() => setImgFailed(true)}
          />
        )}
        {/* Amethyst overlay on hover */}
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        {/* Corner arrow */}
        <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
          <span className="material-symbols-outlined text-primary text-base">north_east</span>
        </div>
      </a>

      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <a
            href={primaryHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h3 className="text-xl font-bold mb-2 text-on-surface group-hover:text-primary transition-colors duration-200">
              {toTitle(repo.name)}
            </h3>
          </a>
          <p className="text-on-surface-variant text-sm leading-relaxed mb-5 max-w-sm">
            {description}
          </p>
          <div className="flex flex-wrap gap-2">
            {repo.language && (
              <span className="px-3 py-1 bg-surface-variant text-[10px] font-black uppercase tracking-tighter rounded text-on-surface-variant">
                {repo.language}
              </span>
            )}
            {repo.topics.slice(0, 2).map((t) => (
              <span key={t} className="px-3 py-1 bg-surface-variant text-[10px] font-black uppercase tracking-tighter rounded text-on-surface-variant">
                {t}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2 shrink-0 mt-1">
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant hover:text-primary transition-colors px-3 py-1.5 border border-outline-variant/30 rounded hover:border-primary/40"
          >
            Code
          </a>
          {homepage && (
            <a
              href={homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] uppercase tracking-widest font-bold text-on-primary bg-primary hover:opacity-80 transition-opacity px-3 py-1.5 rounded text-center"
            >
              Demo
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export function Work({ repositories, error }: WorkProps) {
  const featured = FEATURED.map((name) => repositories.find((r) => r.name === name)).filter(Boolean) as Repository[];
  const other = repositories
    .filter((r) => !FEATURED.includes(r.name) && r.name !== 'adam-olser.github.io')
    .slice(0, 4);

  if (error) {
    return (
      <section id="work" className="bg-surface-container-low py-32 px-8 sm:px-12 md:px-24">
        <div className="max-w-[1440px] mx-auto">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-4 block">Selected Works</span>
          <h2 className="text-4xl font-black tracking-tight text-on-surface mb-8">Projects</h2>
          <p className="text-on-surface-variant text-sm">
            Could not load projects right now.{' '}
            <a href="https://github.com/adam-olser" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              View on GitHub
            </a>
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="work" className="bg-surface-container-low py-32 px-8 sm:px-12 md:px-24">
      <div className="max-w-[1440px] mx-auto">
        {/* Section header */}
        <div className="flex justify-between items-end mb-20">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-4 block">
              Selected Works
            </span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-on-surface">
              Projects
            </h2>
          </div>
          <div className="hidden sm:block h-px flex-1 mx-12 bg-outline-variant/20" />
          <span className="hidden sm:block text-on-surface-variant text-xs font-medium uppercase tracking-widest">
            {String(featured.length).padStart(2, '0')} / {String(FEATURED.length).padStart(2, '0')}
          </span>
        </div>

        {/* Staggered 2-col grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-16">
          {featured.map((repo, i) => (
            <ProjectCard key={repo.id} repo={repo} offset={i % 2 !== 0} />
          ))}
        </div>

        {/* Other projects */}
        {other.length > 0 && (
          <>
            <div className="flex items-end gap-6 mt-32 mb-16">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
                More Work
              </span>
              <h2 className="text-2xl font-black tracking-tight text-on-surface">
                Other Projects
              </h2>
              <div className="hidden sm:block h-px flex-1 bg-outline-variant/20" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
              {other.map((repo, i) => (
                <ProjectCard key={repo.id} repo={repo} offset={i % 2 !== 0} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
