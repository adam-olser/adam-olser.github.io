# adam-olser.github.io

Personal portfolio — [adam-olser.github.io](https://adam-olser.github.io)

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v3
- three.js for the hero canvas (loaded lazily), Lenis for smooth scrolling
- Prerendered at build time (`scripts/prerender.mjs`) so crawlers see real HTML

## Development

```bash
npm install
npm run dev
```

## Deployment

Pushes to `main` trigger a GitHub Actions build and deploy to GitHub Pages.
