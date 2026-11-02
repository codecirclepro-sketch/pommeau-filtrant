import { marked } from "marked";

// A product's description (Markdown, src/content/products.ts) cut at its "###" titles, so that the page can lay the
// sections out one by one and show the questions as an accordion (and as FAQPage data, src/lib/structured.ts).

export type BodySection = { title: string; html: string };
export type Question = { q: string; a: string };

const FAQ_TITLE = /^Questions? fréquentes?$/;
const QUESTION = /^\*\*(.+)\*\*\s*$/;

const html = (md: string) => marked.parse(md, { async: false }) as string;

/** A question or an answer, as HTML without a paragraph around it. */
export const renderInline = (md: string) => marked.parseInline(md, { async: false }) as string;

/** The questions of a "Questions fréquentes" section: "**Question ?**" then its answer (Markdown). */
function questions(lines: string[]): Question[] {
  const out: Question[] = [];
  for (let i = 0; i < lines.length; i++) {
    const q = lines[i].match(QUESTION);
    if (!q) continue;
    const answer: string[] = [];
    for (let j = i + 1; j < lines.length && lines[j].trim() && !QUESTION.test(lines[j]); j++) answer.push(lines[j]);
    if (answer.length) out.push({ q: q[1], a: answer.join(" ") });
  }
  return out;
}

/** The sections of a description and its questions (Markdown: render with `renderInline`, or strip for JSON-LD). */
export function splitBody(markdown: string) {
  const sections: BodySection[] = [];
  let faq: Question[] = [];
  markdown
    .replace(/\r\n/g, "\n")
    .split(/^### /m)
    .forEach((chunk, i) => {
      // The first chunk is the text before the first title, which has no heading of its own.
      const lines = chunk.split("\n");
      const title = i === 0 ? "" : lines.shift()!.trim();
      if (!lines.join("").trim()) return;
      if (FAQ_TITLE.test(title)) faq = questions(lines);
      else sections.push({ title, html: html(lines.join("\n")) });
    });
  return { sections, faq };
}
