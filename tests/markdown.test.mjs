// Run: node tests/markdown.test.mjs   (or npm test)
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import createDOMPurify from 'dompurify';
import { parseMarkdown, renderMarkdown, makeSanitizer, buildPageCss, estimatePages, docStats, SAMPLE } from '../src/lib/markdown.js';

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
ok('parseMarkdown does not sanitize by itself (sanitizer is required)', () => has(parseMarkdown('<script>x</script>'), '<script>'));

console.log(`\n${n} tests passed`);
