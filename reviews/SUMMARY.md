# Fix summary (Gamora, 2026-10-20)

## Fixed
- TOC and anchor links: `[Install](#install)` now points to the heading id (`md-install`) in the preview and in the PDF (checked: PDF has working link destinations). Test added.
- PDF file name: set from the first H1 (setext, closing hashes, markup removed; front matter `title:` as fallback; "document" otherwise; unsafe characters removed, 80 chars max). Verified in a real PDF (metadata title). Tests added.
- YAML front matter stripped (also CRLF and BOM; a leading `---` rule is not treated as front matter).
- `<details>` open in print.
- Wide tables: `overflow-wrap: anywhere` replaced by `break-word`; on a phone the table scrolls sideways. The preview sheet now has the real page width (paper minus margins), scaled to fit, so Paper and Margins change the preview and line breaks match the PDF.
- `render()`: try/catch (`tryRender`), error shown in the preview and status, Download refuses stale output, input debounced (150 ms, 500 ms for large text), 5 MB text limit, page count measured separately and re-measured when images load, duplicate ids removed from the measuring copy.
- Phone: Download is a sticky bottom bar (safe-area padding, hidden while typing and when the tool is off screen). iPhone/iPad and Android steps added under the tool.
- Page break: a line with only `<!-- pagebreak -->`, `\pagebreak` or `\newpage` (not inside code fences). Dashed "Page break" line in the preview. Trailing break removed to avoid a blank last page.
- Other accepted: loose task list bullets, footnote link selectors, dead CSS removed, Undo after Sample, Clear and file open (button renamed "Load sample"), file type and binary checks, drop outside the box no longer leaves the page, external links open in a new tab, non-checkbox inputs removed, checkbox accessible names (Lighthouse a11y 100), count line no longer a live region, 12 more sanitizer vectors tested, wrong "600 words, two pages" text corrected, "left box" wording, internal links in the article, FAQ privacy note about linked images, two FAQ entries (page break/TOC, file name), title now "Markdown to PDF Converter Online: Free, No Upload", JSON-LD `image` and `featureList` (and `<` escaped in JSON-LD), nav tap targets 44 px, owner name, `engines`, dark-mode sheet dimmed.
- Template items: README rewritten for this tool; US spelling (color); Privacy and Terms "Last updated: October 20, 2026"; Privacy no longer claims a cookie banner (Google's consent message when ads are on); local `playwright-core` import in make-icons; `scripts/new-tool.sh` removed; `screenshots/` and `.playwright-cli/` untracked and ignored (also `dist-*`, `tmp-*`); duplicate legal link block removed from the home page; `deploy` runs `npm test` first.
- Tailwind scan limited to src (`source(none)` plus `@source "../"`). Built CSS before 29,274 B raw (23,862 + 5,412), after 30,198 B (24,012 + 6,186); the small rise is the new features. Tool script 204,340 B to 208,936 B raw.
- GitHub Pages: `PAGES_BASE` and `PAGES_SITE` read in `astro.config.mjs`; all links, icons, manifest (relative paths) use the base; canonical always the real domain; `.github/workflows/pages.yml` added (checkout@v4, setup-node@v4 node 22, npm ci, npm test, build with the Pages env, upload-pages-artifact@v3, deploy-pages@v4). Built with `PAGES_BASE=/markdown-to-pdf/` into `dist-pages`, served under `/markdown-to-pdf/`, clicked home, about, privacy, terms and checked icons, manifest, sitemap, 404 (all 200). `dist-pages` deleted. Branch is `main`. Not pushed.

## Rejected, with reasons
- CSP header: GA and AdSense hosts are not decided yet. Do it when they are.
- Tab key to indent in the editor: traps keyboard focus (accessibility).
- Build the option lists from `MARGINS`/`SIZES`: a comment now says to keep them in sync; not worth the indirection.
- Rename "theme" to "pdfTheme": churn for little gain.
- Drop highlight.js languages, remove `<meta keywords>`, drop `wrangler`/Tailwind: template-level, out of scope here.
- Auto table of contents, Mermaid, math: new features that grow the tool. Queued below.

## Status
- `npm test`: 45 pass. `npm run build`: ok.
- Lighthouse (desktop, local): performance 99, accessibility 100, best practices 100, SEO 100.
- Screenshots (not tracked): `screenshots/home-1280-light.png`, `home-1280-dark.png`, `home-390-light.png`, `home-390-dark.png`.
- Not tested: real iOS Safari print flow and the iOS wording of the steps (checked only in headless Chrome). Port 4512 was already in use by something else; I used 4511 and 4513.

## Left for the owner
- Check the iPhone steps on a real phone.
- Decide on: "keep my line breaks" switch (note-takers ask for it), auto table of contents option, header/footer text.
- Safari and Firefox still ignore page numbers (`@page` margin boxes); the FAQ says so.

## Phase 2 SEO pages (not built)
1. markdown to pdf with table of contents
2. readme to pdf
3. md to pdf online
4. convert .md file to pdf
5. github markdown to pdf
6. markdown to pdf with code highlighting
7. markdown to pdf with tables
8. markdown to pdf without watermark
9. markdown to pdf no upload
10. markdown to pdf on iphone
11. markdown to pdf on android
12. markdown to pdf a4
13. markdown to pdf letter size
14. markdown resume to pdf
15. markdown notes to pdf
16. obsidian note to pdf
17. markdown to pdf with page breaks
18. markdown to pdf with page numbers
19. markdown to pdf with images
20. chatgpt markdown to pdf
