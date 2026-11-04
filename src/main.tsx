import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import 'lenis/dist/lenis.css'
import './index.css'
import App from './App.tsx'

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)
// Hydrate the prerendered page; the dev server has no prerender, so mount normally there.
if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)
