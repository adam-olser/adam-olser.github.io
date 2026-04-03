import { useState, useEffect } from 'react';

export interface Repository {
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
  fork: boolean;
}

export interface GitHubUser {
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

const TIMEOUT_MS = 8000;

function fetchWithTimeout(url: string): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), TIMEOUT_MS);
  return fetch(url, { signal: controller.signal }).finally(() => clearTimeout(id));
}

export function useGitHub() {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        const [userResponse, reposResponse] = await Promise.all([
          fetchWithTimeout('https://api.github.com/users/adam-olser'),
          fetchWithTimeout('https://api.github.com/users/adam-olser/repos?sort=updated&per_page=100'),
        ]);

        if (!userResponse.ok || !reposResponse.ok) {
          throw new Error(`GitHub API error: ${userResponse.status} / ${reposResponse.status}`);
        }

        const userData: GitHubUser = await userResponse.json();
        const reposData: Repository[] = await reposResponse.json();

        setUser(userData);
        setRepositories(
          reposData
            .filter((repo) => !repo.archived && !repo.fork)
            .sort((a, b) =>
              b.stargazers_count - a.stargazers_count ||
              new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
            )
        );
        setError(false);
      } catch (err) {
        console.error('Error fetching GitHub data:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubData();

    const refreshInterval = setInterval(fetchGitHubData, 5 * 60 * 1000);
    const handleVisibilityChange = () => {
      if (!document.hidden) fetchGitHubData();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(refreshInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return { user, repositories, loading, error };
}
