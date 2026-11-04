import { EMAIL, GITHUB_URL, LINKEDIN_URL } from '../links';
import { Reveal } from './Reveal';

export function Contact() {
  return (
    <section id="contact" className="bg-surface-container-low py-24 md:py-32 px-8 sm:px-12 md:px-24">
      <Reveal className="max-w-[1440px] mx-auto text-center flex flex-col items-center gap-6">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Contact</span>
        <h2 className="text-4xl md:text-6xl font-black tracking-tight text-on-surface max-w-[18ch]">
          Let's work together
        </h2>
        <p className="text-on-surface-variant text-xl max-w-xl">
          Open to senior engineering roles and high-impact remote or relocation opportunities.
        </p>
        <a
          href={`mailto:${EMAIL}`}
          className="inline-flex items-center bg-primary text-on-primary px-10 py-5 rounded-amethyst text-base font-bold hover:shadow-glow hover:-translate-y-0.5 transition-all duration-200 active:scale-95 mt-4"
        >
          Send a Message
        </a>

        <div className="flex justify-center gap-8 mt-10">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-4xl">code</span>
          </a>
          <a
            href={`mailto:${EMAIL}`}
            aria-label="Email"
            className="text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-4xl">alternate_email</span>
          </a>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-4xl">share</span>
          </a>
        </div>
      </Reveal>
    </section>
  );
}
