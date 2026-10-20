// ONE config file. Change values here; every page reads from it.
// Keep this file plain (no type-only syntax): scripts/deploy.mjs imports it directly.
export default {
  name: 'Markdown to PDF',                 // shown in header, title, footer
  domain: 'markdowntopdfonline.com',            // no https://, no www. Used for canonical, sitemap, robots
  cloudflareProject: 'markdown-to-pdf',    // Cloudflare Pages project name (used by npm run deploy)
  keyword: 'markdown to pdf',         // main keyword
  h1: 'Markdown to PDF',              // exact text of the page H1
  title: 'Markdown to PDF Converter Online: Free, No Upload', // home page <title>, under 60 characters
  keywords: ['markdown to pdf converter', 'convert markdown to pdf online', 'md to pdf', 'markdown to pdf free', 'markdown editor with preview', 'readme to pdf'], // supporting keywords
  tagline: 'Free, private, no watermark',  // short line shown above the page heading
  description:
    'Convert Markdown to PDF free in your browser. Live preview, tables, code highlighting, themes, Letter or A4. No upload, no watermark, no limit.',
  email: 'hello@markdowntopdfonline.com',       // contact email (shown on Contact and Privacy pages)
  ga4: '',                            // GA4 measurement ID, e.g. 'G-XXXXXXXXXX'. Empty = Google Analytics off
  adsense: '',                        // AdSense publisher ID, e.g. 'ca-pub-1234567890123456'. Empty = ads off
  brand: '#4338ca',                   // brand color (hex)
  locale: 'en-US',                    // BCP 47 language tag
  ogImage: '/og.png',                        // e.g. '/og.png' (1200x630 file in public/). Empty = no image
  category: 'DeveloperApplication',   // schema.org applicationCategory
  owner: 'Markdown to PDF',               // name used in legal pages (person or business)
};
