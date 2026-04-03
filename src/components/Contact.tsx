import type { GitHubUser } from '../hooks/useGitHub';

interface ContactProps {
  user: GitHubUser | null;
}

export function Contact({ user }: ContactProps) {
  return (
    <section id="contact" className="py-32 px-8 sm:px-12 md:px-24 max-w-[1440px] mx-auto text-center">
      <div className="mb-16">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-4 block">
          Contact
        </span>
        <h2 className="text-5xl md:text-7xl font-black tracking-tightest text-on-surface mb-6">
          Let's Work Together
        </h2>
        <p className="text-on-surface-variant text-xl max-w-xl mx-auto mb-12">
          Open to senior engineering roles and high-impact remote or relocation opportunities. Currently available.
        </p>
        <a
          href="mailto:adam.olser@gmail.com"
          className="inline-flex items-center bg-primary text-on-primary px-10 py-5 rounded-amethyst text-base font-bold hover:shadow-glow hover:-translate-y-0.5 transition-all duration-200 active:scale-95"
        >
          Send a Message
        </a>
      </div>

      {/* Social links */}
      <div className="flex justify-center gap-8 mt-16">
        <a
          href={user?.html_url || 'https://github.com/adam-olser'}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className="text-on-surface-variant hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-4xl">code</span>
        </a>
        <a
          href="mailto:adam.olser@gmail.com"
          aria-label="Email"
          className="text-on-surface-variant hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-4xl">alternate_email</span>
        </a>
        <a
          href="https://linkedin.com/in/adam-olser"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="text-on-surface-variant hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-4xl">share</span>
        </a>
      </div>
    </section>
  );
}
