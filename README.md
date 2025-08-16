# Adam Olser - Developer Portfolio

A modern, responsive portfolio website built with React and TypeScript that automatically fetches and displays GitHub repositories.

## ✨ Features

- **Auto-updating Projects**: Automatically fetches your latest GitHub repositories via GitHub API
- **Responsive Design**: Looks great on desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional design with smooth animations
- **Performance Optimized**: Built with Vite for fast loading and optimal performance
- **SEO Ready**: Includes meta tags for search engines and social media sharing
- **Auto-refresh**: Updates repository data every 5 minutes and when page regains focus
- **GitHub Integration**: Displays profile stats, achievements, and repository information

## 🚀 Live Demo

Visit the live portfolio at: https://adam-olser.github.io

## 🛠️ Technologies Used

- **Frontend**: React 19, TypeScript
- **Build Tool**: Vite
- **Styling**: Modern CSS with CSS Grid and Flexbox
- **Deployment**: GitHub Pages with GitHub Actions
- **APIs**: GitHub REST API for repository data

## 🎯 Highlighted Projects

The portfolio automatically features these key projects:

- **QR Studio**: QR code generator with advanced styling and logo integration
- **Smart Brain**: AI-powered face detection app with user authentication
- **React Music Player**: Modern music player built with React
- **DApp Chat**: Decentralized chat application

## 🔧 Development Setup

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/adam-olser/adam-olser.github.io.git
cd adam-olser.github.io
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open http://localhost:5173 in your browser

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## 📱 Auto-Update Features

The portfolio includes several mechanisms to keep project data fresh:

1. **Periodic Refresh**: Automatically fetches new data every 5 minutes
2. **Visibility API**: Refreshes when you return to the tab
3. **Smart Sorting**: Projects are sorted by stars and recent activity
4. **Real-time Stats**: GitHub profile stats update automatically

## 🚀 Deployment

### Automatic Deployment

The repository is configured with GitHub Actions for automatic deployment:

1. Push to `main` or `master` branch
2. GitHub Actions automatically builds and deploys to GitHub Pages
3. Your portfolio will be live at `https://adam-olser.github.io`

### Manual Deployment

If you prefer manual deployment:

1. Build the project:

```bash
npm run build
```

2. The built files will be in the `dist` directory

### GitHub Pages Setup

1. Go to repository Settings → Pages
2. Set Source to "GitHub Actions"
3. The workflow will handle the rest automatically

## 🎨 Customization

### Updating Profile Information

The portfolio automatically fetches data from your GitHub profile, but you can customize:

1. **Featured Projects**: Edit the `featuredProjects` array in `App.tsx`
2. **Skills**: Update the `skills` array in the About component
3. **Achievements**: Modify the `achievements` array
4. **Contact Links**: Update the Contact component with your preferred links

### Styling

The portfolio uses modern CSS with CSS custom properties (variables) for easy theming:

- Colors and themes are defined in `:root` in `App.css`
- Supports automatic dark mode based on user preference
- Responsive breakpoints for mobile-first design

### API Customization

To use with a different GitHub username:

1. Replace `'adam-olser'` in the API calls within `App.tsx`
2. Update meta tags in `index.html`
3. Update repository name in deployment configuration

## 🔒 Privacy & Rate Limits

- Uses GitHub's public API (no authentication required)
- Respects GitHub's rate limits (60 requests per hour for unauthenticated requests)
- Only fetches public repository and profile information
- No personal data is stored or tracked

## 📊 Performance

- Lighthouse Score: 90+ across all metrics
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📧 Contact

- **GitHub**: [@adam-olser](https://github.com/adam-olser)
- **Email**: contact@adamolser.dev
- **Portfolio**: https://adam-olser.github.io

---

Built with ❤️ using React, TypeScript, and modern web technologies.
