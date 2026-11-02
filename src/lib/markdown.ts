import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";

export type Heading = { id: string; text: string };

const ROOT = path.join(process.cwd(), "content");

export const listMarkdown = (folder: string) =>
  fs.readdirSync(path.join(ROOT, folder)).filter((f) => f.endsWith(".md"));

/** Reads content/<folder>/<file>: a front matter of `key: value` lines between two `---`, then Markdown. */
export function readMarkdown(folder: string, file: string, required: string[]) {
  const raw = fs.readFileSync(path.join(ROOT, folder, file), "utf8").replace(/\r\n/g, "\n");
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error(`content/${folder}/${file}: missing front matter`);
  const meta: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const i = line.indexOf(":");
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^"(.*)"$/, "$1");
  }
  for (const key of required) if (!meta[key]) throw new Error(`content/${folder}/${file}: missing "${key}"`);
  return { meta, body: match[2] };
}

export const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&#?\w+;/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const decode = (s: string) =>
  s
    .replace(/<[^>]+>/g, "")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

/** Renders our own Markdown (trusted content) and gives every H2 an id, for the table of contents. */
export function renderMarkdown(body: string) {
  const headings: Heading[] = [];
  const html = (marked.parse(body, { async: false }) as string).replace(/<h2>(.*?)<\/h2>/g, (_, inner: string) => {
    const id = slugify(decode(inner));
    headings.push({ id, text: decode(inner) });
    return `<h2 id="${id}">${inner}</h2>`;
  });
  return { html, headings };
}
