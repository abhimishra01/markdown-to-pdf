// FAQ items. Rendered on the home page AND output as FAQPage JSON-LD.
export const faq = [
  { q: 'How do I convert Markdown to PDF?', a: 'Paste your Markdown or open a .md file. Check the preview, choose a theme and paper size, then press Download PDF. In the print dialog that opens, pick Save as PDF as the destination.' },
  { q: 'Is this online Markdown to PDF converter free? Is there a watermark?', a: 'It is free. There is no watermark, no sign-up, and no limit on the number of PDFs. The text can be up to 5 MB.' },
  { q: 'Is my text uploaded to a server?', a: 'No. The conversion runs in your browser. Your text stays on your device. If your Markdown links to an image on the web, your browser loads that image from its own server. The page saves your last draft in your browser storage so you do not lose it, and you can clear it with the Clear button.' },
  { q: 'Can I select and copy the text in the PDF?', a: 'Yes. The PDF holds real text, not a picture. You can select it, search it, and copy it. Links stay clickable.' },
  { q: 'Which Markdown features work?', a: 'Headings, bold, italic, strikethrough, links, images, lists, task lists, tables, block quotes, footnotes, and fenced code blocks with syntax colors for common languages such as JavaScript, Python, SQL, and JSON. It also draws math written between dollar signs, Mermaid diagrams, GitHub alert blocks such as [!NOTE], and emoji shortcodes such as :rocket:.' },
  { q: 'Can I use A4 instead of US Letter?', a: 'Yes. Choose A4 or US Letter in the Paper menu. You can also set narrow, normal, or wide margins and a small, medium, or large text size.' },
  { q: 'How do I add page numbers to the PDF?', a: 'Turn on Page numbers before you download. They print as "1 / 3" in the footer in Chrome and Edge. Some other browsers do not draw page numbers in print. In that case, add them in a PDF viewer.' },
  { q: 'Why does the print dialog show a date or a web address?', a: 'Your browser adds that header and footer by default. Turn off "Headers and footers" in the print dialog to remove it.' },
  { q: 'How do I start a new page, or use a table of contents?', a: 'Put <!-- pagebreak --> or \\pagebreak alone on a line to start a new page. For a table of contents, write links such as [Install](#install). They jump to the heading with the same name, in the preview and in the PDF.' },
  { q: 'Do math and diagrams slow the page down?', a: 'No. The code that draws formulas and diagrams is large, so the page loads it only when your document has one. A plain document never downloads it.' },
  { q: 'Can I print the front matter, or add a table of contents?', a: 'Front matter (the block between the --- lines at the top) is hidden by default. Turn on "Print as a table" to show it at the top. Press Insert contents to add a linked list of your headings at the cursor.' },
  { q: 'Can I make the PDF landscape?', a: 'Yes. Choose Landscape in the Orientation menu. It helps with wide tables and diagrams.' },
  { q: 'What is the PDF file named?', a: 'The file takes its name from your first heading. If there is none, it is named document. You can still change the name in the save dialog.' },
];
