import type { Metadata } from "next";
import { DOMAIN, INDEXABLE } from "./site";

/** The share image drawn by src/app/opengraph-image.tsx. */
const DEFAULT_IMAGE = { url: "/opengraph-image", width: 1200, height: 630, alt: "pommeau-filtrant.fr" };

/**
 * Metadata of a page: canonical address, robots and share preview. `index: false` keeps a page out of search
 * engines even once the site is open (cart, order pages, empty categories, drafts).
 */
export function pageMeta({
  title,
  description,
  path,
  index = true,
  image,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  index?: boolean;
  image?: { url: string; width: number; height: number; alt: string };
  type?: "website" | "article";
}): Metadata {
  const images = [image ?? DEFAULT_IMAGE];
  return {
    title,
    description,
    alternates: { canonical: path },
    // Indexed pages allow large image previews and full snippets (Google Images, Discover, product results).
    robots:
      INDEXABLE && index
        ? {
            index: true,
            follow: true,
            googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
          }
        : { index: false, follow: INDEXABLE },
    openGraph: { title, description, url: path, siteName: DOMAIN, locale: "fr_FR", type, images },
    twitter: { card: "summary_large_image", title, description, images: images.map((i) => i.url) },
  };
}
