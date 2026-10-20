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

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function highlightCode(code, lang) {
  const name = (lang || '').trim().split(/\s+/)[0].toLowerCase();
  if (name && hljs.getLanguage(name)) {
    try { return hljs.highlight(code, { language: name, ignoreIllegals: true }).value; } catch { /* fall through */ }
  }
  return escapeHtml(code);
}

// Emoji shortcodes such as :rocket:. Only names in this list are replaced, so ordinary colons stay as they are.
export const EMOJI = {
  smile: '😄', grin: '😁', joy: '😂', wink: '😉', blush: '😊', heart_eyes: '😍', sunglasses: '😎', thinking: '🤔', neutral_face: '😐', cry: '😢', sob: '😭', scream: '😱', sweat_smile: '😅', rofl: '🤣', slightly_smiling_face: '🙂', upside_down_face: '🙃', hugs: '🤗', yum: '😋', confused: '😕', angry: '😠',
  '+1': '👍', thumbsup: '👍', '-1': '👎', thumbsdown: '👎', clap: '👏', pray: '🙏', wave: '👋', ok_hand: '👌', raised_hands: '🙌', muscle: '💪', point_right: '👉', point_left: '👈', point_up: '☝️', point_down: '👇', eyes: '👀', brain: '🧠',
  heart: '❤️', broken_heart: '💔', blue_heart: '💙', green_heart: '💚', yellow_heart: '💛', purple_heart: '💜', sparkles: '✨', star: '⭐', star2: '🌟', fire: '🔥', boom: '💥', zap: '⚡', tada: '🎉', confetti_ball: '🎊', gift: '🎁', trophy: '🏆', medal: '🏅', crown: '👑', gem: '💎',
  rocket: '🚀', airplane: '✈️', car: '🚗', bike: '🚲', ship: '🚢', train: '🚆', construction: '🚧', rotating_light: '🚨', traffic_light: '🚥', anchor: '⚓',
  white_check_mark: '✅', heavy_check_mark: '✔️', check: '✔️', x: '❌', negative_squared_cross_mark: '❎', warning: '⚠️', no_entry: '⛔', no_entry_sign: '🚫', question: '❓', exclamation: '❗', bangbang: '‼️', information_source: 'ℹ️', bulb: '💡', memo: '📝', pencil: '📝', pencil2: '✏️',
  book: '📖', books: '📚', bookmark: '🔖', page_facing_up: '📄', clipboard: '📋', calendar: '📅', date: '📅', chart_with_upwards_trend: '📈', chart_with_downwards_trend: '📉', bar_chart: '📊', pushpin: '📌', paperclip: '📎', link: '🔗', mag: '🔍', mag_right: '🔎', lock: '🔒', unlock: '🔓', key: '🔑', bell: '🔔', mega: '📣', email: '📧', envelope: '✉️', inbox_tray: '📥', outbox_tray: '📤', package: '📦', file_folder: '📁', open_file_folder: '📂',
  computer: '💻', keyboard: '⌨️', desktop_computer: '🖥️', iphone: '📱', phone: '☎️', battery: '🔋', electric_plug: '🔌', gear: '⚙️', wrench: '🔧', hammer: '🔨', hammer_and_wrench: '🛠️', tools: '🛠️', nut_and_bolt: '🔩', microscope: '🔬', test_tube: '🧪', bug: '🐛', beetle: '🐞', robot: '🤖', globe_with_meridians: '🌐', earth_americas: '🌎', cloud: '☁️', sunny: '☀️', rainbow: '🌈', snowflake: '❄️', seedling: '🌱', evergreen_tree: '🌲', herb: '🌿',
  hourglass: '⌛', stopwatch: '⏱️', alarm_clock: '⏰', hourglass_flowing_sand: '⏳', money_with_wings: '💸', moneybag: '💰', dollar: '💵', credit_card: '💳', shopping_cart: '🛒', hotel: '🏨', house: '🏠', office: '🏢', school: '🏫',
  coffee: '☕', tea: '🍵', pizza: '🍕', beer: '🍺', cake: '🍰', apple: '🍎', taco: '🌮', cookie: '🍪',
  dog: '🐶', cat: '🐱', mouse: '🐭', bee: '🐝', butterfly: '🦋', penguin: '🐧', unicorn: '🦄', octocat: '🐙', see_no_evil: '🙈',
  arrow_right: '➡️', arrow_left: '⬅️', arrow_up: '⬆️', arrow_down: '⬇️', arrows_counterclockwise: '🔄', recycle: '♻️', repeat: '🔁', new: '🆕', free: '🆓', up: '🆙', ok: '🆗', sos: '🆘', soon: '🔜', top: '🔝', back: '🔙', hash: '#️⃣',
  red_circle: '🔴', large_blue_circle: '🔵', green_circle: '🟢', yellow_circle: '🟡', white_circle: '⚪', black_circle: '⚫', large_orange_diamond: '🔶', large_blue_diamond: '🔷', small_blue_diamond: '🔹', black_square_button: '🔲', checkered_flag: '🏁', triangular_flag_on_post: '🚩', dart: '🎯', video_game: '🎮', art: '🎨', musical_note: '🎵', speech_balloon: '💬', thought_balloon: '💭', zzz: '💤', 100: '💯', copyright: '©️', registered: '®️', tm: '™️',
};

const emojiExtension = {
  name: 'emoji',
  level: 'inline',
  start(src) { const i = src.indexOf(':'); return i < 0 ? undefined : i; },
  tokenizer(src) {
    const m = /^:([a-z0-9_+-]{1,40}):/.exec(src);
    if (m && Object.hasOwn(EMOJI, m[1])) return { type: 'emoji', raw: m[0], emoji: EMOJI[m[1]] };
  },
  renderer(token) { return token.emoji; },
};

// Math: $x^2$ in a line, $$ ... $$ on its own lines. The text is kept as is; the browser draws it
// with KaTeX only when the document has math (see Tool.astro). A dollar amount such as $5 is not math.
const mathInline = {
  name: 'mathInline',
  level: 'inline',
  start(src) { const i = src.indexOf('$'); return i < 0 ? undefined : i; },
  tokenizer(src) {
    const m = /^\$(?!\s|\$)((?:\\.|[^$\\\n])+?)(?<!\s)\$(?!\d)/.exec(src);
    if (m) return { type: 'mathInline', raw: m[0], tex: m[1] };
  },
  renderer(token) { return `<span class="md-math" data-math="inline">${escapeHtml(token.tex)}</span>`; },
};
const mathBlock = {
  name: 'mathBlock',
  level: 'block',
  start(src) { const i = src.search(/^\$\$/m); return i < 0 ? undefined : i; },
  tokenizer(src) {
    const m = /^\$\$[ \t]*\n?([\s\S]+?)\n?[ \t]*\$\$[ \t]*(?:\n|$)/.exec(src);
    if (m) return { type: 'mathBlock', raw: m[0], tex: m[1].trim() };
  },
  renderer(token) { return `<div class="md-math" data-math="block">${escapeHtml(token.tex)}</div>\n`; },
};

// A fenced block marked mermaid is kept as text until the browser draws the diagram.
const mermaidRenderer = {
  code(token) {
    if (/^mermaid(\s|$)/i.test(token.lang || '')) return `<pre class="md-mermaid">${token.escaped ? token.text : escapeHtml(token.text)}</pre>\n`;
    return false;
  },
};

const marked = new Marked(
  { gfm: true, breaks: false },
  { extensions: [emojiExtension, mathInline, mathBlock] },
  markedHighlight({ langPrefix: 'hljs language-', highlight: highlightCode, emptyLangClass: 'hljs' }),
  { renderer: mermaidRenderer },
  gfmHeadingId({ prefix: 'md-' }),
  markedFootnote({ prefixId: 'md-fn-', description: 'Footnotes', refMarkers: true }),
);

// GitHub alert blocks: > [!NOTE], > [!TIP], > [!IMPORTANT], > [!WARNING], > [!CAUTION].
const ALERTS = { note: 'Note', tip: 'Tip', important: 'Important', warning: 'Warning', caution: 'Caution' };
function applyAlerts(html) {
  return html.replace(/<blockquote>\s*<p>\[!(note|tip|important|warning|caution)\](?:\s*<br\s*\/?>|[ \t]*\n)?\s*/gi, (_, kind) => {
    const k = kind.toLowerCase();
    return `<blockquote class="md-alert md-alert-${k}"><p class="md-alert-title">${ALERTS[k]}</p><p>`;
  }).replace(/<p><\/p>\s*/g, '');
}

// A line that holds only one of these starts a new page.
const PAGE_BREAK_LINE = /^[ \t]*(?:<!--\s*pagebreak\s*-->|\\pagebreak|\\newpage)[ \t]*$/i;
const PAGE_BREAK_HTML = '<div class="md-pagebreak" role="separator" aria-label="Page break"></div>';
const FRONT_MATTER = /^﻿?---[ \t]*\r?\n([\s\S]*?)\r?\n(?:---|\.\.\.)[ \t]*(?:\r?\n|$)/;

// Split a leading YAML block (--- ... ---) from the body. A rule line at the top is not front matter.
export function splitFrontMatter(src) {
  const text = String(src ?? '');
  const m = FRONT_MATTER.exec(text);
  if (!m || !(m[1].trim() === '' || /^[\w"'-][^\n:]*:/m.test(m[1]))) return { data: '', body: text };
  return { data: m[1], body: text.slice(m[0].length) };
}

// Read the simple parts of YAML front matter: "key: value", "key: [a, b]" and "key:" with "- item" lines below.
export function parseFrontMatter(data) {
  const rows = [];
  for (const line of String(data || '').split(/\r?\n/)) {
    const kv = /^([A-Za-z0-9_][\w .-]*?):[ \t]*(.*)$/.exec(line);
    const li = /^[ \t]+-[ \t]+(.*)$/.exec(line);
    const unq = (v) => v.trim().replace(/^(["'])(.*)\1$/, '$2');
    if (kv) {
      let v = kv[2].trim();
      const arr = /^\[(.*)\]$/.exec(v);
      if (arr) v = arr[1].split(',').map(unq).filter(Boolean).join(', ');
      else v = unq(v);
      rows.push([kv[1].trim(), v]);
    } else if (li && rows.length) {
      const last = rows[rows.length - 1];
      last[1] = last[1] ? `${last[1]}, ${unq(li[1])}` : unq(li[1]);
    }
  }
  return rows;
}

function frontMatterHtml(data) {
  const rows = parseFrontMatter(data);
  if (!rows.length) return '';
  const body = rows.map(([k, v]) => `<tr><th scope="row">${escapeHtml(k)}</th><td>${escapeHtml(v)}</td></tr>`).join('');
  return `<table class="md-frontmatter"><tbody>${body}</tbody></table>\n\n`;
}

// Everything the user typed is cleaned up here before marked sees it.
// With showFrontMatter, the front matter block becomes a small table at the top instead of being removed.
export function preprocess(src, { showFrontMatter = false } = {}) {
  let fence = '';
  const fm = splitFrontMatter(src);
  const head = showFrontMatter ? frontMatterHtml(fm.data) : '';
  return head + fm.body.split(/\r?\n/).map((line) => {
    const f = /^ {0,3}(`{3,}|~{3,})/.exec(line);
    if (f) {
      if (!fence) fence = f[1][0];
      else if (f[1][0] === fence) fence = '';
    }
    return !fence && PAGE_BREAK_LINE.test(line) ? `\n${PAGE_BREAK_HTML}\n` : line;
  }).join('\n');
}

// Raw HTML from marked. Never put this in the page without sanitizing it.
export function parseMarkdown(src, options) {
  return applyAlerts(marked.parse(preprocess(src, options), { async: false }));
}

// Build a sanitizer from a DOMPurify instance (browser window, or jsdom in tests).
export function makeSanitizer(purify) {
  purify.addHook('afterSanitizeAttributes', (node) => {
    const tag = node.tagName;
    if (tag === 'A' && node.getAttribute('href')) {
      const href = node.getAttribute('href');
      if (/^https?:/i.test(href)) {
        node.setAttribute('rel', 'noopener noreferrer');
        node.setAttribute('target', '_blank');
      } else if (href.startsWith('#') && href.length > 1 && !href.startsWith('#md-')) {
        // Headings get the id "md-<slug>", so a table of contents link like #install must point there.
        node.setAttribute('href', '#md-' + href.slice(1));
      }
    }
    if (tag === 'IMG') node.setAttribute('loading', 'eager');
    if (tag === 'INPUT') {
      if (node.getAttribute('type') !== 'checkbox') node.remove();
      else node.setAttribute('aria-label', node.hasAttribute('checked') ? 'Completed task' : 'Open task');
    }
  });
  return (html) => purify.sanitize(html, {
    USE_PROFILES: { html: true },
    FORBID_TAGS: ['style', 'form', 'button', 'textarea', 'select', 'option'],
    FORBID_ATTR: ['style', 'srcset'],
    ADD_ATTR: ['checked', 'disabled', 'type', 'target'],
  });
}

export function renderMarkdown(src, sanitize, options) {
  return sanitize(parseMarkdown(src, options));
}

// Never throws: marked can overflow its stack on very deep input.
export function tryRender(src, sanitize, options) {
  try { return { ok: true, html: renderMarkdown(src, sanitize, options) }; } catch { return { ok: false, html: '' }; }
}

// Does the rendered page need the diagram or math code? The browser loads those only when it does.
export const needsMermaid = (html) => html.includes('class="md-mermaid"');
export const needsMath = (html) => html.includes('class="md-math"');

// A linked list of the headings (levels 2 to 3 by default; a lone first H1 is the title and is skipped).
// Links use the same ids that the heading renderer gives (the sanitizer adds the "md-" prefix).
export function buildToc(src, { maxLevel = 3 } = {}) {
  const lines = splitFrontMatter(src).body.split(/\r?\n/);
  const seen = new Map();
  const items = [];
  let fence = '';
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const f = /^ {0,3}(`{3,}|~{3,})/.exec(line);
    if (f) { if (!fence) fence = f[1][0]; else if (f[1][0] === fence) fence = ''; continue; }
    if (fence) continue;
    let level = 0, text = '';
    const atx = /^ {0,3}(#{1,6})[ \t]+(.+?)(?:[ \t]+#+)?[ \t]*$/.exec(line);
    if (atx) { level = atx[1].length; text = atx[2]; }
    else if (line.trim() && !/^\s*[-*+>|]/.test(line) && /^ {0,3}(=+|-+)[ \t]*$/.test(lines[i + 1] || '') && !/^ {0,3}#/.test(line)) {
      level = /=/.test(lines[i + 1]) ? 1 : 2; text = line; i++;
    }
    if (!level) continue;
    const label = plainInline(text);
    if (!label || /^(table of )?contents$/i.test(label)) continue;
    const base = label.toLowerCase().replace(/[^\p{L}\p{N}\p{M}_\- ]/gu, '').replace(/ /g, '-');
    const n = seen.get(base) ?? 0;
    seen.set(base, n + 1);
    items.push({ level, label, slug: n ? `${base}-${n}` : base });
  }
  const minLevel = items.length && items[0].level === 1 && items.filter((x) => x.level === 1).length === 1 ? 2 : 1;
  const shown = items.filter((x) => x.level >= minLevel && x.level <= Math.max(maxLevel, minLevel));
  if (!shown.length) return '';
  const top = Math.min(...shown.map((x) => x.level));
  return shown.map((x) => `${'  '.repeat(x.level - top)}- [${x.label.replace(/([\[\]])/g, '\\$1')}](#${x.slug})`).join('\n') + '\n';
}

// Plain text of one line of Markdown: no links, emphasis, code marks or tags.
function plainInline(s) {
  return s
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]*>/g, '')
    .replace(/[`*_~]/g, '')
    .replace(/\\([\\`*_{}\[\]()#+\-.!])/g, '$1')
    .replace(/\s+/g, ' ').trim();
}

// File name for the PDF: first H1 (or front matter title), made safe for any file system.
export function pdfTitle(src) {
  const { data, body } = splitFrontMatter(src);
  let fence = '', title = '';
  const lines = body.split(/\r?\n/);
  for (let i = 0; i < lines.length && !title; i++) {
    const line = lines[i];
    const f = /^ {0,3}(`{3,}|~{3,})/.exec(line);
    if (f) { if (!fence) fence = f[1][0]; else if (f[1][0] === fence) fence = ''; continue; }
    if (fence) continue;
    const atx = /^ {0,3}#[ \t]+(.+?)(?:[ \t]+#+)?[ \t]*$/.exec(line);
    if (atx) title = plainInline(atx[1]);
    else if (/^ {0,3}=+[ \t]*$/.test(lines[i + 1] || '') && line.trim() && !/^\s*[-*+>]/.test(line)) title = plainInline(line);
  }
  if (!title) {
    const t = /^title:[ \t]*(.+)$/im.exec(data);
    if (t) title = plainInline(t[1].replace(/^(["'])(.*)\1$/, '$2'));
  }
  const safe = title.replace(/[\\/:*?"<>|\u0000-\u001f]/g, ' ').replace(/\s+/g, ' ').replace(/^[. ]+|[. ]+$/g, '').slice(0, 80).trim();
  return safe || 'document';
}

export const PAPERS = {
  letter: { label: 'US Letter', css: '8.5in 11in', widthIn: 8.5, heightIn: 11 },
  a4: { label: 'A4', css: '210mm 297mm', widthIn: 210 / 25.4, heightIn: 297 / 25.4 },
};
export const MARGINS = { narrow: 0.5, normal: 0.75, wide: 1 };
export const SIZES = { small: 10, medium: 11, large: 12 };

// The @page rule that makes the browser print the right paper size and margins.
export function buildPageCss({ paper = 'letter', margin = 'normal', pageNumbers = false, landscape = false } = {}) {
  const p = PAPERS[paper] || PAPERS.letter;
  const m = MARGINS[margin] ?? MARGINS.normal;
  const box = pageNumbers
    ? ` @bottom-center { content: counter(page) " / " counter(pages); font: 9pt system-ui, sans-serif; color: #6b6b73; }`
    : '';
  // With explicit lengths the word "landscape" is not allowed in the size rule, so swap width and height.
  const size = landscape ? p.css.split(' ').reverse().join(' ') : p.css;
  return `@page { size: ${size}; margin: ${m}in;${box} }`;
}

// Rough page count from the rendered height in CSS pixels (96 per inch).
// Printable page size in inches, with the orientation applied.
export function pageInches(paper = 'letter', landscape = false) {
  const p = PAPERS[paper] || PAPERS.letter;
  return landscape ? { w: p.heightIn, h: p.widthIn } : { w: p.widthIn, h: p.heightIn };
}

export function estimatePages(contentHeightPx, { paper = 'letter', margin = 'normal', landscape = false } = {}) {
  const m = MARGINS[margin] ?? MARGINS.normal;
  const usable = (pageInches(paper, landscape).h - 2 * m) * 96;
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

export const SAMPLE_MATH = `# Diagram and math

A flowchart and a formula, drawn in your browser. Edit them and watch the preview.

## Flowchart

\`\`\`mermaid
flowchart LR
  A[Write Markdown] --> B{Looks right?}
  B -- yes --> C[Download PDF]
  B -- no --> A
\`\`\`

## Formula

The area of a circle is $A = \\pi r^2$. A longer one on its own lines:

$$
\\int_0^1 x^2 \\, dx = \\frac{1}{3}
$$

A price such as $5 or $10 stays as text.

## Alerts and emoji

> [!NOTE]
> Alert blocks from GitHub print with a colored bar. :rocket:

> [!WARNING]
> Check the page count before you print.
`;
