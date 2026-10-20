// Draws math and diagrams after the Markdown is on the page.
import { codeBreakParts, diagramScale, LEGIBLE_SCALE } from './markdown.js';
// KaTeX and Mermaid are big, so they are loaded here with import() and only when a document needs them.
// A plain document never downloads either one.
const mathCache = new Map();
const diagramCache = new Map();
let katexPromise = null, mermaidPromise = null, counter = 0;

// The KaTeX style sheet and fonts are copied to public/katex/ (scripts/vendor-katex.mjs) so they are
// requested only when a document has math. Importing the CSS from JavaScript would add it to every page.
function loadKatexCss() {
  return new Promise((resolve) => {
    if (document.getElementById('katex-css')) return resolve();
    const link = document.createElement('link');
    link.id = 'katex-css'; link.rel = 'stylesheet';
    link.href = import.meta.env.BASE_URL.replace(/\/?$/, '/') + 'katex/katex.min.css';
    link.onload = link.onerror = () => resolve();
    document.head.appendChild(link);
  });
}
function loadKatex() {
  katexPromise ??= Promise.all([import('katex'), loadKatexCss()]).then(([m]) => m.default);
  return katexPromise;
}
function loadMermaid() {
  mermaidPromise ??= import('mermaid').then(({ default: mermaid }) => {
    mermaid.initialize({ startOnLoad: false, securityLevel: 'strict', theme: 'neutral', htmlLabels: false, flowchart: { htmlLabels: false, useMaxWidth: false, nodeSpacing: 36, rankSpacing: 36, padding: 8 }, sequence: { useMaxWidth: false }, fontFamily: 'ui-sans-serif, system-ui, sans-serif' });
    return mermaid;
  });
  return mermaidPromise;
}

const mathKey = (el) => el.dataset.math + '|' + el.textContent;
function putMath(el, html) { el.innerHTML = html; el.setAttribute('data-rendered', ''); }
function putDiagram(pre, svg) {
  const box = document.createElement('div');
  box.className = 'md-diagram';
  box.innerHTML = svg;
  pre.replaceWith(box);
}
function putDiagramError(pre) {
  if (pre.nextElementSibling?.classList.contains('md-diagram-error')) return;
  const p = document.createElement('p');
  p.className = 'md-diagram-error';
  p.textContent = 'This diagram could not be drawn. Check its syntax.';
  pre.after(p);
}

// Fill in what is cached right away (no flash while typing), then load the code for the rest.
// onChange runs after anything new is drawn, so the page count can be measured again.
export async function enhance(root, onChange) {
  const maths = [...root.querySelectorAll('.md-math:not([data-rendered])')];
  const diagrams = [...root.querySelectorAll('pre.md-mermaid')];
  const pendingMath = [];
  for (const el of maths) {
    const hit = mathCache.get(mathKey(el));
    if (hit !== undefined) putMath(el, hit); else pendingMath.push(el);
  }
  const pendingDiagrams = [];
  for (const pre of diagrams) {
    const hit = diagramCache.get(pre.textContent);
    if (hit) putDiagram(pre, hit); else pendingDiagrams.push(pre);
  }
  if (!pendingMath.length && !pendingDiagrams.length) return;

  const jobs = [];
  if (pendingMath.length) jobs.push(loadKatex().then((katex) => {
    for (const el of pendingMath) {
      if (!el.isConnected) continue;
      const key = mathKey(el);
      try {
        const html = katex.renderToString(el.textContent, { displayMode: el.dataset.math === 'block', throwOnError: true, output: 'html', trust: false, strict: 'ignore' });
        mathCache.set(key, html); putMath(el, html);
      } catch {
        el.classList.add('md-math-error'); el.title = 'This formula could not be drawn.';
      }
    }
  }, () => { /* offline and not cached: the formula stays as text */ }));
  if (pendingDiagrams.length) jobs.push(loadMermaid().then(async (mermaid) => {
    for (const pre of pendingDiagrams) {
      if (!pre.isConnected) continue;
      const src = pre.textContent;
      const id = 'md-mmd-' + (++counter);
      try {
        const { svg } = await mermaid.render(id, src);
        diagramCache.set(src, svg);
        if (pre.isConnected) putDiagram(pre, svg);
      } catch {
        document.getElementById('d' + id)?.remove();
        if (pre.isConnected) putDiagramError(pre);
      }
    }
  }, () => { /* offline and not cached: the diagram stays as text */ }));
  await Promise.all(jobs);
  onChange?.();
}

// Long code blocks may split across pages; short ones stay whole (see doc.css).
export function markLongCode(root, lines = 38) {
  for (const pre of root.querySelectorAll('pre:not(.md-mermaid)')) {
    pre.toggleAttribute('data-long', (pre.textContent.match(/\n/g) || []).length > lines);
  }
}

// Table cells: let long inline code wrap only after a separator such as / . _ -. Short code stays on one line (doc.css).
export function softWrapTableCode(root) {
  for (const code of root.querySelectorAll('td code, th code')) {
    if (code.children.length || code.hasAttribute('data-soft')) continue;
    const parts = codeBreakParts(code.textContent);
    if (parts.length < 2) continue;
    code.setAttribute('data-soft', '');
    code.replaceChildren(...parts.flatMap((p, i) => (i ? [document.createElement('wbr'), p] : [p])));
  }
}

// Draw each diagram as wide as the page allows (never larger than drawn). Returns the smallest scale used.
export function fitDiagrams(root, availPx) {
  let min = 1;
  for (const box of root.querySelectorAll('.md-diagram')) {
    const svg = box.querySelector('svg');
    const vb = svg?.viewBox?.baseVal;
    if (!vb || !vb.width) continue;
    const scale = diagramScale(vb.width, availPx);
    svg.style.width = Math.min(vb.width, availPx) + 'px';
    svg.style.maxWidth = '100%';
    box.toggleAttribute('data-wide', scale < LEGIBLE_SCALE);
    min = Math.min(min, scale);
  }
  return min;
}
