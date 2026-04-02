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
          "https://api.github.com/users/adam-olser",
        );
        const userData = await userResponse.json();
        setUser(userData);

        // Fetch repositories
        const reposResponse = await fetch(
          "https://api.github.com/users/adam-olser/repos?sort=updated&per_page=100",
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
        <div className="loader"></div>
        <p>Loading portfolio...</p>
      </div>
    );
  }

  return (
    <div className="App">
      <Header user={user} />
      <About />
      <Projects repositories={repositories} />
      <Contact user={user} />
    </div>
  );
}

function Header({ user }: { user: GitHubUser | null }) {
  const handleProfileClick = () => {
    const count = 200;
    const defaults = { origin: { y: 0.7 } };

    function fire(particleRatio: number, opts: any) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

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
        <h1>Adam Olser</h1>
        <p className="tagline">Frontend Engineer & Technical Lead</p>
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
            View Projects
          </a>
          <a
            href={user?.html_url || "https://github.com/adam-olser"}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            GitHub Profile
          </a>
        </div>
      </div>
      <div className="scroll-indicator">
        <a
          href="#projects"
          className="scroll-arrow"
          aria-label="Scroll to projects"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
          }}
        />
      </div>
    </header>
  );
}

function About() {
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

  const skills = [
    "React.js",
    "TypeScript",
    "Next.js",
    "GraphQL/Relay",
    "JavaScript",
    "Node.js/Express",
    "CSS Grid & Flexbox",
    "Tailwind CSS",
    "XState",
    "Cypress",
    "Vitest",
    "Docker/K8s",
    "Datadog APM",
  ];

  return (
    <section className="about">
      <div className="container">
        <h2>About Me</h2>
        <div className="about-grid">
          <div className="about-text">
            <p>
              I'm a frontend engineer who gets excited about solving complex
              problems at scale. Over 6+ years at Kiwi.com, I've built
              authentication systems serving millions of travelers that process
              thousands of bookings daily, and mentored junior developers who've
              become technical leaders themselves.
            </p>
            <p>
              Currently working as a Software Engineer at Kiwi.com in Barcelona,
              where I lead development of critical user-facing systems including
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
              <div className="skill-tags">
                {skills.map((skill) => (
                  <span key={skill} className="skill-tag">
                    {skill}
                  </span>
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
    "ganba-hero",
    "qr-studio",
    "react-music-player",
    "dapp-chat",
  ];

  const featured = repositories.filter((repo) =>
    featuredProjects.includes(repo.name),
  );

  const other = repositories
    .filter(
      (repo) =>
        !featuredProjects.includes(repo.name) &&
        repo.name !== "adam-olser.github.io",
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
      "ganba-hero":
        "Japanese language learning app with spaced repetition - React Native + Web (PWA)",
      "qr-studio":
        "QR code generator with advanced styling and logo integration",
      "react-music-player": "Modern music player built with React",
      "dapp-chat": "Decentralized chat application",
    };
    return (
      descriptions[name] || description || "A cool project built with passion"
    );
  };

  const getProjectHomepage = (repo: Repository) => {
    const forced: Record<string, string> = {
      "react-music-player": "https://react-music-player.netlify.app",
      "qr-studio": "https://qr-studio.adam-olser.dev",
    };
    return repo.homepage || forced[repo.name] || "";
  };

  const projectHomepage = getProjectHomepage(repo);

  return (
    <div className={`project-card ${featured ? "featured" : ""}`}>
      <div className="project-header">
        <h3>
          {repo.name
            .replace(/-/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase())}
        </h3>
        <div className="project-stats">
          <span className="stars">⭐ {repo.stargazers_count}</span>
          <span className="forks">🍴 {repo.forks_count}</span>
        </div>
      </div>

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
        {projectHomepage && (
          <a
            href={projectHomepage}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            Live Demo
          </a>
        )}
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
          Interested in collaborating or just want to say hi? Feel free to reach
          out!
        </p>

        <div className="contact-links">
          <a
            href={user?.html_url || "https://github.com/adam-olser"}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link"
          >
            <span className="icon">🐙</span>
            GitHub
          </a>
          <a href="mailto:adam.olser@gmail" className="contact-link">
            <span className="icon">📧</span>
            Email
          </a>
          <a
            href="https://linkedin.com/in/adam-olser"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link"
          >
            <span className="icon">💼</span>
            LinkedIn
          </a>
        </div>

        {user?.location && (
          <p className="location">📍 Based in {user.location}</p>
        )}
      </div>
    </section>
  );
}

export default App;
