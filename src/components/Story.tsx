import { Reveal } from './Reveal';

export function Story() {
  return (
    <section id="story" className="py-24 md:py-32 px-8 sm:px-12 md:px-24 bg-on-surface text-surface">
      <Reveal className="max-w-3xl mx-auto text-center flex flex-col items-center gap-6">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-surface/70">Story</span>
        <h2 className="text-4xl md:text-5xl font-black tracking-tight max-w-[18ch]">
          Started on a grid, still solving puzzles.
        </h2>
        <p className="text-lg md:text-xl leading-relaxed text-surface/85 max-w-[54ch]">
          As a teenager I learned to program by steering Karel the Robot around a grid. Moving one little robot until it did the right thing turned out to be the whole job.
        </p>
        <p className="text-lg md:text-xl leading-relaxed text-surface/85 max-w-[54ch]">
          Grew up in the Czech Republic. Lived in Barcelona, then Tokyo, and now back in Barcelona.
        </p>
      </Reveal>
    </section>
  );
}
