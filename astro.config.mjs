import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import site from './src/site.config.ts';

// Normal build: served at the domain root. GitHub Pages build:
// PAGES_BASE=/markdown-to-pdf/ PAGES_SITE=https://abhimishra01.github.io npx astro build
const base = process.env.PAGES_BASE || '/';

export default defineConfig({
  site: process.env.PAGES_SITE || `https://${site.domain}`,
  base,
  output: 'static',
  trailingSlash: 'always',
  compressHTML: true,
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
});
