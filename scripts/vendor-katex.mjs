// Copies the KaTeX style sheet and its woff2 fonts into public/katex/ so the page can load them only when a
// document has math. Run after you update katex: node scripts/vendor-katex.mjs
import { cpSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
const src = new URL('../node_modules/katex/dist/', import.meta.url);
const out = new URL('../public/katex/', import.meta.url);
rmSync(out, { recursive: true, force: true });
mkdirSync(new URL('fonts/', out), { recursive: true });
let css = readFileSync(new URL('katex.min.css', src), 'utf8');
// Keep only the woff2 source of each font: every browser that can print to PDF reads it.
css = css.replace(/src:url\((fonts\/[^)]+\.woff2)\) format\("woff2"\)[^;}]*/g, 'src:url($1) format("woff2")');
writeFileSync(new URL('katex.min.css', out), css);
for (const f of readdirSync(new URL('fonts/', src))) if (f.endsWith('.woff2')) cpSync(new URL('fonts/' + f, src), new URL('fonts/' + f, out));
console.log('KaTeX copied to public/katex/');
