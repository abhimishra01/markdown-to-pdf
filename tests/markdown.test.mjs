// Run: node tests/markdown.test.mjs   (or npm test)
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import createDOMPurify from 'dompurify';
import { parseFrontMatter, buildToc, needsMath, needsMermaid, pageInches, SAMPLE_MATH, EMOJI, parseMarkdown, renderMarkdown, tryRender, pdfTitle, splitFrontMatter, preprocess, makeSanitizer, buildPageCss, estimatePages, docStats, SAMPLE } from '../src/lib/markdown.js';

const purify = createDOMPurify(new JSDOM('').window);
const sanitize = makeSanitizer(purify);
let n = 0;
const ok = (name, fn) => { fn(); n++; console.log('ok', name); };
const has = (html, s) => assert.ok(html.includes(s), `missing ${s} in ${html}`);
const hasNot = (html, s) => assert.ok(!html.includes(s), `unexpected ${s} in ${html}`);

ok('heading and paragraph', () => {
  const h = renderMarkdown('# Title\n\nHello **world**', sanitize);
  has(h, '<h1 id="md-title">Title</h1>'); has(h, '<strong>world</strong>');
});
ok('duplicate headings get unique ids', () => {
  const h = renderMarkdown('## A\n\n## A', sanitize);
  has(h, 'id="md-a"'); has(h, 'id="md-a-1"');
});
ok('GFM table with alignment', () => {
  const h = renderMarkdown('| a | b |\n|:--|--:|\n| 1 | 2 |', sanitize);
  has(h, '<table>'); has(h, '<th align="left">a</th>'); has(h, '<td align="right">2</td>');
});
ok('task list keeps checked state', () => {
  const h = renderMarkdown('- [x] done\n- [ ] todo', sanitize);
  assert.equal((h.match(/type="checkbox"/g) || []).length, 2);
  assert.equal((h.match(/checked/g) || []).length, 1);
});
ok('strikethrough', () => has(renderMarkdown('~~gone~~', sanitize), '<del>gone</del>'));
ok('fenced code is highlighted', () => {
  const h = renderMarkdown('```js\nconst a = 1;\n```', sanitize);
  has(h, 'hljs language-js'); has(h, 'hljs-keyword');
});
ok('alias py maps to python', () => has(renderMarkdown('```py\ndef f(): pass\n```', sanitize), 'hljs-keyword'));
ok('unknown language is escaped, not broken', () => {
  const h = renderMarkdown('```nope\n<b>x</b>\n```', sanitize);
  has(h, '&lt;b&gt;x&lt;/b&gt;');
});
ok('footnotes render a reference and a list', () => {
  const h = renderMarkdown('Text[^a]\n\n[^a]: Note here', sanitize);
  has(h, 'Note here'); has(h, 'md-fn-'); has(h, 'Footnotes');
});
ok('script tags are removed', () => hasNot(renderMarkdown('<script>alert(1)</script>hi', sanitize), '<script'));
ok('event handlers are removed', () => hasNot(renderMarkdown('<img src=x onerror=alert(1)>', sanitize), 'onerror'));
ok('javascript links are removed', () => hasNot(renderMarkdown('[x](javascript:alert(1))', sanitize), 'javascript:'));
ok('inline style and iframes are removed', () => {
  const h = renderMarkdown('<div style="position:fixed">a</div><iframe src="https://x.test"></iframe>', sanitize);
  hasNot(h, 'style='); hasNot(h, '<iframe');
});
ok('safe inline html stays', () => has(renderMarkdown('<kbd>Ctrl</kbd> and <sub>2</sub>', sanitize), '<kbd>Ctrl</kbd>'));
ok('external links get rel noopener', () => has(renderMarkdown('[a](https://example.com)', sanitize), 'rel="noopener noreferrer"'));
ok('empty input gives empty output', () => assert.equal(renderMarkdown('', sanitize).trim(), ''));
ok('sample renders everything it promises', () => {
  const h = renderMarkdown(SAMPLE, sanitize);
  for (const s of ['<table>', 'checkbox', 'hljs-keyword', '<del>', 'Footnotes']) has(h, s);
});

ok('table of contents links point at the heading ids', () => {
  const h = renderMarkdown('- [Install](#install)\n- [Usage notes](#usage-notes)\n\n## Install\n\n## Usage notes', sanitize);
  has(h, 'href="#md-install"'); has(h, 'id="md-install"'); has(h, 'href="#md-usage-notes"'); has(h, 'id="md-usage-notes"');
});
ok('footnote links keep their own ids and are not rewritten twice', () => {
  const h = renderMarkdown('Text[^a]\n\n[^a]: Note', sanitize);
  has(h, 'href="#md-fn-a"'); hasNot(h, '#md-md-');
});
ok('hash and mailto links get no rel or target', () => {
  const h = renderMarkdown('[a](#x) [b](mailto:a@b.co)', sanitize);
  hasNot(h, 'rel='); hasNot(h, 'target=');
});
ok('external links open in a new tab', () => has(renderMarkdown('[a](https://example.com)', sanitize), 'target="_blank"'));
ok('front matter is removed', () => {
  const h = renderMarkdown('---\ntitle: Report\nauthor: Me\n---\n# Body\n', sanitize);
  hasNot(h, 'title: Report'); hasNot(h, '<hr'); has(h, 'id="md-body"');
});
ok('front matter with CRLF and BOM is removed', () => hasNot(renderMarkdown('﻿---\r\ntitle: A\r\n---\r\n# B', sanitize), 'title: A'));
ok('a leading rule is not front matter', () => {
  const h = renderMarkdown('---\n\nSome text\n\n---\n\nMore', sanitize);
  has(h, 'Some text'); has(h, '<hr');
  assert.equal(splitFrontMatter('---\nplain text\n---\nx').data, '');
});
ok('pdf title: first H1, markup removed', () => assert.equal(pdfTitle('intro\n\n# My *Great* [Doc](http://x.co) `v2`\n## Two'), 'My Great Doc v2'));
ok('pdf title: ignores # lines inside code fences', () => assert.equal(pdfTitle('```bash\n# comment\n```\n# Real'), 'Real'));
ok('pdf title: setext heading and closing hashes', () => {
  assert.equal(pdfTitle('Setext Title\n====\n'), 'Setext Title');
  assert.equal(pdfTitle('# Closed ##'), 'Closed');
});
ok('pdf title: front matter title is the fallback, then "document"', () => {
  assert.equal(pdfTitle('---\ntitle: "From YAML"\n---\nno heading'), 'From YAML');
  assert.equal(pdfTitle('just text'), 'document');
  assert.equal(pdfTitle(''), 'document');
});
ok('pdf title: unsafe file name characters are removed', () => {
  assert.equal(pdfTitle('# a/b\\c:d?"e|f'), 'a b c d e f');
  assert.equal(pdfTitle('# ' + 'x'.repeat(200)).length, 80);
});
ok('page break: comment and \\pagebreak lines', () => {
  const h = renderMarkdown('A\n\n<!-- pagebreak -->\n\nB\n\n\\pagebreak\n\nC\n\n  <!--pagebreak-->  \nD', sanitize);
  assert.equal((h.match(/md-pagebreak/g) || []).length, 3);
});
ok('page break: not inside a code fence or a sentence', () => {
  const h = renderMarkdown('```\n\\pagebreak\n```\n\nUse \\pagebreak here', sanitize);
  hasNot(h, 'md-pagebreak');
});
ok('page break marker survives the sanitizer', () => has(preprocess('a\n\\newpage\nb'), 'md-pagebreak'));
ok('details and summary survive for print', () => {
  const h = renderMarkdown('<details><summary>More</summary>\n\nHidden text\n\n</details>', sanitize);
  has(h, '<details'); has(h, '<summary>More</summary>'); has(h, 'Hidden text');
});
ok('task list checkboxes get a label; loose lists too', () => {
  const h = renderMarkdown('- [x] a\n\n- [ ] b', sanitize);
  has(h, 'aria-label="Completed task"'); has(h, 'aria-label="Open task"');
});
ok('inputs other than checkboxes are removed', () => hasNot(renderMarkdown('<input type="image" src="https://x.test/a.png"><input type="text" value="x">', sanitize), '<input'));
ok('more hostile input is neutralised', () => {
  const vectors = [
    '<base href="https://evil.test/">', '<link rel="stylesheet" href="https://evil.test/a.css">',
    '<meta http-equiv="refresh" content="0;url=https://evil.test">', '<svg onload=alert(1)></svg>',
    '<math><mi xlink:href="javascript:alert(1)">x</mi></math>', '[x](data:text/html,<script>alert(1)</script>)',
    '[x](java&#9;script:alert(1))', '[x](JaVaScRiPt:alert(1))', '<form action="https://evil.test"><button>go</button></form>',
    '<img srcset="https://evil.test/a.png 1x" src="a.png">', '<div onclick="alert(1)">x</div>', '<object data="x.swf"></object>',
  ];
  for (const v of vectors) {
    const h = renderMarkdown(v, sanitize);
    for (const bad of ['<base', '<link', '<meta', 'onload', 'onclick', 'javascript:', 'data:text', '<form', '<button', 'srcset', '<object', '<svg', '<math']) {
      assert.ok(!h.toLowerCase().includes(bad), `${bad} survived in ${h} (from ${v})`);
    }
  }
});
ok('very deep nesting does not throw from tryRender', () => {
  const r = tryRender('> '.repeat(20000) + 'x', sanitize);
  assert.equal(typeof r.ok, 'boolean');
  if (!r.ok) assert.equal(r.html, '');
  assert.deepEqual(tryRender('# ok', sanitize).ok, true);
});

ok('page css: Letter, normal margin, no numbers', () =>
  assert.equal(buildPageCss({ paper: 'letter', margin: 'normal', pageNumbers: false }), '@page { size: 8.5in 11in; margin: 0.75in; }'));
ok('page css: A4, wide margin', () => has(buildPageCss({ paper: 'a4', margin: 'wide' }), 'size: 210mm 297mm; margin: 1in;'));
ok('page css: page numbers add a bottom box', () => {
  const css = buildPageCss({ paper: 'a4', margin: 'narrow', pageNumbers: true });
  has(css, '@bottom-center'); has(css, 'counter(page)'); has(css, 'margin: 0.5in');
});
ok('page css: bad input falls back to Letter', () => has(buildPageCss({ paper: 'x', margin: 'y' }), 'size: 8.5in 11in; margin: 0.75in'));

ok('estimate pages: Letter 0.75in margins (usable 9.5in = 912px)', () => {
  assert.equal(estimatePages(0), 0);
  assert.equal(estimatePages(500), 1);
  assert.equal(estimatePages(912), 1);
  assert.equal(estimatePages(913), 2);
  assert.equal(estimatePages(2000), 3);
});
ok('estimate pages: A4 narrow margins gives more room', () => {
  // A4 11.69in - 1in = 10.69in = 1026px
  assert.equal(estimatePages(1026, { paper: 'a4', margin: 'narrow' }), 1);
  assert.equal(estimatePages(1028, { paper: 'a4', margin: 'narrow' }), 2);
});

ok('doc stats count words and skip code fences', () => {
  assert.deepEqual(docStats('Hello brave new world'), { words: 4, chars: 21, empty: false });
  assert.equal(docStats('one\n```\nlots of code words here\n```\ntwo').words, 2);
  assert.equal(docStats('   \n').empty, true);
  assert.equal(docStats(undefined).words, 0);
});

ok('emoji shortcodes are replaced; unknown ones and code stay', () => {
  const h = renderMarkdown('Go :rocket: and :+1: not :nope: or `:rocket:` at 10:30:45', sanitize);
  has(h, '🚀'); has(h, '👍'); has(h, ':nope:'); has(h, '<code>:rocket:</code>'); has(h, '10:30:45');
});
ok('GitHub alerts become styled blocks', () => {
  const h = renderMarkdown('> [!NOTE]\n> Useful **info**.\n\n> [!warning] \n> Careful\n\n> plain quote', sanitize);
  has(h, 'class="md-alert md-alert-note"'); has(h, 'class="md-alert-title">Note<'); has(h, 'Useful <strong>info</strong>');
  has(h, 'md-alert-warning'); has(h, '<blockquote>'); hasNot(h, '[!NOTE]'); hasNot(h, '<p></p>');
});
ok('alert marker inside a code block is left alone', () => hasNot(renderMarkdown('```\n> [!NOTE]\n```', sanitize), 'md-alert'));
ok('math: inline and block are marked for KaTeX, dollar prices are not', () => {
  const h = renderMarkdown('Area $A = \\pi r^2$ and costs $5 or $10.\n\n$$\n\\frac{a}{b}\n$$\n', sanitize);
  has(h, '<span class="md-math" data-math="inline">A = \\pi r^2</span>'); has(h, 'data-math="block"'); has(h, '\\frac{a}{b}');
  has(h, 'costs $5 or $10'); assert.equal(needsMath(h), true);
  assert.equal(needsMath(renderMarkdown('plain $5 and $6', sanitize)), false);
});
ok('math text is escaped and never code', () => {
  const h = renderMarkdown('$a<b>c$ and `$x$`', sanitize);
  has(h, 'a&lt;b&gt;c'); has(h, '<code>$x$</code>'); hasNot(h, '<b>');
});
ok('mermaid fence is kept as text for the browser; other code is untouched', () => {
  const h = renderMarkdown('```mermaid\ngraph TD\n  A-->B\n```\n\n```js\nlet a\n```', sanitize);
  has(h, '<pre class="md-mermaid">graph TD'); has(h, 'A--&gt;B'); has(h, 'hljs-keyword'); assert.equal(needsMermaid(h), true);
  assert.equal(needsMermaid(renderMarkdown('```js\nlet a\n```', sanitize)), false);
});
ok('plain documents need no diagram or math code', () => {
  const h = renderMarkdown(SAMPLE, sanitize);
  assert.equal(needsMath(h) || needsMermaid(h), false);
  const m = renderMarkdown(SAMPLE_MATH, sanitize);
  assert.equal(needsMath(m) && needsMermaid(m), true); has(m, '🚀'); has(m, 'md-alert-warning');
});
ok('front matter parser: scalars, inline arrays, lists, quotes', () => {
  assert.deepEqual(parseFrontMatter('title: "Acme API"\nversion: 2.4.0\ntags: [api, sdk]\nauthors:\n  - Ann\n  - Bo\n# note'), [['title', 'Acme API'], ['version', '2.4.0'], ['tags', 'api, sdk'], ['authors', 'Ann, Bo']]);
});
ok('front matter table: off by default, on when asked, escaped', () => {
  const src = '---\ntitle: A <b>x</b>\nversion: 1\n---\n# Body\n';
  hasNot(renderMarkdown(src, sanitize), 'version');
  const h = renderMarkdown(src, sanitize, { showFrontMatter: true });
  has(h, '<table class="md-frontmatter">'); has(h, '<th scope="row">version</th>'); has(h, '<td>1</td>'); has(h, 'A &lt;b&gt;x&lt;/b&gt;'); has(h, 'id="md-body"');
  hasNot(renderMarkdown('# No front matter', sanitize, { showFrontMatter: true }), 'md-frontmatter');
});
ok('toc: lists h2 and h3, skips the lone title, ignores code, links match heading ids', () => {
  const src = '# Title\n\n## Install\n\n```bash\n# not a heading\n```\n\n### Usage notes\n\n## Install\n\n#### Deep\n';
  const toc = buildToc(src);
  assert.equal(toc, '- [Install](#install)\n  - [Usage notes](#usage-notes)\n- [Install](#install-1)\n');
  const h = renderMarkdown(toc + '\n' + src, sanitize);
  for (const id of ['md-install', 'md-usage-notes', 'md-install-1']) { has(h, `href="#${id}"`); has(h, `id="${id}"`); }
});
ok('toc: no headings gives an empty string; several H1s are all kept', () => {
  assert.equal(buildToc('just text'), '');
  assert.equal(buildToc('# One\n\n# Two\n'), '- [One](#one)\n- [Two](#two)\n');
  assert.equal(buildToc('Setext\n======\n\nSub\n---\n'), '- [Sub](#sub)\n');
});
ok('toc: an existing Contents heading is not listed', () => assert.equal(buildToc('## Contents\n\n## A\n'), '- [A](#a)\n'));
ok('toc: punctuation in headings matches the heading id', () => {
  const src = '## What\'s new? (v2.0)\n\n## C++ & Go\n';
  const h = renderMarkdown(buildToc(src) + '\n' + src, sanitize);
  const ids = [...h.matchAll(/<h2 id="([^"]+)"/g)].map((m) => m[1]);
  for (const id of ids) has(h, `href="#${id}"`);
});
ok('landscape A4 swaps the lengths', () => has(buildPageCss({ paper: 'a4', landscape: true }), 'size: 297mm 210mm;'));
ok('landscape swaps the page and the usable height', () => {
  assert.equal(buildPageCss({ paper: 'letter', landscape: true }), '@page { size: 11in 8.5in; margin: 0.75in; }');
  assert.deepEqual(pageInches('letter', true), { w: 11, h: 8.5 });
  assert.equal(estimatePages(913, { landscape: true }), 2);
  assert.equal(estimatePages(7 * 96, { landscape: true }), 1);
  assert.equal(estimatePages(7 * 96 + 2, { landscape: true }), 2);
});
ok('emoji map has no empty values', () => { for (const [k, v] of Object.entries(EMOJI)) assert.ok(v, k); });
ok('print CSS keeps headings with text and avoids splitting code, rows and alerts', () => {
  const css = readFileSync(new URL('../src/styles/doc.css', import.meta.url), 'utf8');
  for (const s of ['break-after: avoid', 'pre { break-inside: avoid', 'tr { break-inside: avoid', 'display: table-header-group', '.md-alert', 'orphans']) assert.ok(css.includes(s), s);
});
ok('parseMarkdown does not sanitize by itself (sanitizer is required)', () => has(parseMarkdown('<script>x</script>'), '<script>'));

console.log(`\n${n} tests passed`);
