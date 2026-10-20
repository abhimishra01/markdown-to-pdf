import { SAMPLE_MATH } from '../lib/markdown.js';

// Long-tail landing pages. Each one has its own text and presets the tool for that job.
// Writing rules: US English, short sentences, no em dashes, no hype.
export interface Block { h2: string; p?: string[]; ul?: string[]; ol?: string[]; }
export interface Landing {
  slug: string;
  short: string;                 // link text on the home page
  title: string;                 // <title>, under 60 characters
  h1: string;
  description: string;
  tagline: string;
  preset: { sample?: string; theme?: string; paper?: string; margin?: string; size?: string; orient?: string; numbers?: boolean; fm?: boolean };
  intro: string;
  blocks: Block[];
  faq: { q: string; a: string }[];
}

const README = `# Acme API Client

A small client for the Acme REST API. It handles sign-in, retries and paging for you.

## Install

\`\`\`bash
npm install acme-client
\`\`\`

## Quick start

\`\`\`js
import { Acme } from 'acme-client';

const acme = new Acme({ token: process.env.ACME_TOKEN });
const orders = await acme.orders.list({ status: 'open' });
console.log(orders.length);
\`\`\`

## Options

| Option    | Type    | Default | What it does                  |
|:----------|:--------|:--------|:------------------------------|
| \`token\`   | string  | none    | Your API token                |
| \`retries\` | number  | 3       | Tries again after a failure   |
| \`timeout\` | number  | 10000   | Time limit in milliseconds    |

> [!NOTE]
> The client needs Node 20 or newer.

## Roadmap

- [x] Orders
- [x] Paging
- [ ] Webhooks
- [ ] Browser build

## License

MIT
`;

const CONTENTS = `# Team handbook

Put the cursor on the empty line below the next line, then press **Insert contents**. A linked list of the headings appears there.

<!-- cursor here -->


## Welcome

This handbook covers how we work. Read it once, then keep it close.

## Working hours

Core hours are 10:00 to 15:00. Outside those hours, work when it suits you.

### Time off

Tell your lead in advance. Add the dates to the shared calendar.

### Public holidays

Follow the calendar of the country where you live.

## Tools

We use one chat tool, one tracker, and one shared drive.

### Chat

Use threads. Keep each topic in one place.

### Tracker

Every task has an owner and a due date.

## Who to ask

Ask your lead first. If they are away, ask the team channel.
`;

const NUMBERS = `# Quarterly report

A short report with page breaks, so you can see page numbers on every page.

## Summary

Revenue grew 12 percent. Support tickets fell by a third. We hired two people.

<!-- pagebreak -->

## Revenue

| Month | Revenue | Change |
|:------|--------:|-------:|
| July  | $41,200 |    +4% |
| Aug   | $44,900 |    +9% |
| Sept  | $46,100 |    +3% |

Most of the growth came from existing customers.

<!-- pagebreak -->

## Next quarter

- [ ] Launch the new plan
- [ ] Cut the first-reply time to one hour
- [ ] Review the budget in November
`;

const NOTES = `# Meeting notes

**Date:** 12 March  
**People:** Ana, Ben, Chi

## Decisions

1. Ship the beta on Friday.
2. Move the review to Tuesday.

## Actions

- [x] Ana: send the invite
- [ ] Ben: update the plan
- [ ] Chi: test on a phone

## Notes

The first test run took 4 minutes. We want it under 1 minute.
`;

const CLIENT = `# Project proposal

Prepared for a client. This PDF has no watermark, no logo from us, and no limit on pages.

## Scope

We will redesign the sign-up flow and test it with ten users.

## Timeline

| Week | Work                  |
|-----:|:----------------------|
|    1 | Research and mockups  |
|    2 | Build and test        |
|    3 | Fixes and hand-off    |

## Cost

Fixed price: **$4,800**. Payment is due in two parts.
`;

const PRIVATE = `# Private notes

These notes stay on this device. Turn off your network and the page still converts them.

## Contract review

- [x] Read clauses 4 to 9
- [ ] Ask about the notice period

## Salary range

Keep these figures out of any online converter that uploads text.
`;

const GITHUB = `---
title: Release notes
version: 2.4.0
tags: [api, sdk]
---

# Release notes :rocket:

> [!IMPORTANT]
> Version 2.4.0 changes the default timeout.

## What is new

- :sparkles: Faster paging
- :bug: Fixed a retry loop
- :memo: New docs

> [!TIP]
> Set \`timeout\` yourself to keep the old behavior.

> [!WARNING]
> The \`legacy\` flag will be removed in 3.0.

## Checklist

- [x] Tests pass
- [x] Docs updated
- [ ] Announce the release

Thanks to everyone who helped.[^1]

[^1]: Names are in the changelog.
`;

export const landing: Landing[] = [
  {
    slug: 'markdown-to-pdf-no-watermark',
    short: 'No watermark',
    title: 'Markdown to PDF with No Watermark, Free',
    h1: 'Markdown to PDF with no watermark',
    description: 'Turn Markdown into a clean PDF with no watermark, no sign-up, and no daily limit. It runs in your browser, so nothing is uploaded.',
    tagline: 'No watermark, no limit',
    preset: { sample: CLIENT, theme: 'clean' },
    intro: 'Some online converters give you a few clean PDFs a day. After that they stamp a watermark on every page, or ask for a payment or an account. This page does not. Every PDF is clean, on the first file and on the thousandth.',
    blocks: [
      { h2: 'Why there is nothing to remove', p: [
        'The PDF is made by your own browser, from the page you see in the preview. We have no server that builds files, so there is no queue, no counter, and no reason to add a mark. You do not need to log in, and you do not need a credit card.',
        'That also means there is no limit to count. Convert one file or fifty. The only cap is the size of the text box, which is 5 MB.',
      ] },
      { h2: 'How to get a clean PDF', ol: [
        'Paste your Markdown, or press Open .md file.',
        'Check the preview. Pick a theme, a paper size, and the margins.',
        'Press Download PDF. In the print window, set Destination to Save as PDF.',
        'Turn off Headers and footers so the page carries only your text.',
      ] },
      { h2: 'What the page keeps off your PDF', ul: [
        'No watermark, logo, or "made with" line.',
        'No date or web address in the margins, once you turn off Headers and footers.',
        'No blank last page. A page break at the very end is dropped for you.',
        'No hidden metadata from us. The PDF title comes from your first heading.',
      ] },
      { h2: 'Check the output before you send it', p: [
        'Open the saved file and look at three things. First, select a line of text. Real text is selectable, which also means search works. Second, click a link. Links stay live. Third, scroll to a table that crosses a page. The header row repeats on the next page.',
        'If a heading sits at the bottom of a page by itself, the page was probably edited after you made the PDF. Headings are set to stay with the text that follows them.',
      ] },
    ],
    faq: [
      { q: 'Will a watermark appear after a few files?', a: 'No. There is no counter. The page does not know how many PDFs you made, because it does not keep that count anywhere.' },
      { q: 'Is it really free?', a: 'Yes. There is no payment step and no account. The site may show ads in the future, but never on your PDF.' },
      { q: 'Can I use the PDF for work or for clients?', a: 'Yes. The PDF is your document. We add nothing to it, so you can send it as is.' },
    ],
  },
  {
    slug: 'markdown-to-pdf-no-upload',
    short: 'No upload',
    title: 'Markdown to PDF Without Uploading Your Text',
    h1: 'Markdown to PDF without upload',
    description: 'Convert Markdown to PDF on your own device. Your text is never sent to a server. Good for contracts, notes, and private drafts.',
    tagline: 'Your text stays on your device',
    preset: { sample: PRIVATE, theme: 'clean' },
    intro: 'Most online converters send your file to a server, build the PDF there, and send it back. That is fine for a recipe. It is not fine for a contract, a salary table, or notes about a person. This converter does all the work in your browser.',
    blocks: [
      { h2: 'What "no upload" means here', p: [
        'When you type or paste, the text goes into a box on this page. The preview and the PDF are built from that box by code that is already on your device. No request carries your text out.',
        'You can check this yourself. Open your browser developer tools, go to the Network tab, and type. You will see no request that holds your text.',
      ] },
      { h2: 'What the page does store', ul: [
        'A copy of your last draft, in your browser storage, so a refresh does not lose it. The Clear button removes it.',
        'Your choices for theme, paper, and margins.',
        'Nothing else. There are no accounts, and no server copy.',
      ] },
      { h2: 'Two small things to know', p: [
        'If your Markdown links to an image on the web, your browser loads that image from the site that holds it. That site can see the request. Use images you have saved as data links if that matters to you.',
        'On a shared computer, press Clear when you are done, and close the tab. The saved draft would otherwise stay in that browser.',
      ] },
      { h2: 'Steps', ol: [
        'Paste your Markdown into the editor.',
        'Pick the theme, paper, and margins.',
        'Press Download PDF and choose Save as PDF.',
        'Press Clear to remove the saved draft.',
      ] },
    ],
    faq: [
      { q: 'How can I be sure nothing is uploaded?', a: 'Open the Network tab in your browser developer tools and type in the editor. No request carries your text. You can also turn off your network after the page loads and the converter still works.' },
      { q: 'Is a saved draft the same as an upload?', a: 'No. The draft stays in your own browser. It never reaches a server. The Clear button removes it.' },
      { q: 'Does the PDF contain tracking or hidden data?', a: 'No. The browser writes the PDF. It holds your text, your styles, and a title taken from your first heading.' },
    ],
  },
  {
    slug: 'readme-to-pdf',
    short: 'README to PDF',
    title: 'README to PDF: Free, Private, No Watermark',
    h1: 'README to PDF',
    description: 'Turn a README.md into a clean PDF with code colors, tables, and task lists. Free, private, and no watermark. Paste it or open the file.',
    tagline: 'README.md to a clean PDF',
    preset: { sample: README, theme: 'technical', numbers: true },
    intro: 'A README is written for developers, but you often need to hand it to someone who does not use Git. A manager, a client, or an auditor wants a file they can open. Here is the fast way: open the README, check the preview, save a PDF.',
    blocks: [
      { h2: 'Steps for a README', ol: [
        'Press Open .md file and choose README.md. You can also drag the file onto the editor.',
        'Pick the Technical theme. It uses tighter spacing and a code style close to the one on GitHub.',
        'Press Insert contents if the README is long and has no table of contents.',
        'Turn on page numbers, then press Download PDF and choose Save as PDF.',
      ] },
      { h2: 'What READMEs use, and what happens to it', ul: [
        'Code blocks keep their colors. Name the language after the three backticks.',
        'Tables print with borders. The header row repeats when a table runs onto the next page.',
        'Task lists print as open and checked boxes.',
        'Alert blocks such as NOTE and WARNING print with a colored bar.',
        'Badges and images show if their address allows hotlinking. A badge that fails to load shows its alt text instead.',
        'HTML such as details and kbd works. Unsafe HTML is removed.',
      ] },
      { h2: 'Relative links and images', p: [
        'A README often points to files in the repository, such as ./docs/setup.md or ./img/logo.png. A browser has no repository, so those paths cannot load. Replace them with full web addresses before you convert. A raw GitHub address works for images.',
        'Links to headings inside the README work. [Install](#install) jumps to the heading named Install, in the preview and in the PDF.',
      ] },
      { h2: 'Long code lines', p: ['Long lines wrap inside the code block instead of running off the page. Short blocks stay on one page. A block of more than about 38 lines is allowed to split across pages.'] },
    ],
    faq: [
      { q: 'Can I convert a README from a private repository?', a: 'Yes. Copy the text from your own checkout and paste it here. Nothing is uploaded, so the content stays private.' },
      { q: 'Why is my badge missing?', a: 'The badge image did not load. The service that hosts it may block hotlinking, or your network may block it. The rest of the page is not affected.' },
      { q: 'Does it keep the front matter?', a: 'By default it removes the front matter block. Turn on "Print as a table" to show it as a small table at the top.' },
    ],
  },
  {
    slug: 'markdown-to-pdf-with-table-of-contents',
    short: 'With table of contents',
    title: 'Markdown to PDF with a Table of Contents',
    h1: 'Markdown to PDF with a table of contents',
    description: 'Add a linked table of contents to a Markdown file with one click, then save it as a PDF. Links jump to the headings. Free and private.',
    tagline: 'One click builds the contents',
    preset: { sample: CONTENTS, theme: 'clean', numbers: true },
    intro: 'Writing a table of contents by hand is slow, and it goes out of date the moment you rename a heading. This page builds it for you. Press one button and a linked list of your headings appears at the cursor.',
    blocks: [
      { h2: 'How to add the contents', ol: [
        'Paste your Markdown, or open the file.',
        'Click in the editor where the contents should go, usually under the title.',
        'Press Insert contents. A "Contents" heading and a linked list appear.',
        'Press Download PDF. Each entry is a link that jumps to its heading in the PDF.',
      ] },
      { h2: 'What goes into the list', ul: [
        'Headings at level 2 and level 3. Level 4 and below are left out so the list stays short.',
        'The first level 1 heading is treated as the title and is skipped when it is the only one.',
        'Headings inside code blocks are ignored, so a shell comment that starts with # is not listed.',
        'An existing "Contents" heading is not listed in itself.',
        'Two headings with the same name get separate links.',
      ] },
      { h2: 'Keeping the list current', p: [
        'The list is plain Markdown after you insert it. It does not update on its own. If you add or rename a heading, delete the old list and press the button again.',
        'You can also edit the list by hand. Remove entries you do not want, or change the labels. The links only need to keep the same name as the heading, in lowercase with hyphens.',
      ] },
      { h2: 'Page numbers', p: ['A contents list is more useful with page numbers on the pages. Turn on Page numbers before you download. They print in the footer as "1 / 3" in Chrome and Edge. The list itself does not show the page of each entry, because a browser cannot know that in advance.'] },
    ],
    faq: [
      { q: 'Do the contents entries show page numbers?', a: 'No. Each entry is a link to its heading. The pages carry their own numbers in the footer if you turn that on. A browser cannot know which page a heading lands on before it prints.' },
      { q: 'Can I limit the list to level 2 headings?', a: 'Insert the list, then delete the lines that start with two spaces. Those are the level 3 entries.' },
      { q: 'Will the links work in the PDF?', a: 'Yes. In a PDF viewer, clicking an entry jumps to its heading.' },
    ],
  },
  {
    slug: 'markdown-to-pdf-with-page-numbers',
    short: 'With page numbers',
    title: 'Markdown to PDF with Page Numbers',
    h1: 'Markdown to PDF with page numbers',
    description: 'Add page numbers to a PDF made from Markdown. Pick the paper size and margins, then save. Free, private, and no watermark.',
    tagline: 'Numbered pages, no sign-up',
    preset: { sample: NUMBERS, numbers: true, theme: 'clean' },
    intro: 'Page numbers help when people print a document or talk about it on a call ("see page 3"). Turn on one switch and every page gets a number in the footer.',
    blocks: [
      { h2: 'Turn on page numbers', ol: [
        'Open or paste your Markdown.',
        'Tick Add to footer under Page numbers. The sample on this page already has it on.',
        'Press Download PDF and choose Save as PDF.',
        'Look at the footer of the saved file. It reads "1 / 3", "2 / 3", and so on.',
      ] },
      { h2: 'Which browsers draw them', p: [
        'Chrome and Edge draw the numbers. At the time of writing, Safari and Firefox do not draw page numbers from a web page, so the PDF has none there. If you use one of those, open the same page in Chrome or Edge to make the PDF.',
        'On a phone, Safari on iPhone does not draw them. Chrome for Android may. Open the saved file and check.',
      ] },
      { h2: 'Start a new page where you want one', p: [
        'Put <!-- pagebreak --> alone on a line. A new page starts there. The sample shows this: a summary on page one, a table on page two, and a list on page three.',
      ] },
      { h2: 'Paper size and margins', ul: [
        'US Letter for the United States and Canada. A4 for most other places.',
        'Narrow margins (0.5 in) fit more on a page. Wide margins (1 in) suit letters and essays.',
        'Landscape helps with wide tables.',
        'The page count under the buttons updates as you type, so you know how many numbers to expect.',
      ] },
    ],
    faq: [
      { q: 'Can I start numbering from page 2?', a: 'No. Numbering starts at 1 on the first page. If you need a cover without a number, make the cover as a separate file and join the PDFs in a viewer.' },
      { q: 'Why do I see "1 / 3" and not just "1"?', a: 'The footer shows the page and the total. It helps a reader of a printout know that no page is missing.' },
      { q: 'The numbers are missing in my PDF. Why?', a: 'Your browser may not draw them. Use Chrome or Edge on a computer. Also check that the box is ticked before you press Download PDF.' },
    ],
  },
  {
    slug: 'markdown-to-pdf-on-iphone',
    short: 'On iPhone',
    title: 'Markdown to PDF on iPhone and iPad, Free',
    h1: 'Markdown to PDF on iPhone',
    description: 'Make a PDF from Markdown on your iPhone or iPad in Safari. No app, no sign-up, and no upload. Step by step, with the Save to Files tip.',
    tagline: 'No app to install',
    preset: { sample: NOTES, theme: 'clean', margin: 'narrow' },
    intro: 'You can turn a Markdown file into a PDF on an iPhone without an app. The page works in Safari. The only tricky part is the last step, because iOS hides the PDF behind a pinch gesture. This guide shows it.',
    blocks: [
      { h2: 'Steps on iPhone and iPad', ol: [
        'Open this page in Safari.',
        'Paste your Markdown into the editor. To open a file, press Open .md file and pick it from Files.',
        'Check the preview below the editor. The editor and preview stack on a small screen.',
        'Press the Download PDF button at the bottom of the screen.',
        'On the print preview that opens, spread two fingers apart over the page. The PDF opens full screen.',
        'Tap the Share button, then Save to Files. You can also send it to Mail or Messages from there.',
      ] },
      { h2: 'Tips for a small screen', ul: [
        'Use narrow margins. They fit more text on a small page, and the sample on this page has them on.',
        'Wide tables scroll sideways in the preview. In the PDF they are laid out at paper width.',
        'Turn your phone sideways to see more of the editor.',
        'Tap Clear when you finish, so the saved draft does not stay on the phone.',
      ] },
      { h2: 'Where the text goes', p: ['The conversion runs in Safari on your phone. Your text is not sent to a server. The PDF is made on the device and goes to Files, where only you can see it.'] },
      { h2: 'Page numbers on iPhone', p: ['Safari does not draw page numbers in print. If you need them, make the PDF on a computer in Chrome or Edge. The page count in the status line still works as a guide.'] },
    ],
    faq: [
      { q: 'I tapped Download PDF and see a print screen, not a file. Is that right?', a: 'Yes. On iPhone the print preview is the step before the file. Spread two fingers over the page to open the PDF, then use Share and Save to Files.' },
      { q: 'Can I open a .md file from the Files app?', a: 'Yes. Press Open .md file and pick the file. If the file shows as gray, copy its text and paste it into the editor.' },
      { q: 'Does it work in Chrome on iPhone?', a: 'It works, but Chrome on iPhone uses the same engine as Safari. The steps are the same.' },
    ],
  },
  {
    slug: 'markdown-to-pdf-on-android',
    short: 'On Android',
    title: 'Markdown to PDF on Android, Free and Private',
    h1: 'Markdown to PDF on Android',
    description: 'Save Markdown as a PDF on your Android phone or tablet in Chrome. No app, no upload, no watermark. Step by step.',
    tagline: 'Works in Chrome, no app',
    preset: { sample: NOTES, theme: 'clean', margin: 'narrow', numbers: true },
    intro: 'On Android, Chrome has a built-in PDF printer. This page uses it. You paste your Markdown, press one button, and save a PDF to your phone. You do not need an app.',
    blocks: [
      { h2: 'Steps in Chrome', ol: [
        'Open this page in Chrome.',
        'Paste your Markdown, or press Open .md file and choose a file from your phone.',
        'Check the preview. Pick a theme and the paper size.',
        'Press Download PDF at the bottom of the screen.',
        'At the top of the print screen, set Destination to Save as PDF.',
        'Tap the round PDF button, choose a folder, and tap Save.',
      ] },
      { h2: 'Tips for Android', ul: [
        'Page numbers are switched on in the sample on this page. Open the saved file to check that your phone drew them. Chrome on a computer always does.',
        'The file name comes from your first heading. You can change it when you save.',
        'Use A4 outside the United States and Canada, and Letter inside them.',
        'If the keyboard hides the Download button, tap outside the editor and it comes back.',
      ] },
      { h2: 'Other browsers on Android', p: [
        'Samsung Internet and Firefox have their own print screens. Both can save as PDF, but the steps differ and page numbers may not print. If your PDF looks different from the preview, try Chrome.',
      ] },
      { h2: 'Privacy', p: ['The page converts your text on the phone. It does not send the text to a server. The PDF goes to the folder you pick.'] },
    ],
    faq: [
      { q: 'Where is my PDF after I save it?', a: 'It is in the folder you picked. Open the Files app and look in Downloads if you did not change the folder.' },
      { q: 'Can I share the PDF straight away?', a: 'Yes. Open the file from Files and use the Share button to send it by mail or chat.' },
      { q: 'Why does the print screen show a small preview?', a: 'That preview is only a guide on a small screen. The saved PDF uses the paper size you chose.' },
    ],
  },
  {
    slug: 'markdown-to-pdf-offline',
    short: 'Offline',
    title: 'Markdown to PDF Offline in Your Browser',
    h1: 'Markdown to PDF offline',
    description: 'Convert Markdown to PDF with no server. Once the page is open, it needs no network for the conversion. Private by design.',
    tagline: 'Works after the page has loaded',
    preset: { sample: PRIVATE, theme: 'clean' },
    intro: 'This tool needs a network only to load the page. After that, the conversion runs on your device. If your connection drops while you work, the preview and the PDF still work.',
    blocks: [
      { h2: 'What works without a network', ul: [
        'Typing, pasting, and opening files.',
        'The live preview, tables, task lists, footnotes, and code colors.',
        'Alert blocks, emoji shortcodes, and the front matter table.',
        'Insert contents, page numbers, paper size, and margins.',
        'Download PDF and Save as PDF.',
      ] },
      { h2: 'What needs a network first', p: [
        'Diagrams and formulas use extra code that loads the first time a document has one. Draw one diagram or one formula while you are online, and it stays available for that visit. Images you link from the web also need a network.',
        'This page is not an installable app, and it does not keep itself after you close the tab. If you want to work somewhere with no signal, open the page first, and keep the tab open.',
      ] },
      { h2: 'Why it needs no server', p: [
        'The Markdown is read by code in your browser. Your browser also draws the pages and writes the PDF with its own print feature. There is nothing to call. That is why no text is uploaded, and why there is no daily limit.',
      ] },
      { h2: 'A quick test', ol: [
        'Open the page and wait for the sample to show.',
        'Turn on airplane mode.',
        'Edit the text. The preview keeps updating.',
        'Press Download PDF. The print window opens as normal.',
      ] },
    ],
    faq: [
      { q: 'Can I use it on a plane?', a: 'Yes, if you open the page before you lose the connection and keep the tab open. Do not refresh it while offline.' },
      { q: 'Will my draft be there next time?', a: 'Yes. The page saves your last draft in your browser. It stays on your device until you press Clear.' },
      { q: 'Is there a desktop app?', a: 'No. It is a web page. The browser does the work, which is why it stays small and private.' },
    ],
  },
  {
    slug: 'markdown-to-pdf-with-math-and-diagrams',
    short: 'Math and diagrams',
    title: 'Markdown to PDF with Math and Diagrams',
    h1: 'Markdown to PDF with math and diagrams',
    description: 'Convert Markdown with formulas and flowcharts to PDF. Write math between dollar signs and diagrams in a code block. Free and private.',
    tagline: 'Formulas and flowcharts',
    preset: { sample: SAMPLE_MATH, theme: 'clean' },
    intro: 'Notes for school, research, and design often hold formulas and flowcharts. Write them as plain text in your Markdown. The page draws them in the preview and in the PDF. The extra code loads only when your document uses it, so plain documents stay fast.',
    blocks: [
      { h2: 'Math', p: [
        'Put a formula between single dollar signs for a formula inside a line, such as $E = mc^2$. Put it between double dollar signs on their own lines for a large centered formula.',
        'The formula language is the one used by LaTeX, for example \\frac{a}{b} for a fraction and \\int for an integral. A price such as $5 is not treated as math, because a dollar sign followed by a space or a number is left alone.',
      ] },
      { h2: 'Diagrams', p: [
        'Start a code block with the word mermaid after the three backticks. Write the diagram as text inside it. The page draws a flowchart, a sequence diagram, a pie chart, or one of the other types the diagram language supports.',
        'If the diagram has an error, the page shows the message "This diagram could not be drawn" and keeps your text so you can fix it.',
      ] },
      { h2: 'Steps', ol: [
        'Press Diagram and math sample to see both at work.',
        'Replace the formula and the flowchart with your own.',
        'Check that nothing is cut off in the preview.',
        'Press Download PDF and choose Save as PDF.',
      ] },
      { h2: 'In the PDF', ul: [
        'Formulas and diagrams stay sharp at any zoom, because they are drawn as shapes and not as a picture.',
        'A diagram or a block formula is kept on one page, not split in half.',
        'Wide diagrams shrink to fit the page. Use landscape if the text gets too small.',
      ] },
    ],
    faq: [
      { q: 'Do I need to install anything for math?', a: 'No. The code that draws math and diagrams is part of this site. It loads when your document has a formula or a diagram. Nothing is sent out.' },
      { q: 'Why is my dollar amount shown as a formula?', a: 'A formula needs a dollar sign with no space after it and another with no space before it. If you write "$5 and $10", it stays text. Put a backslash before a dollar sign to be sure.' },
      { q: 'Which diagrams can I draw?', a: 'Flowcharts, sequence diagrams, class diagrams, state diagrams, pie charts, and others from the Mermaid language. Start the code block with the word mermaid.' },
    ],
  },
  {
    slug: 'github-markdown-to-pdf',
    short: 'GitHub Markdown',
    title: 'GitHub Markdown to PDF: Alerts, Emoji, Tasks',
    h1: 'GitHub Markdown to PDF',
    description: 'Convert GitHub-flavored Markdown to PDF, with alert blocks, emoji shortcodes, task lists, tables, and footnotes. Free and private.',
    tagline: 'GitHub-flavored Markdown',
    preset: { sample: GITHUB, theme: 'technical', fm: true },
    intro: 'GitHub adds a few things to plain Markdown: tables, task lists, strikethrough, footnotes, alert blocks, and emoji shortcodes. This converter reads all of them, so a file that looks right on GitHub looks right in the PDF.',
    blocks: [
      { h2: 'What is supported', ul: [
        'Alert blocks: NOTE, TIP, IMPORTANT, WARNING, and CAUTION. Each prints with its own color and a label.',
        'Emoji shortcodes such as :rocket:, :sparkles:, and :white_check_mark:. More than 200 of the common ones work.',
        'Task lists with open and checked boxes.',
        'Tables with left, center, and right alignment.',
        'Footnotes, strikethrough, and automatic heading links.',
        'Code blocks with colors for common languages.',
      ] },
      { h2: 'How to write an alert', p: [
        'Start a block quote with the alert name in square brackets and an exclamation mark, on its own line. Then write the text on the lines that follow. The sample on this page has an IMPORTANT, a TIP, and a WARNING block.',
      ] },
      { h2: 'Front matter', p: [
        'Some files start with a block between two lines of three dashes. It holds the title, version, and tags. By default the PDF leaves it out. The sample on this page turns on "Print as a table", so you see the block as a small table at the top.',
      ] },
      { h2: 'Steps', ol: [
        'Open or paste the .md file.',
        'Pick the Technical theme for a GitHub-like look.',
        'Decide if the front matter should print as a table.',
        'Press Download PDF and choose Save as PDF.',
      ] },
      { h2: 'Where it differs from GitHub', p: [
        'GitHub turns issue numbers like #12 and user names like @name into links. This converter does not, because it has no repository to look them up in. Relative file paths do not load either. Use full web addresses.',
      ] },
    ],
    faq: [
      { q: 'Does it support every emoji shortcode?', a: 'It supports more than 200 common ones. If a name is not on the list, it stays as typed, for example :nope:, so nothing breaks.' },
      { q: 'Are GitHub alerts the same as block quotes?', a: 'They start as block quotes. When the first line is [!NOTE] or another alert name, the block prints as an alert with a colored bar.' },
      { q: 'Can I convert a whole repository?', a: 'No. This page converts one file at a time. Open each file and save its PDF.' },
    ],
  },
];

export const bySlug = (slug: string) => landing.find((l) => l.slug === slug);
