# Mock customer test: Markdown to PDF

Date: 2026-10-20. Tester: Shuri. Build: `astro build --outDir dist-customers`, served on port 4517 (own folder, shared dist/ untouched). Each persona used the live page with playwright-cli in a named session at their own viewport. Print output was checked by saving the print PDF and viewing it.

## What I measured
- 4,200 word, 17 page document: render 45 ms, 28 ms per keystroke. Fast.
- No third-party requests on load (CSS, JS, favicon only). Scripts, `onerror`, `javascript:` links, iframes and `style` attributes are removed.
- Print PDF of the RFC test: real text, code colors, table, task list, footnote all correct on Letter.

## Persona stories

### 1. Dana, 34, backend software engineer, desktop 1440x900 (the owner's use case)
Task: turn a design doc (RFC) into a PDF for reviewers. She does this every week, today with `pandoc` or "Print to PDF" from VS Code.
She pasted the doc. The Go and Python blocks were colored, the table was aligned, the task list showed boxes, and the footnote worked. The PDF looked like GitHub. She was pleased for about two minutes. Then she hit the gaps. Her doc starts with YAML front matter. It showed up as a big heading and a rule, which looks broken. `[TOC]` printed as the literal text. A `<details>` block (common in READMEs) showed only its summary, so the hidden text would be missing from the PDF. A mermaid block printed as plain code. Her `<div style="page-break-after: always">` did nothing because `style` is stripped, so she has no way to force a page break. A relative image shows nothing. Emoji shortcodes and math print as typed. The page refresh kept her text, which she liked.
- Click this on Google over the others? Yes, if the snippet says "no upload, no watermark". The others ask for sign-in or add a watermark.
- Done in under 30 seconds? Yes for plain docs. No for a doc with front matter.
- Confused me: the saved file name. The browser will propose "Markdown to PDF Converter_ Free, No Upload.pdf". I would rename it every time.
- Missing to bookmark: file name from my H1, front matter handled, page breaks, auto table of contents, `<details>` open in print.
- Trust: yes, the preview matches the PDF, and nothing leaves the page.
- Come back: yes, weekly, once the file name and front matter are fixed.

### 2. Priya, 22, graduate student, iPhone 390x844 (beginner)
Task: turn her study notes, pasted from a chat tool, into a PDF to read on the train.
The page loaded fast. The Download button is first on the phone, which is good. She replaced the sample text and the preview looked right: headings, numbered list, table. Then she scrolled to check the preview and the Download button was far up the page. She had to scroll back. When she tapped it, the help line says "Choose Save as PDF as the destination". On an iPhone there is no such destination. She did not know to pinch the print preview or use Share, Save to Files.
- Google click? Yes, "free" and "no upload" matter to her.
- Under 30 seconds? About 40 seconds because of the scroll up and the print dialog.
- Confused me: the print dialog on my phone has no "destination". The sample text is in the box and I did not know to press Clear first.
- Missing to bookmark: a Download button I can reach while I read the preview, and phone-specific steps for iPhone and Android.
- Trust: yes.
- Come back: yes, for each exam.

### 3. Marcus, 45, freelance technical writer, desktop 1280x800 (expert, long documents)
Task: a 16-page installation guide for a client, A4, serif theme, page numbers.
Speed was fine. He picked A4, Classic, page numbers on, and the status line said about 16 pages. The classic theme looks good. The page numbers are done with an `@page` footer. The preview does not show page breaks or page numbers, so he cannot tell where a table will split. He wanted a title in the header or footer, a cover page, a table of contents, and a way to start each H2 on a new page. None exist. The file name problem hit him too.
- Google click? Maybe. I search "markdown to pdf with table of contents" and this does not say it has one.
- Under 30 seconds? Yes for the first PDF.
- Confused me: the footer says "1 / 16" in Chrome only. I want to know before I send it to a client. The FAQ says Safari and Firefox may skip it.
- Missing to bookmark: table of contents, page break control, header or footer text, "break before each H2", page breaks shown in the preview.
- Trust: mostly. The page count is an estimate ("about").
- Come back: only if the table of contents and page breaks arrive.

### 4. Linda, 58, owner of a small bakery, Android 360x740 (beginner)
Task: a developer friend sent her a `.md` file of the new menu. She wants a PDF to print.
She tapped Open .md file, picked the file, and it loaded. The preview showed the menu. But her three menu lines ("Soup of the day", "Bread basket", "House salad") were joined into one line. In Markdown a single new line does not break the line, and nothing on the page tells her. She did not know why it looked wrong. She also does not know what "Markdown" is, and the page never says what the file is or what the odd symbols mean. The logo and the "About" link touch each other at 360 px.
- Google click? She would search "open md file" and click whatever explains it. This page's top text says nothing for her.
- Under 30 seconds? No. She was stuck on the joined lines.
- Confused me: why my lines joined. What is "Save as PDF as destination"?
- Missing to bookmark: a "keep my line breaks" switch, one plain sentence at the top about what a .md file is, and phone steps.
- Trust: she likes "stays on your device".
- Come back: only if someone shows her again.

### 5. Sam, 41, site reliability engineer, desktop 1366x768 (expert, security minded)
Task: print a runbook to PDF for an audit, and check the page is safe to paste internal text into.
He opened the network tab: no third-party calls, no analytics before consent, fonts and libraries local. He tried `<img onerror>`, `javascript:` links, `<svg onload>`, an iframe, and `target="_blank"`. All were removed or neutralized, and links got `rel="noopener noreferrer"`. Dark mode works. He noticed one gap: a remote image (a tracking pixel) still loads in the preview and in print. He would prefer a warning or a block, since the page promises privacy. He also liked that the draft is kept in the browser and that Clear removes it, but he wants to know the draft is stored (the FAQ says so).
- Google click? Yes, the "no upload" line.
- Under 30 seconds? Yes.
- Confused me: nothing. The privacy page should name the stored draft.
- Missing to bookmark: option to block remote images, Tab key to indent code (Tab moves focus away from the box), a way to save the `.md` back.
- Trust: high.
- Come back: yes.

## Ranked change list
Counts show how many of the 5 personas asked for it or were hurt by it.

### Must
1. **File name from the first heading (5 of 5 hit it, 2 asked).** Set `document.title` to the H1 (or "document") just before `window.print()` and restore it after. Today the saved file is named "Markdown to PDF Converter_ Free, No Upload.pdf".
2. **Strip YAML front matter (1 asked, any developer README or note will have it).** Remove `---` blocks at the top, or show title and date as a small header. Today it prints as a heading and a rule.
3. **Phone guidance and a reachable Download button (3 of 5: Priya, Linda, Marcus on Safari).** Detect iOS and Android and show the right steps ("Share, then Save to Files" on iPhone). Add a sticky Download bar on phones, so it stays in reach while reading the preview.
4. **"Keep line breaks" switch (2 of 5, and it is the top fix for non-technical users).** Single new lines join into one line. Add a checkbox (default on for a first-time user, or auto-detect plain text) and explain it in one short line.
5. **`<details>` content prints (1 asked, common in READMEs).** Open all `<details>` in the print copy and in the preview, so the text is not lost from the PDF.

### Should
6. **Page break control (2 of 5: Dana, Marcus).** Support `<div class="page-break"></div>` or a `\newpage` line, plus a "new page before each H2" option.
7. **Table of contents (2 of 5).** Support `[TOC]` and an "Add contents" checkbox.
8. **One plain sentence at the top for beginners (2 of 5: Priya, Linda).** Say what Markdown and a .md file are, and that the sample text can be cleared. The H1 and tagline say nothing to a non-developer.
9. **Remote images (1 of 5, trust issue).** Warn in the status line that an image loads from another site, or add "Block remote images".
10. **Show page breaks in the preview (2 of 5).** A faint line where each page ends, and the footer number in the preview, so people can see where tables split.
11. **Tab key indents in the editor (1 asked; others did not test).** Keep Esc then Tab to leave the box, so keyboard users are not trapped.

### Nice
12. Mermaid diagrams (1). Large library, so maybe a later tool.
13. Header and footer text such as title and date (1).
14. Math with `$...$` and emoji shortcodes (1).
15. Relative images: a note that local images need a full URL or a pasted data link (1).
16. Save the `.md` back to disk (1).
17. At 360 px the logo and "About" link touch; tighten the header (1).
