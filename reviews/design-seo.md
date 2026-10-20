# Design and SEO review: Markdown to PDF
Reviewer: Miranda (independent). Date: 2026-10-20. Built to dist-design, served on port 4516, viewed at 1280 and 390, light and dark. Server stopped and temp build removed.

## Scores (Lighthouse, local static server)
| Run | Performance | Accessibility | Best practices | SEO |
|---|---|---|---|---|
| Mobile | 99 | 97 | 100 | 100 |
| Desktop | 100 | 97 | 100 | 100 |

LCP 1.7 s mobile, 0.4 s desktop. CLS 0. TBT 50 ms mobile. Page weight: HTML 6.8 KB gzip, CSS 5.5 KB gzip, tool JS 68 KB gzip (204 KB raw, includes DOMPurify, marked, highlight.js). The "long cache TTL" audit comes from the test server, not the site: `_headers` already sets immutable caching for /_astro/*.
Unit tests: 25 passed. PDF print check: the Download path produced a one-page text PDF with a correct table, highlighted code, footnote and task list.

## Verdict
Clearly better than the competitors in the research on the points that matter: no upload, no watermark, no daily cap, real text PDF, themes, paper, margins, page count, clean mobile stack. One real defect (table preview) must be fixed before launch. Gaps against markdowntopdf.com: no table of contents, Mermaid or math (the research listed these as the gap to beat).

## Must-fix count: 1

## Findings
| # | Severity | Area | Finding | Fix |
|---|---|---|---|---|
| 1 | Must | Preview, tables | A table with 6 or more columns breaks words one letter per line in the preview ("a l p h a / o n e") on phone and desktop. Cause: `.md-doc { overflow-wrap: anywhere }` lets columns shrink to one character, and the sheet is narrower than the printable width. Print output is fine. | In `doc.css` change to `overflow-wrap: break-word` and keep `anywhere` only on `pre` and links. Wrap each table in a scroll container for the preview (min-width per cell, `overflow-x:auto`), and unwrap it under `@media print`. |
| 2 | Should | Preview fidelity | The preview sheet is the width of its box (about 300 px on a phone, 480 px on desktop), not the printable width (6.5 to 7 in). Line breaks, tables and wrapping differ from the PDF. The page count is measured at the true width, so it can disagree with what the user sees. | Lay out the sheet at the real width (paper width minus margins, 96 px per inch) and scale it down to fit with CSS `zoom` or a transform. Show page breaks as faint lines. This also fixes finding 1. |
| 3 | Should | Data loss | Clear and Sample replace the text in one tap, with no confirm and no undo. The draft is also overwritten in local storage. On a phone, a mis-tap loses the document. | Add an Undo toast (10 s) or a confirm when the text has more than about 200 characters. Keep the last text in memory for Undo. |
| 4 | Should | Phone use | The Download button sits above the editor. After typing in a 288 px textarea the user scrolls back up through the options to download. Two nested scroll areas (textarea and preview) can trap the thumb. | Make Download a sticky bottom bar on phones (safe-area padding), and hide it while the keyboard is open. Raise the preview height or let it grow with content on phones. |
| 5 | Should | Accessibility | Lighthouse "label" fails (97 score): the task list checkboxes in the preview have no accessible name. They are also drawn grey and low contrast. | Render them as `aria-hidden` icons (span with a check glyph) or add `aria-label` from the item text. Use a darker `accent-color` (#111). |
| 6 | Should | SEO, links | The 714-word article has no internal links. The About, Privacy, Terms and Contact links appear twice (under the tool and in the footer) and are 17 px tall. | Add two natural in-text links, for example to Privacy ("no upload") and Contact. Remove the duplicate row under the tool or give those links a 44 px tap area. |
| 7 | Should | Competitive gap | No table of contents option, Mermaid or math. The research names these as the gap against markdowntopdf.com. | Queue after launch: a "Table of contents" switch first (cheap), Mermaid and math later behind a lazy import so the 68 KB gzip budget holds. |
| 8 | Could | Title and keyword | Title "Markdown to PDF Converter: Free, No Upload" (42 chars) is good. The domain keyword "online" appears nowhere in the title or H1. | Optional: "Markdown to PDF Converter Online: Free, No Upload" (49 chars). |
| 9 | Could | Logo | The icon is a generic "download file" glyph. It does not say Markdown and looks like many PDF tools at 16 px. | Add a small "M" or "#" mark on the page, or an "MD" corner label. |
| 10 | Could | Schema | WebApplication JSON-LD parses and is valid. It has no `image`, `screenshot` or `featureList`. FAQPage JSON-LD parses, 8 questions, answers match the page text. | Add `featureList` (tables, task lists, footnotes, code highlighting, A4 and Letter) and `image: /og.png`. |
| 11 | Could | Copy | Tip says images "need a web address that allows hotlinking". An image URL makes the browser request a third-party server, which sits next to the "nothing leaves your device" claim. | One sentence in the FAQ privacy answer: "Images you link load from their own server." |
| 12 | Could | Dark mode | Preview sheet stays white on the dark page (correct, it mirrors the PDF). The glare is strong at night. | Optional: dim the sheet with `filter: brightness(.92)` in dark mode, off for print. |
| 13 | Could | Nav on phone | The "Tool" link is hidden below 420 px and About/Contact are 36 px tall. | Raise nav links to 44 px height. |
| 14 | Info | Page numbers | Footer page numbers use `@page @bottom-center`, which Safari and Firefox ignore. The page says so in the tips and FAQ. | Acceptable. Consider a one-line notice next to the checkbox in those browsers. |

## Checks that passed
- Hierarchy: one H1 ("Markdown to PDF"), then H2 outline: Preview, Convert Markdown to PDF in your browser, How to convert, What Markdown does this converter support, A worked example, Paper sizes and margins, Why use this converter, Tips, FAQ. No skipped levels. The H2 "Preview" before the article H2 is fine.
- Meta: description 148 chars, canonical correct per page, OG and Twitter tags complete, OG image 1200x630 and readable, theme-color set, manifest and icons present, 404 has noindex, `_headers` noindexes pages.dev.
- Sitemap lists 5 URLs (home, about, contact, privacy, terms), robots.txt points to it.
- Article depth: 714 words of article plus 8 FAQ answers. Main phrase in the first paragraph and in an H2. Table of supported syntax and a worked example help the main query.
- Accessibility: skip link, visible focus (2 px brand outline), labelled selects and textarea, `role=status` for the status line, preview region focusable, reduced-motion respected, contrast audit clean in both themes.
- Layout: no horizontal scroll at 390 (scrollWidth 390), CLS 0, tool area reserves height.
- Safety: script tags, `onerror` and `javascript:` links were removed from the preview with the stress test. Empty input shows "Add some Markdown first, then download."
- Spacing, type and colour: consistent, warm paper background, one brand colour, good button size (48 px download, 44 px controls). Dark mode correct on all sections.
