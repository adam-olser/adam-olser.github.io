// Bake the rendered page into dist/index.html so crawlers that skip JavaScript see real content.
// The client still mounts with createRoot, which replaces this markup with the live app.
import { createServer } from 'vite';
import { readFileSync, writeFileSync } from 'node:fs';

const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
const { render } = await vite.ssrLoadModule('/src/entry-server.tsx');
const html = render();
await vite.close();

const file = 'dist/index.html';
const page = readFileSync(file, 'utf8');
if (!page.includes('<div id="root"></div>')) throw new Error('prerender: root placeholder not found');
writeFileSync(file, page.replace('<div id="root"></div>', `<div id="root">${html}</div>`));
console.log(`prerendered ${(html.length / 1024).toFixed(1)} kB of HTML into ${file}`);
