import { useState, useEffect } from "react";
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
        <div className="loader"></div>
        <p>Loading portfolio...</p>
      </div>
    );
  }

  return (
    <div className="App">
      <Header user={user} />
      <About user={user} />
      <Projects repositories={repositories} />
      <Contact user={user} />
    </div>
  );
}

function Header({ user }: { user: GitHubUser | null }) {
  return (
    <header className="hero">
      <div className="hero-content">
        <div className="profile-image">
          <img src={user?.avatar_url || "/header.jpg"} alt="Adam Olser" />
        </div>
        <h1>Adam Olšer</h1>
        <p className="tagline">
          Frontend-focused Software Engineer at Kiwi.com
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
        <div className="scroll-arrow"></div>
      </div>
    </header>
  );
}

function About({ user }: { user: GitHubUser | null }) {
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
    "JavaScript",
    "TypeScript",
    "React.js",
    "Next.js",
    "GraphQL",
    "REST APIs",
    "Node.js",
    "OAuth 2.0",
    "Payment Systems",
    "AWS/GCP",
    "Jest/Cypress",
    "PCI DSS",
  ];

  return (
    <section className="about">
      <div className="container">
        <h2>About Me</h2>
        <div className="about-grid">
          <div className="about-text">
            <p>
              {user?.bio ||
                "Frontend-focused Software Engineer with 6+ years of experience building high-performance web and mobile applications across international teams. Specialized in React.js, TypeScript, and Next.js with full-stack capabilities. Successfully architected authentication systems and designed user management interfaces scaling to millions of users."}
            </p>
            <p>
              Currently working as a{" "}
              <strong>Software Engineer at Kiwi.com</strong> in Barcelona, where
              I lead development of critical user-facing systems including
              authentication APIs, payment processing, and security
              implementations. Passionate mentor who guides junior developers to
              achieve technical excellence.
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
        <h3>
          {repo.name
            .replace(/-/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase())}
        </h3>
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
              Live Demo
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
          <a href="mailto:adamolser@gmail.com" className="contact-link">
            <span className="icon">📧</span>
            Email
          </a>
          <a
            href="https://www.linkedin.com/in/adam-ol%C5%A1er-633027142/"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link"
          >
            <span className="icon">💼</span>
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
