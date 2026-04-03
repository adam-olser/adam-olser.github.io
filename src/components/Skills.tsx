const core = [
  "JavaScript",
  "TypeScript",
  "Next.js",
  "React.js",
  "GraphQL / Relay",
  "REST APIs",
  "Node.js / Express",
  "XState",
  "React Hook Form",
];

const tooling = [
  { icon: "science", label: "Cypress / Vitest" },
  { icon: "check_circle", label: "React Testing Library" },
  { icon: "monitoring", label: "Datadog APM" },
  { icon: "deployed_code", label: "Docker / K8s" },
  { icon: "account_tree", label: "GitLab CI/CD" },
  { icon: "draw", label: "Figma" },
];

export function Skills() {
  return (
    <section
      id="skills"
      className="py-24 px-8 sm:px-12 md:px-24 max-w-[1440px] mx-auto"
    >
      <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-10 block">
        Tech Stack
      </span>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Core */}
        <div>
          <h3 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-6">
            Core
          </h3>
          <div className="flex flex-wrap gap-2">
            {core.map((t) => (
              <span
                key={t}
                className="px-4 py-2 bg-surface-container text-sm font-bold rounded text-on-surface hover:text-primary transition-colors"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Tooling */}
        <div>
          <h3 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-6">
            Tooling
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {tooling.map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-lg">
                  {icon}
                </span>
                <span className="text-sm font-medium text-on-surface-variant">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
