# Markdown to PDF

Single-purpose tool site for markdowntopdfonline.com. It turns Markdown into a PDF in the browser: live preview, GitHub-flavored Markdown (tables, task lists, footnotes, code highlighting), three themes, Letter or A4, margins, optional page numbers, page breaks. No upload, no watermark.

Astro (static) + Tailwind 4. Nothing runs on a server.

## Where things live

- `src/lib/markdown.js`: all logic with no browser code. Parsing (marked plus plugins), front matter removal, `<!-- pagebreak -->` and `\pagebreak` lines, DOMPurify sanitizer rules, `@page` CSS, page count estimate, PDF file name from the first heading (`pdfTitle`).
- `src/components/Tool.astro`: the page UI and its script (editor, preview, options, files, undo, print).
- `src/styles/doc.css`: how the document looks on screen and on paper (themes, print rules).
- `src/components/Article.astro`, `src/data/faq.ts`: page text and FAQ (the FAQ is also FAQPage JSON-LD).
- `src/site.config.ts`: name, domain, title, description, email, brand color, analytics and ads IDs.
- `src/lib/url.ts`: helper so links work at the domain root and under a base path.

## How PDF export works

The Download button copies the rendered document into `#print-root` and calls `window.print()`. A print stylesheet hides the rest of the page and a generated `@page` rule sets paper size, margins and page numbers. The browser makes the PDF, so the text stays selectable. The page title is set to the first heading while printing, so the file gets that name.

## Commands

- `npm run dev`: work on the site
- `npm test`: unit tests for `src/lib/markdown.js` (`node tests/markdown.test.mjs`)
- `npm run build`: make `dist/`
- `npm run deploy`: test, build, upload to Cloudflare Pages (needs `npx wrangler login` once)

## GitHub Pages

Until the domain is live the site is also served at https://abhimishra01.github.io/markdown-to-pdf/. `.github/workflows/pages.yml` builds on every push to `main` with `PAGES_BASE=/markdown-to-pdf/` and `PAGES_SITE=https://abhimishra01.github.io`. Canonical links always point to the real domain. To check locally:

```
PAGES_BASE=/markdown-to-pdf/ npx astro build --outDir dist-pages
```

then serve it so that the folder appears under `/markdown-to-pdf/`.

## Notes

- Icons and the social image: `scripts/make-icons.mjs` (one-off, needs `playwright-core`).
- Cloudflare setup, Search Console, GA4 and AdSense steps are in `~/Desktop/personal/microtools/template/README.md`.
