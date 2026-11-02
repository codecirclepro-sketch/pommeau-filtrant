import { CATEGORIES } from "@/content/categories";
import { categoryPath, facetPath, facets, productPath, products } from "./catalogue";
import { guides } from "./guides";
import { LEGAL } from "./legal";
import type { IconName } from "@/components/icon";

/** The free tools: client-side pages listed on /outils, in the menus, the sitemap and llms.txt. */
export const TOOLS: { path: string; name: string; short: string; description: string; icon: IconName; updated: string }[] = [];

/** Pages that are not built from the catalogue or the guides. */
export const STATIC_PAGES = [
  "/",
  "/boutique",
  "/guides",
  "/contact",
  "/panier",
  "/commande/merci",
  "/commande/annulee",
  "/retractation",
  "/recherche",
  ...TOOLS.map((t) => t.path),
  ...LEGAL.map((l) => `/${l.slug}`),
];

let known: Set<string> | null = null;

/** Every page of the shop: the visit counter ignores any other path. */
export function knownPaths() {
  known ??= new Set([
    ...STATIC_PAGES,
    ...CATEGORIES.map(categoryPath),
    ...facets().map(facetPath),
    ...products().map(productPath),
    ...guides().map((g) => `/guides/${g.slug}`),
  ]);
  return known;
}
