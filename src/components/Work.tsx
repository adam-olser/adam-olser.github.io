import { Reveal } from './Reveal';

interface Project {
  name: string;
  tag: string;
  blurb: string;
  demo: string;
  code: string;
  image: string;
}

const PROJECTS: Project[] = [
  {
    name: 'Capy Onsen',
    tag: 'Games',
    blurb: 'Pixel-art capybara onsen with six mini-games: memory match, bath bubbles, orange catch, capy run, capy stack, and Wordlebara.',
    demo: 'https://adam-olser.github.io/capy-onsen/',
    code: 'https://github.com/adam-olser/capy-onsen',
    image: '/previews/capy-onsen.jpg',
  },
  {
    name: 'QR Studio',
    tag: 'Full stack',
    blurb: 'A QR code generator with a rate-limited backend and a fast, clean web frontend.',
    demo: 'https://adam-olser.github.io/qr-studio/',
    code: 'https://github.com/adam-olser/qr-studio',
    image: '/previews/qr-studio.jpg',
  },
  {
    name: 'Drift Board',
    tag: 'Realtime',
    blurb: 'A collaborative kanban board that syncs live. No account needed, and cards can be filtered by priority.',
    demo: 'https://driftboard-4yjg.onrender.com/',
    code: 'https://github.com/adam-olser/drift-board',
    image: '/previews/drift-board.jpg',
  },
  {
    name: 'React Music Player',
    tag: 'Interface',
    blurb: 'A minimal music player with keyboard controls and playlist support.',
    demo: 'https://react-music-app-adamo.netlify.app/',
    code: 'https://github.com/adam-olser/react-music-player',
    image: '/previews/react-music-player.jpg',
  },
];

function ProjectCard({ project, offset }: { project: Project; offset: boolean }) {
  return (
    <Reveal className={`group ${offset ? 'sm:mt-14' : ''}`}>
      <div className="relative mb-6 transition-transform duration-500 group-hover:-translate-y-1">
        <a
          href={project.demo}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${project.name} demo`}
          className="block aspect-[4/3] rounded-lg overflow-hidden border border-outline-variant/30 bg-surface-container group-hover:border-primary/60 transition-colors duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <img src={project.image} alt={`${project.name} preview`} width={1200} height={900} className="w-full h-full object-cover object-top" loading="lazy" decoding="async" />
        </a>
        <span className="absolute top-3 left-3 rounded-full border border-outline-variant/40 bg-background/80 backdrop-blur px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-primary">
          {project.tag}
        </span>
      </div>

      <div className="flex justify-between items-start gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="text-2xl font-extrabold tracking-tight mb-2 text-on-surface group-hover:text-primary transition-colors duration-200">
            {project.name}
          </h3>
          <p className="text-on-surface-variant text-sm leading-relaxed max-w-sm">{project.blurb}</p>
        </div>
        <div className="flex flex-col gap-2 shrink-0 mt-1">
          <a
            href={project.code}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] uppercase tracking-widest font-bold font-mono text-on-surface-variant hover:text-primary transition-colors px-3.5 py-1.5 border border-outline-variant/40 rounded text-center hover:border-primary/50"
          >
            Code
          </a>
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] uppercase tracking-widest font-bold font-mono text-on-primary bg-primary hover:opacity-80 transition-opacity px-3.5 py-1.5 rounded text-center"
          >
            Demo
          </a>
        </div>
      </div>
    </Reveal>
  );
}

export function Work() {
  return (
    <section id="work" className="bg-surface-container-low py-24 md:py-32 px-8 sm:px-12 md:px-24">
      <div className="max-w-[1440px] mx-auto">
        <Reveal className="mb-16">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-4 block">Selected work</span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-on-surface max-w-[18ch]">
            Small products, shipped end to end.
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-16">
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.name} project={p} offset={i % 2 !== 0} />
          ))}
        </div>
      </div>
    </section>
  );
}
