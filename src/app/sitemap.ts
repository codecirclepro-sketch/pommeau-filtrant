import type { MetadataRoute } from "next";
import { CATEGORIES } from "@/content/categories";
import { categoryIndexable, categoryPath, facetPath, facets, productPath, products } from "@/lib/catalogue";
import { guides } from "@/lib/guides";
import { TOOLS } from "@/lib/routes";
import { CONTENT_UPDATED, INDEXABLE, url } from "@/lib/site";

/** The indexable pages only: no cart, order page, empty category or draft. */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!INDEXABLE) return [];
  const all = guides();
  const latestGuide = all.reduce((d, g) => (g.updated > d ? g.updated : d), CONTENT_UPDATED);
  return [
    { url: url("/"), lastModified: CONTENT_UPDATED },
    ...CATEGORIES.filter(categoryIndexable).map((c) => ({ url: url(categoryPath(c)), lastModified: CONTENT_UPDATED })),
    { url: url("/boutique"), lastModified: CONTENT_UPDATED },
    ...facets().map((f) => ({ url: url(facetPath(f)), lastModified: CONTENT_UPDATED })),
    ...products()
      .filter((p) => !p.draft)
      .map((p) => ({
        url: url(productPath(p)),
        lastModified: p.updated,
        ...(p.images.length && { images: p.images.map((i) => url(i.src)) }),
      })),
    ...TOOLS.map((t) => ({ url: url(t.path), lastModified: t.updated })),
    { url: url("/guides"), lastModified: latestGuide },
    ...all.map((g) => ({ url: url(`/guides/${g.slug}`), lastModified: g.updated })),
  ];
}
