// Renders PNG icons and og.png from public/favicon.svg with playwright. Run: node scripts/make-icons.mjs
import { chromium } from '/Users/moonwalker/Desktop/oqu/generic-email-agent/node_modules/playwright-core/index.mjs';
import fs from 'node:fs';
const svg = fs.readFileSync('public/favicon.svg', 'utf8');
const b = await chromium.launch({ channel: 'chrome', args: ['--disable-gpu'] }); const p = await b.newPage();
for (const [n, s] of [['favicon-32.png', 32], ['apple-touch-icon.png', 180], ['icon-192.png', 192], ['icon-512.png', 512]]) {
  await p.setViewportSize({ width: 600, height: 600 });
  await p.setContent(`<body style="margin:0;background:transparent">${svg.replace('<svg ', `<svg width="${s}" height="${s}" `)}</body>`);
  await p.screenshot({ path: `public/${n}`, omitBackground: true, clip: { x: 0, y: 0, width: s, height: s } });
}
await p.setViewportSize({ width: 1200, height: 630 });
await p.setContent(`<body style="margin:0;width:1200px;height:630px;background:#f7f6f2;font-family:system-ui,-apple-system,Segoe UI,Arial,sans-serif;color:#16161a;display:flex;align-items:center;padding:0 90px;box-sizing:border-box;gap:70px">
<div style="width:260px;height:260px;flex:none">${svg.replace('<svg ', '<svg width="260" height="260" ')}</div>
<div><div style="font-size:30px;font-weight:600;color:#b3391a;margin-bottom:14px">markdowntopdfonline.com</div>
<div style="font-size:70px;font-weight:800;line-height:1.02;letter-spacing:-2px">Convert Markdown to a clean PDF</div>
<div style="font-size:30px;color:#5d5d66;margin-top:22px">Live preview. Real text PDF. No upload, no watermark.</div></div></body>`);
await p.screenshot({ path: 'public/og.png' });
await b.close();
