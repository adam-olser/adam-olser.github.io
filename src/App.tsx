import { useState, useEffect } from 'react'
import './App.css'

interface Repository {
  id: number
  name: string
  description: string | null
  html_url: string
  homepage: string | null
  topics: string[]
  language: string | null
  stargazers_count: number
  forks_count: number
  created_at: string
  updated_at: string
  archived: boolean
}

interface GitHubUser {
  login: string
  name: string
  bio: string | null
  location: string | null
  blog: string | null
  followers: number
  following: number
  public_repos: number
  avatar_url: string
  html_url: string
}

function App() {
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [user, setUser] = useState<GitHubUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        // Fetch user profile
        const userResponse = await fetch('https://api.github.com/users/adam-olser')
        const userData = await userResponse.json()
        setUser(userData)

        // Fetch repositories
        const reposResponse = await fetch('https://api.github.com/users/adam-olser/repos?sort=updated&per_page=100')
        const reposData = await reposResponse.json()
        
        // Filter out forks and sort by stars and recent activity
        const filteredRepos = reposData
          .filter((repo: Repository) => !repo.archived)
          .sort((a: Repository, b: Repository) => {
            return b.stargazers_count - a.stargazers_count || 
                   new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          })

        setRepositories(filteredRepos)
      } catch (error) {
        console.error('Error fetching GitHub data:', error)
      } finally {
        setLoading(false)
      }
    }

    // Initial fetch
    fetchGitHubData()

    // Set up auto-refresh every 5 minutes to get latest repository updates
    const refreshInterval = setInterval(fetchGitHubData, 5 * 60 * 1000)

    // Refresh data when the page becomes visible again (user switches tabs)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchGitHubData()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Cleanup
    return () => {
      clearInterval(refreshInterval)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  if (loading) {
    return (
      <div className="loading">
        <div className="loader"></div>
        <p>Loading portfolio...</p>
      </div>
    )
  }

  return (
    <div className="App">
      <Header user={user} />
      <About user={user} />
      <Projects repositories={repositories} />
      <Contact user={user} />
    </div>
  )
}

function Header({ user }: { user: GitHubUser | null }) {
  return (
    <header className="hero">
      <div className="hero-content">
        <div className="profile-image">
          <img src={user?.avatar_url || '/header.jpg'} alt="Adam Olser" />
        </div>
        <h1>Adam Olšer</h1>
        <p className="tagline">Software Engineer at Kiwi.com</p>
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
          <a href="#projects" className="btn btn-primary">View Projects</a>
          <a href={user?.html_url || 'https://github.com/adam-olser'} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
            GitHub Profile
          </a>
        </div>
      </div>
      <div className="scroll-indicator">
        <div className="scroll-arrow"></div>
      </div>
    </header>
  )
}

function About({ user }: { user: GitHubUser | null }) {
  const achievements = [
    { name: 'Pull Shark', description: 'Contributed to multiple open source projects' },
    { name: 'Arctic Code Vault Contributor', description: 'Code preserved in GitHub Archive Program' }
  ]

  const skills = [
    'JavaScript', 'TypeScript', 'React.js', 'CSS Frameworks', 
    'GraphQL', 'REST APIs', 'Relay', 'Node.js', 'Travel Tech'
  ]

  return (
    <section className="about">
      <div className="container">
        <h2>About Me</h2>
        <div className="about-grid">
          <div className="about-text">
            <p>
              {user?.bio || 'Dedicated and self-motivated professional with more than 5 years of experience in Engineering with a background in travel and customer retention. Proficient with JavaScript, TypeScript, React.js, CSS frameworks, GraphQL, REST APIs, and Relay with strong communication and analytical thinking skills.'}
            </p>
            <p>
              Currently working as a <strong>Software Engineer at Kiwi.com</strong>, building innovative travel technology solutions that help millions of travelers worldwide.
            </p>
            <div className="skills">
              <h3>Technologies & Skills</h3>
              <div className="skill-tags">
                {skills.map(skill => (
                  <span key={skill} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="achievements">
            <h3>GitHub Achievements</h3>
            {achievements.map(achievement => (
              <div key={achievement.name} className="achievement">
                <h4>{achievement.name}</h4>
                <p>{achievement.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Projects({ repositories }: { repositories: Repository[] }) {
  const featuredProjects = [
    'qr-studio',
    'smart-brain', 
    'react-music-player',
    'dapp-chat'
  ]

  const featured = repositories.filter(repo => 
    featuredProjects.includes(repo.name)
  )

  const other = repositories.filter(repo => 
    !featuredProjects.includes(repo.name) && repo.name !== 'adam-olser.github.io'
  ).slice(0, 6)

  return (
    <section id="projects" className="projects">
      <div className="container">
        <h2>Featured Projects</h2>
        <div className="projects-grid featured">
          {featured.map(repo => (
            <ProjectCard key={repo.id} repo={repo} featured />
          ))}
        </div>
        
        {other.length > 0 && (
          <>
            <h2>Other Projects</h2>
            <div className="projects-grid">
              {other.map(repo => (
                <ProjectCard key={repo.id} repo={repo} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}

function ProjectCard({ repo, featured = false }: { repo: Repository; featured?: boolean }) {
  const getProjectDescription = (name: string, description: string | null) => {
    const descriptions: Record<string, string> = {
      'qr-studio': 'QR code generator with advanced styling and logo integration',
      'smart-brain': 'AI-powered face detection app with user authentication',
      'react-music-player': 'Modern music player built with React',
      'dapp-chat': 'Decentralized chat application'
    }
    return descriptions[name] || description || 'A cool project built with passion'
  }

  return (
    <div className={`project-card ${featured ? 'featured' : ''}`}>
      <div className="project-header">
        <h3>{repo.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h3>
        <div className="project-stats">
          <span className="stars">⭐ {repo.stargazers_count}</span>
          <span className="forks">🍴 {repo.forks_count}</span>
        </div>
      </div>
      
      <div className="project-content">
        <p className="project-description">
          {getProjectDescription(repo.name, repo.description)}
        </p>
        
        <div className="project-tech">
          {repo.language && <span className="tech-tag primary">{repo.language}</span>}
          {repo.topics.slice(0, 3).map(topic => (
            <span key={topic} className="tech-tag">{topic}</span>
          ))}
        </div>
        
        <div className="project-links">
          <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
            View Code
          </a>
          {repo.homepage && (
            <a href={repo.homepage} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              Live Demo
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

function Contact({ user }: { user: GitHubUser | null }) {
  return (
    <section className="contact">
      <div className="container">
        <h2>Let's Connect</h2>
        <p>Interested in collaborating or just want to say hi? Feel free to reach out!</p>
        
        <div className="contact-links">
          <a href={user?.html_url || 'https://github.com/adam-olser'} target="_blank" rel="noopener noreferrer" className="contact-link">
            <span className="icon">🐙</span>
            GitHub
          </a>
          <a href="mailto:contact@adamolser.dev" className="contact-link">
            <span className="icon">📧</span>
            Email
          </a>
          <a href="https://www.linkedin.com/in/adam-ol%C5%A1er-633027142/" target="_blank" rel="noopener noreferrer" className="contact-link">
            <span className="icon">💼</span>
            LinkedIn
          </a>
        </div>
        
        <p className="location">📍 Based in {user?.location || 'Brno, Czech Republic'}</p>
      </div>
    </section>
  )
}

export default App