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

interface Skill {
  name: string;
  years: number;
  level: string;
  fromRepo: boolean;
}

interface SkillCategory {
  category: string;
  skills: Skill[];
}

export const detectTechnologiesFromRepos = (
  repos: Repository[]
): Set<string> => {
  return repos.reduce((acc: Set<string>, repo) => {
    // Add primary language
    if (repo.language) acc.add(repo.language);

    // Map repository topics to skill names
    repo.topics.forEach((topic) => {
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
};

export const getSkillCategories = (
  detectedTechs: Set<string>
): SkillCategory[] => {
  return [
    {
      category: "Frontend & Testing",
      skills: [
        {
          name: "JavaScript",
          years: 6,
          level: "Expert",
          fromRepo: detectedTechs.has("JavaScript"),
        },
        {
          name: "TypeScript",
          years: 5,
          level: "Advanced",
          fromRepo: detectedTechs.has("TypeScript"),
        },
        {
          name: "React.js",
          years: 6,
          level: "Expert",
          fromRepo: detectedTechs.has("React.js"),
        },
        {
          name: "Next.js",
          years: 3,
          level: "Advanced",
          fromRepo: detectedTechs.has("Next.js"),
        },
        {
          name: "CSS/SCSS",
          years: 6,
          level: "Advanced",
          fromRepo: detectedTechs.has("CSS") || detectedTechs.has("SCSS"),
        },
        {
          name: "Jest/Cypress",
          years: 4,
          level: "Advanced",
          fromRepo: detectedTechs.has("Jest/Cypress"),
        },
        {
          name: "Webpack/Vite",
          years: 4,
          level: "Advanced",
          fromRepo: detectedTechs.has("Webpack/Vite"),
        },
        {
          name: "Tailwind CSS",
          years: 2,
          level: "Intermediate",
          fromRepo: detectedTechs.has("Tailwind CSS"),
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
          fromRepo: detectedTechs.has("GraphQL"),
        },
        {
          name: "REST APIs",
          years: 6,
          level: "Expert",
          fromRepo: detectedTechs.has("REST APIs"),
        },
        {
          name: "Node.js",
          years: 4,
          level: "Intermediate",
          fromRepo: detectedTechs.has("Node.js"),
        },
        {
          name: "Python",
          years: 3,
          level: "Intermediate",
          fromRepo: detectedTechs.has("Python"),
        },
        {
          name: "OAuth 2.0",
          years: 3,
          level: "Advanced",
          fromRepo: detectedTechs.has("OAuth 2.0"),
        },
        {
          name: "JWT",
          years: 3,
          level: "Advanced",
          fromRepo: detectedTechs.has("JWT"),
        },
        {
          name: "PostgreSQL",
          years: 4,
          level: "Advanced",
          fromRepo: detectedTechs.has("PostgreSQL"),
        },
        {
          name: "Redis",
          years: 2,
          level: "Intermediate",
          fromRepo: detectedTechs.has("Redis"),
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
            detectedTechs.has("AWS") || detectedTechs.has("Google Cloud"),
        },
        {
          name: "Docker",
          years: 3,
          level: "Advanced",
          fromRepo: detectedTechs.has("Docker"),
        },
        {
          name: "Kubernetes",
          years: 2,
          level: "Intermediate",
          fromRepo: detectedTechs.has("Kubernetes"),
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
          fromRepo: detectedTechs.has("GitHub Actions"),
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
          fromRepo: detectedTechs.has("ESLint/Prettier"),
        },
        { name: "Postman", years: 4, level: "Advanced", fromRepo: false },
        { name: "Figma", years: 3, level: "Intermediate", fromRepo: false },
      ],
    },
  ];
};
