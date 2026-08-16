import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import "./App.css";

interface Repository {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  topics: string[];
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  created_at: string;
  updated_at: string;
  archived: boolean;
}

interface GitHubUser {
  login: string;
  name: string;
  bio: string | null;
  location: string | null;
  blog: string | null;
  followers: number;
  following: number;
  public_repos: number;
  avatar_url: string;
  html_url: string;
}

function App() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        // Fetch user profile
        const userResponse = await fetch(
          "https://api.github.com/users/adam-olser"
        );
        const userData = await userResponse.json();
        setUser(userData);

        // Fetch repositories
        const reposResponse = await fetch(
          "https://api.github.com/users/adam-olser/repos?sort=updated&per_page=100"
        );
        const reposData = await reposResponse.json();

        // Filter out forks and sort by stars and recent activity
        const filteredRepos = reposData
          .filter((repo: Repository) => !repo.archived)
          .sort((a: Repository, b: Repository) => {
            return (
              b.stargazers_count - a.stargazers_count ||
              new Date(b.updated_at).getTime() -
                new Date(a.updated_at).getTime()
            );
          });

        setRepositories(filteredRepos);
      } catch (error) {
        console.error("Error fetching GitHub data:", error);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchGitHubData();

    // Set up auto-refresh every 5 minutes to get latest repository updates
    const refreshInterval = setInterval(fetchGitHubData, 5 * 60 * 1000);

    // Refresh data when the page becomes visible again (user switches tabs)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchGitHubData();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup
    return () => {
      clearInterval(refreshInterval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-content">
          <div className="loader-advanced">
            <div className="pulse-ring"></div>
            <div className="pulse-ring delay-1"></div>
            <div className="pulse-ring delay-2"></div>
          </div>
          <h2>Building portfolio...</h2>
          <p>Fetching the latest projects and achievements</p>
        </div>

        {/* Skeleton loading for better UX */}
        <div className="skeleton-container">
          <div className="skeleton-hero">
            <div className="skeleton-avatar"></div>
            <div className="skeleton-title"></div>
            <div className="skeleton-subtitle"></div>
          </div>
          <div className="skeleton-projects">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton-card-header"></div>
                <div className="skeleton-card-body">
                  <div className="skeleton-line"></div>
                  <div className="skeleton-line short"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Header user={user} />
      <About user={user} repos={repositories} />
      <Projects repositories={repositories} />
      <Contact user={user} />
    </div>
  );
}

function Header({ user }: { user: GitHubUser | null }) {
  const handleProfileClick = () => {
    // Create multiple confetti bursts for extra celebration!
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
    };

    function fire(particleRatio: number, opts: object) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    // Multiple confetti bursts with different colors and spread
    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      colors: [
        "#667eea",
        "#764ba2",
        "#f093fb",
        "#FF6B6B",
        "#4ECDC4",
        "#45B7D1",
      ],
    });
    fire(0.2, {
      spread: 60,
      colors: [
        "#667eea",
        "#764ba2",
        "#f093fb",
        "#FF6B6B",
        "#4ECDC4",
        "#45B7D1",
      ],
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
      colors: [
        "#667eea",
        "#764ba2",
        "#f093fb",
        "#FF6B6B",
        "#4ECDC4",
        "#45B7D1",
      ],
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
      colors: [
        "#667eea",
        "#764ba2",
        "#f093fb",
        "#FF6B6B",
        "#4ECDC4",
        "#45B7D1",
      ],
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
      colors: [
        "#667eea",
        "#764ba2",
        "#f093fb",
        "#FF6B6B",
        "#4ECDC4",
        "#45B7D1",
      ],
    });
  };

  return (
    <header className="hero">
      <div className="hero-content">
        <div className="profile-image clickable" onClick={handleProfileClick}>
          <img src={user?.avatar_url || "/header.jpg"} alt="Adam Olser" />
        </div>
        <h1>Adam Olšer</h1>
        <p className="tagline">
          Building travel experiences for millions • Frontend Engineer at
          Kiwi.com
        </p>
        <div className="stats">
          <div className="stat">
            <span className="number">{user?.public_repos || 0}</span>
            <span className="label">Public Repos</span>
          </div>
          <div className="stat">
            <span className="number">{user?.followers || 0}</span>
            <span className="label">Followers</span>
          </div>
          <div className="stat">
            <span className="number">{user?.following || 0}</span>
            <span className="label">Following</span>
          </div>
        </div>
        <div className="hero-buttons">
          <a href="#projects" className="btn btn-primary">
            Explore My Work
          </a>
          <a
            href={user?.html_url || "https://github.com/adam-olser"}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            See My Code
          </a>
        </div>
      </div>
      <div className="scroll-indicator">
        <div className="scroll-arrow"></div>
      </div>
    </header>
  );
}

function About({
  user,
  repos,
}: {
  user: GitHubUser | null;
  repos: Repository[];
}) {
  const achievements = [
    {
      name: "Pull Shark",
      description: "Contributed to multiple open source projects",
    },
    {
      name: "Arctic Code Vault Contributor",
      description: "Code preserved in GitHub Archive Program",
    },
  ];

  // Extract languages and technologies from repos
  const repoLanguages = repos.reduce((acc: Set<string>, repo) => {
    if (repo.language) acc.add(repo.language);
    repo.topics.forEach((topic) => {
      // Map common topics to skill names
      const topicMap: Record<string, string> = {
        react: "React.js",
        reactjs: "React.js",
        typescript: "TypeScript",
        javascript: "JavaScript",
        nodejs: "Node.js",
        "node-js": "Node.js",
        python: "Python",
        docker: "Docker",
        kubernetes: "Kubernetes",
        aws: "AWS",
        gcp: "Google Cloud",
        postgresql: "PostgreSQL",
        mysql: "MySQL",
        redis: "Redis",
        graphql: "GraphQL",
        "rest-api": "REST APIs",
        "restful-api": "REST APIs",
        jwt: "JWT",
        oauth: "OAuth 2.0",
        oauth2: "OAuth 2.0",
        tailwindcss: "Tailwind CSS",
        "tailwind-css": "Tailwind CSS",
        tailwind: "Tailwind CSS",
        nextjs: "Next.js",
        "next-js": "Next.js",
        jest: "Jest/Cypress",
        cypress: "Jest/Cypress",
        testing: "Jest/Cypress",
        webpack: "Webpack/Vite",
        vite: "Webpack/Vite",
        sass: "CSS/SCSS",
        scss: "CSS/SCSS",
        css: "CSS/SCSS",
        "github-actions": "GitHub Actions",
        "ci-cd": "GitHub Actions",
        eslint: "ESLint/Prettier",
        prettier: "ESLint/Prettier",
      };
      if (topicMap[topic]) acc.add(topicMap[topic]);
    });
    return acc;
  }, new Set<string>());

  // Debug: Log what technologies were detected (remove this later)
  console.log(
    "🔍 Detected technologies from repositories:",
    Array.from(repoLanguages)
  );
  console.log(
    "📊 Repository data sample:",
    repos
      .slice(0, 3)
      .map((r) => ({ name: r.name, language: r.language, topics: r.topics }))
  );

  // Base skills with manual curation - analyze repos for technologies
  const getSkillCategories = () => {
    return [
      {
        category: "Frontend & Testing",
        skills: [
          {
            name: "JavaScript",
            years: 6,
            level: "Expert",
            fromRepo: repoLanguages.has("JavaScript"),
          },
          {
            name: "TypeScript",
            years: 5,
            level: "Advanced",
            fromRepo: repoLanguages.has("TypeScript"),
          },
          {
            name: "React.js",
            years: 6,
            level: "Expert",
            fromRepo: repoLanguages.has("React.js"),
          },
          { name: "Next.js", years: 3, level: "Advanced", fromRepo: false },
          {
            name: "CSS/SCSS",
            years: 6,
            level: "Advanced",
            fromRepo: repoLanguages.has("CSS") || repoLanguages.has("SCSS"),
          },
          {
            name: "Jest/Cypress",
            years: 4,
            level: "Advanced",
            fromRepo: false,
          },
          {
            name: "Webpack/Vite",
            years: 4,
            level: "Advanced",
            fromRepo: false,
          },
          {
            name: "Tailwind CSS",
            years: 2,
            level: "Intermediate",
            fromRepo: false,
          },
          {
            name: "Storybook",
            years: 2,
            level: "Intermediate",
            fromRepo: false,
          },
        ],
      },
      {
        category: "Backend & APIs",
        skills: [
          {
            name: "GraphQL",
            years: 4,
            level: "Advanced",
            fromRepo: repoLanguages.has("GraphQL"),
          },
          {
            name: "REST APIs",
            years: 6,
            level: "Expert",
            fromRepo: repoLanguages.has("REST APIs"),
          },
          {
            name: "Node.js",
            years: 4,
            level: "Intermediate",
            fromRepo: repoLanguages.has("Node.js"),
          },
          {
            name: "Python",
            years: 3,
            level: "Intermediate",
            fromRepo: repoLanguages.has("Python"),
          },
          {
            name: "OAuth 2.0",
            years: 3,
            level: "Advanced",
            fromRepo: repoLanguages.has("OAuth 2.0"),
          },
          {
            name: "JWT",
            years: 3,
            level: "Advanced",
            fromRepo: repoLanguages.has("JWT"),
          },
          {
            name: "PostgreSQL",
            years: 4,
            level: "Advanced",
            fromRepo: repoLanguages.has("PostgreSQL"),
          },
          {
            name: "Redis",
            years: 2,
            level: "Intermediate",
            fromRepo: repoLanguages.has("Redis"),
          },
        ],
      },
      {
        category: "Infrastructure & Security",
        skills: [
          {
            name: "AWS/GCP",
            years: 3,
            level: "Intermediate",
            fromRepo:
              repoLanguages.has("AWS") || repoLanguages.has("Google Cloud"),
          },
          {
            name: "Docker",
            years: 3,
            level: "Advanced",
            fromRepo: repoLanguages.has("Docker"),
          },
          {
            name: "Kubernetes",
            years: 2,
            level: "Intermediate",
            fromRepo: repoLanguages.has("Kubernetes"),
          },
          {
            name: "Payment Systems",
            years: 3,
            level: "Advanced",
            fromRepo: false,
          },
          { name: "PCI DSS", years: 2, level: "Intermediate", fromRepo: false },
          {
            name: "GitHub Actions",
            years: 3,
            level: "Advanced",
            fromRepo: false,
          },
        ],
      },
      {
        category: "Development Tools",
        skills: [
          { name: "Git", years: 6, level: "Expert", fromRepo: true },
          {
            name: "ESLint/Prettier",
            years: 4,
            level: "Advanced",
            fromRepo: false,
          },
          { name: "Postman", years: 4, level: "Advanced", fromRepo: false },
          { name: "Figma", years: 3, level: "Intermediate", fromRepo: false },
        ],
      },
    ];
  };

  const skillCategories = getSkillCategories();

  return (
    <section className="about">
      <div className="container">
        <h2>About Me</h2>
        <div className="about-grid">
          <div className="about-text">
            <p>
              {user?.bio ||
                "I'm a frontend engineer who gets excited about solving complex problems at scale. Over 6+ years at Kiwi.com, I've built authentication systems serving millions of travelers, architected payment flows that process thousands of bookings daily, and mentored junior developers who've become technical leaders themselves."}
            </p>
            <p>
              Currently working as a{" "}
              <strong>Software Engineer at Kiwi.com</strong> in Barcelona, where
              I lead development of critical user-facing systems including
              authentication APIs, payment processing, and security
              implementations.
            </p>
            <p>
              When I'm not debugging React components or optimizing GraphQL
              queries, you'll find me exploring Tokyo's tech scene or
              contributing to open source projects.
            </p>
            <div className="skills">
              <h3>Technologies & Skills</h3>
              <div className="skill-categories">
                {skillCategories.map((category) => (
                  <div key={category.category} className="skill-category">
                    <h4 className="category-title">{category.category}</h4>
                    <div className="skill-pills">
                      {category.skills.map((skill) => (
                        <div
                          key={skill.name}
                          className={`skill-pill ${
                            skill.fromRepo ? "from-repo" : ""
                          }`}
                          title={`${skill.level} • ${
                            skill.years
                          } years experience${
                            skill.fromRepo ? " • Found in repositories" : ""
                          }`}
                        >
                          <span className="skill-name">{skill.name}</span>
                          {skill.fromRepo && (
                            <span className="repo-indicator">📊</span>
                          )}
                          <div className="skill-tooltip">
                            <span className="skill-level">{skill.level}</span>
                            <span className="skill-experience">
                              {skill.years} years
                            </span>
                            {skill.fromRepo && (
                              <span className="repo-note">
                                Found in your repositories
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="achievements">
            <h3>GitHub Achievements</h3>
            {achievements.map((achievement) => (
              <div key={achievement.name} className="achievement">
                <h4>{achievement.name}</h4>
                <p>{achievement.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Projects({ repositories }: { repositories: Repository[] }) {
  const featuredProjects = [
    "qr-studio",
    "smart-brain",
    "react-music-player",
    "dapp-chat",
  ];

  const featured = repositories.filter((repo) =>
    featuredProjects.includes(repo.name)
  );

  const other = repositories
    .filter(
      (repo) =>
        !featuredProjects.includes(repo.name) &&
        repo.name !== "adam-olser.github.io"
    )
    .slice(0, 6);

  return (
    <section id="projects" className="projects">
      <div className="container">
        <h2>Featured Projects</h2>
        <div className="projects-grid featured">
          {featured.map((repo) => (
            <ProjectCard key={repo.id} repo={repo} featured />
          ))}
        </div>

        {other.length > 0 && (
          <>
            <h2>Other Projects</h2>
            <div className="projects-grid">
              {other.map((repo) => (
                <ProjectCard key={repo.id} repo={repo} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function ProjectCard({
  repo,
  featured = false,
}: {
  repo: Repository;
  featured?: boolean;
}) {
  const getProjectDescription = (name: string, description: string | null) => {
    const descriptions: Record<string, string> = {
      "qr-studio":
        "QR code generator with advanced styling and logo integration",
      "smart-brain": "AI-powered face detection app with user authentication",
      "react-music-player": "Modern music player built with React",
      "dapp-chat": "Decentralized chat application",
    };
    return (
      descriptions[name] || description || "A cool project built with passion"
    );
  };

  const getProjectCategory = (name: string) => {
    const categories: Record<string, string> = {
      "qr-studio": "Web App",
      "smart-brain": "AI/ML Project",
      "react-music-player": "Media App",
      "dapp-chat": "Blockchain",
      RandomAirportPicker: "Utility Tool",
      "SW DB": "Database",
      "QA Academy": "Education",
      Rickmortyshop: "E-commerce",
      "Protostar Relay": "Developer Tool",
      "Nextjs Blog": "Blog Platform",
    };
    return categories[name] || "Web Project";
  };

  const formatLastUpdated = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
    return `${Math.ceil(diffDays / 365)} years ago`;
  };

  const getProjectURL = (name: string, homepage: string | null) => {
    // Known project URLs - update these with actual deployed URLs
    const knownUrls: Record<string, string> = {
      "qr-studio": "https://adam-olser.github.io/qr-studio",
      "smart-brain": "https://adam-olser.github.io/smart-brain",
      "react-music-player": "https://adam-olser.github.io/react-music-player",
      "dapp-chat": "https://adam-olser.github.io/dapp-chat",
      "adam-olser.github.io": "https://adam-olser.github.io",
    };

    // Return GitHub homepage if set, otherwise check known URLs
    return homepage || knownUrls[name] || null;
  };

  return (
    <div className={`project-card ${featured ? "featured" : ""}`}>
      <div className="project-header">
        <div className="project-title-section">
          <div className="project-category">
            {getProjectCategory(repo.name)}
          </div>
          <h3>
            {repo.name
              .replace(/-/g, " ")
              .replace(/\b\w/g, (l) => l.toUpperCase())}
          </h3>
        </div>
        <div className="project-stats">
          <span className="stars">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />
            </svg>
            {repo.stargazers_count}
          </span>
          <span className="forks">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
            {repo.forks_count}
          </span>
          <span className="last-updated">
            Updated {formatLastUpdated(repo.updated_at)}
          </span>
        </div>
      </div>

      <div className="project-content">
        <p className="project-description">
          {getProjectDescription(repo.name, repo.description)}
        </p>

        <div className="project-tech">
          {repo.language && (
            <span className="tech-tag primary">{repo.language}</span>
          )}
          {repo.topics.slice(0, 3).map((topic) => (
            <span key={topic} className="tech-tag">
              {topic}
            </span>
          ))}
        </div>

        <div className="project-links">
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
          >
            View Code
          </a>
          {getProjectURL(repo.name, repo.homepage) && (
            <a
              href={getProjectURL(repo.name, repo.homepage)!}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Try It Live
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function Contact({ user }: { user: GitHubUser | null }) {
  return (
    <section className="contact">
      <div className="container">
        <h2>Let's Connect</h2>
        <p>
          Have an exciting project in mind? Whether it's scaling authentication
          systems or mentoring your team, I'd love to help build something
          amazing together!
        </p>

        <div className="contact-links">
          <a
            href={user?.html_url || "https://github.com/adam-olser"}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link"
          >
            <span className="icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </span>
            GitHub
          </a>
          <a href="mailto:adamolser@gmail.com" className="contact-link">
            <span className="icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h1.06l9.304 7.022 9.304-7.022h1.06A1.636 1.636 0 0 1 24 5.457z" />
              </svg>
            </span>
            Email
          </a>
          <a
            href="https://www.linkedin.com/in/adam-ol%C5%A1er-633027142/"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link"
          >
            <span className="icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </span>
            LinkedIn
          </a>
        </div>

        <p className="location">
          📍 Based in {user?.location || "Somewhere in the world"}
        </p>
      </div>
    </section>
  );
}

export default App;
