import { getCategory } from "./catalogue";
import { listMarkdown, readMarkdown, renderMarkdown, type Heading } from "./markdown";

/**
 * The buying guides (content/guides/*.md), published at /guides/<slug>. Each one answers in depth a question
 * behind a category page (`category`) and links to it. No H1 in the body: the title is the H1.
 */
export type Guide = {
  slug: string;
  title: string;
  description: string;
  /** Slug of the category page the guide serves, or "accueil" for the home page. */
  category: string;
  /** ISO dates (YYYY-MM-DD). */
  date: string;
  updated: string;
  html: string;
  headings: Heading[];
  minutes: number;
  /** Optional front matter `image` (/images/guides/<name>.jpg, 1200 × 800) and `imageAlt`. */
  image?: { src: string; alt: string; width: number; height: number };
};

let cache: Guide[] | null = null;

/** French typography: a non-breaking space before ? ! : ; and inside « », so that a sign never starts a line. */
const frenchSpaces = (s: string) => s.replace(/ ([?!:;»])/g, "\u00A0$1").replace(/« /g, "«\u00A0");

export function guides(): Guide[] {
  cache ??= listMarkdown("guides")
    .map((file) => {
      const { meta, body } = readMarkdown("guides", file, ["title", "description", "category", "date"]);
      if (meta.category !== "accueil" && !getCategory(meta.category))
        throw new Error(`content/guides/${file}: unknown category "${meta.category}"`);
      return {
        slug: file.replace(/\.md$/, ""),
        title: frenchSpaces(meta.title),
        description: meta.description,
        category: meta.category,
        date: meta.date,
        updated: meta.updated || meta.date,
        minutes: Math.max(1, Math.round(body.split(/\s+/).length / 220)),
        ...(meta.image && { image: { src: meta.image, alt: meta.imageAlt ?? "", width: 1200, height: 800 } }),
        ...renderMarkdown(frenchSpaces(body)),
      };
    })
    // The home page's guide first, then by date of publication.
    .sort(
      (a, b) =>
        Number(b.category === "accueil") - Number(a.category === "accueil") ||
        a.date.localeCompare(b.date) ||
        a.title.localeCompare(b.title, "fr"),
    );
  return cache;
}

export const getGuide = (slug: string) => guides().find((g) => g.slug === slug);
