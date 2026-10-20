// Core logic for Markdown to PDF. Plain JS so node can test it without a browser.
import { Marked } from 'marked';
import markedFootnote from 'marked-footnote';
import { markedHighlight } from 'marked-highlight';
import { gfmHeadingId } from 'marked-gfm-heading-id';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import python from 'highlight.js/lib/languages/python';
import bash from 'highlight.js/lib/languages/bash';
import json from 'highlight.js/lib/languages/json';
import yaml from 'highlight.js/lib/languages/yaml';
import css from 'highlight.js/lib/languages/css';
import xml from 'highlight.js/lib/languages/xml';
import sql from 'highlight.js/lib/languages/sql';
import go from 'highlight.js/lib/languages/go';
import rust from 'highlight.js/lib/languages/rust';
import java from 'highlight.js/lib/languages/java';
import c from 'highlight.js/lib/languages/c';
import cpp from 'highlight.js/lib/languages/cpp';
import csharp from 'highlight.js/lib/languages/csharp';
import ruby from 'highlight.js/lib/languages/ruby';
import php from 'highlight.js/lib/languages/php';
import diff from 'highlight.js/lib/languages/diff';
import markdown from 'highlight.js/lib/languages/markdown';
import kotlin from 'highlight.js/lib/languages/kotlin';
import swift from 'highlight.js/lib/languages/swift';
import dockerfile from 'highlight.js/lib/languages/dockerfile';
import ini from 'highlight.js/lib/languages/ini';

const LANGS = { javascript, typescript, python, bash, json, yaml, css, xml, sql, go, rust, java, c, cpp, csharp, ruby, php, diff, markdown, kotlin, swift, dockerfile, ini };
for (const [name, def] of Object.entries(LANGS)) hljs.registerLanguage(name, def);
hljs.registerAliases(['js', 'jsx', 'mjs'], { languageName: 'javascript' });
hljs.registerAliases(['ts', 'tsx'], { languageName: 'typescript' });
hljs.registerAliases(['py'], { languageName: 'python' });
hljs.registerAliases(['sh', 'shell', 'zsh', 'console'], { languageName: 'bash' });
hljs.registerAliases(['html', 'svg'], { languageName: 'xml' });
hljs.registerAliases(['yml'], { languageName: 'yaml' });
hljs.registerAliases(['golang'], { languageName: 'go' });
hljs.registerAliases(['rs'], { languageName: 'rust' });
hljs.registerAliases(['cs'], { languageName: 'csharp' });
hljs.registerAliases(['rb'], { languageName: 'ruby' });
hljs.registerAliases(['kt'], { languageName: 'kotlin' });
hljs.registerAliases(['md'], { languageName: 'markdown' });
hljs.registerAliases(['docker'], { languageName: 'dockerfile' });
hljs.registerAliases(['toml'], { languageName: 'ini' });

export function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function highlightCode(code, lang) {
  const name = (lang || '').trim().split(/\s+/)[0].toLowerCase();
  if (name && hljs.getLanguage(name)) {
    try { return hljs.highlight(code, { language: name, ignoreIllegals: true }).value; } catch { /* fall through */ }
  }
  return escapeHtml(code);
}

const marked = new Marked(
  { gfm: true, breaks: false },
  markedHighlight({ langPrefix: 'hljs language-', highlight: highlightCode, emptyLangClass: 'hljs' }),
  gfmHeadingId({ prefix: 'md-' }),
  markedFootnote({ prefixId: 'md-fn-', description: 'Footnotes', refMarkers: true }),
);

// Raw HTML from marked. Never put this in the page without sanitizing it.
export function parseMarkdown(src) {
  return marked.parse(String(src ?? ''), { async: false });
}

// Build a sanitizer from a DOMPurify instance (browser window, or jsdom in tests).
export function makeSanitizer(purify) {
  purify.addHook('afterSanitizeAttributes', (node) => {
    if (node.tagName === 'A' && node.getAttribute('href')) {
      const href = node.getAttribute('href');
      if (/^https?:/i.test(href)) node.setAttribute('rel', 'noopener noreferrer');
    }
    if (node.tagName === 'IMG') node.setAttribute('loading', 'eager');
  });
  return (html) => purify.sanitize(html, {
    USE_PROFILES: { html: true },
    FORBID_TAGS: ['style', 'form', 'button', 'textarea', 'select', 'option'],
    FORBID_ATTR: ['style', 'target', 'srcset'],
    ADD_ATTR: ['checked', 'disabled', 'type'],
  });
}

export function renderMarkdown(src, sanitize) {
  return sanitize(parseMarkdown(src));
}

export const PAPERS = {
  letter: { label: 'US Letter', css: '8.5in 11in', widthIn: 8.5, heightIn: 11 },
  a4: { label: 'A4', css: '210mm 297mm', widthIn: 210 / 25.4, heightIn: 297 / 25.4 },
};
export const MARGINS = { narrow: 0.5, normal: 0.75, wide: 1 };
export const SIZES = { small: 10, medium: 11, large: 12 };

// The @page rule that makes the browser print the right paper size and margins.
export function buildPageCss({ paper = 'letter', margin = 'normal', pageNumbers = false } = {}) {
  const p = PAPERS[paper] || PAPERS.letter;
  const m = MARGINS[margin] ?? MARGINS.normal;
  const box = pageNumbers
    ? ` @bottom-center { content: counter(page) " / " counter(pages); font: 9pt system-ui, sans-serif; color: #6b6b73; }`
    : '';
  return `@page { size: ${p.css}; margin: ${m}in;${box} }`;
}

// Rough page count from the rendered height in CSS pixels (96 per inch).
export function estimatePages(contentHeightPx, { paper = 'letter', margin = 'normal' } = {}) {
  const p = PAPERS[paper] || PAPERS.letter;
  const m = MARGINS[margin] ?? MARGINS.normal;
  const usable = (p.heightIn - 2 * m) * 96;
  if (!(contentHeightPx > 0)) return 0;
  return Math.max(1, Math.ceil(contentHeightPx / usable - 1e-9));
}

export function docStats(src) {
  const text = String(src ?? '');
  const words = (text.replace(/```[\s\S]*?```/g, ' ').match(/[\p{L}\p{N}'’-]+/gu) || []).length;
  return { words, chars: text.length, empty: text.trim() === '' };
}

export const SAMPLE = `# Project report

A short sample. Edit this text, or paste your own Markdown. The preview updates as you type.

## Features

- **Bold**, *italic*, ~~strikethrough~~ and \`inline code\`
- Links such as [the CommonMark spec](https://commonmark.org)
- Footnotes[^1]

### Task list

- [x] Write the draft
- [x] Add a table
- [ ] Send to the team

## A table

| Plan   | Seats | Price per month |
|:-------|------:|----------------:|
| Team   |     5 |              $25 |
| Studio |    20 |              $80 |
| Org    |   100 |             $300 |

## Code

\`\`\`js
function total(items) {
  return items.reduce((sum, item) => sum + item.price * item.qty, 0);
}
\`\`\`

\`\`\`python
def greet(name: str) -> str:
    return f"Hello, {name}"
\`\`\`

> A quote stays readable in print, with a bar on the left.

[^1]: A footnote prints at the end of the document.
`;
