import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { rmSync } from 'node:fs';
import site from './src/site.config.ts';

// SITE_MODE=bingemind builds the public copy for bingemind.com/<slug>/ (indexable, no root files).
const bingemind = process.env.SITE_MODE === 'bingemind';
const slug = 'markdown-to-pdf';
// The Bingemind root owns robots.txt, ads.txt and the host headers file: drop ours in that mode.
const dropRootFiles = {
  name: 'drop-root-files',
  hooks: {
    'astro:build:done': ({ dir }) => {
      if (!bingemind) return;
      for (const f of ['robots.txt', 'ads.txt', '_headers']) rmSync(new URL(f, dir), { force: true });
    },
  },
};

// Normal build: served at the domain root. GitHub Pages build:
// PAGES_BASE=/markdown-to-pdf/ PAGES_SITE=https://abhimishra01.github.io npx astro build

export default defineConfig({
  site: process.env.PAGES_SITE || 'https://bingemind.com',
  base: process.env.PAGES_BASE || (bingemind ? `/${slug}/` : '/'),
  output: 'static',
  trailingSlash: 'always',
  compressHTML: true,
  integrations: [sitemap(), dropRootFiles],
  vite: { plugins: [tailwindcss()], define: { 'import.meta.env.SITE_MODE': JSON.stringify(process.env.SITE_MODE || '') } },
});
