import { CATEGORIES } from "@/content/categories";
import { FACETS } from "@/content/facets";
import { PRODUCTS } from "@/content/products";
import type { Category, Facet, FilterKey, Product } from "@/content/types";
import { SHOW_DRAFTS } from "./site";

export { formatPrice } from "./format";

/** Products shown on this build: drafts only with SHOW_DRAFTS=1. */
export const products = (): Product[] => PRODUCTS.filter((p) => SHOW_DRAFTS || !p.draft);

export const getProduct = (slug: string) => products().find((p) => p.slug === slug);

export const getCategory = (slug: string) => CATEGORIES.find((c) => c.slug === slug);

export const categoryProducts = (slug: string) =>
  products().filter((p) => p.category === slug || p.also?.includes(slug));

/** A product's filter values, each as a list. */
export const filterValues = (p: Product): Partial<Record<FilterKey, string[]>> =>
  Object.fromEntries(Object.entries(p.filters ?? {}).map(([key, v]) => [key, [v].flat()]));

export const getFacet = (slug: string) => FACETS.find((f) => f.slug === slug);

export const facetPath = (f: Facet) => `/boutique/${f.slug}`;

/** The products of a page of the shop: those whose filter holds its value. */
export const facetProducts = (f: Facet) => products().filter((p) => filterValues(p)[f.key]?.includes(f.value));

/** A page of the shop is published with two products or more: one product is its own page already. */
export const facetIndexable = (f: Facet) => facetProducts(f).filter((p) => !p.draft).length >= 2;

/** The pages of the shop that are published, in the order of FACETS. */
export const facets = () => FACETS.filter(facetIndexable);

/** A category is indexed (and in the sitemap) once it lists a published product. */
export const categoryIndexable = (c: Category) => categoryProducts(c.slug).some((p) => !p.draft);

export const productPath = (p: Product) => `/produit/${p.slug}`;
export const categoryPath = (c: Category) => `/${c.slug}`;

// A draft can only be paid for with a Stripe test key, never with real money.
const liveStripe = /^(sk|rk)_live_/.test(process.env.STRIPE_SECRET_KEY ?? "");

/** Whether the product can be added to the cart. */
export const buyable = (p: Product) =>
  p.availability !== "out_of_stock" && p.price > 0 && !(p.draft && liveStripe);

export const AVAILABILITY: Record<Product["availability"], { label: string; schema: string }> = {
  in_stock: { label: "En stock", schema: "https://schema.org/InStock" },
  backorder: { label: "Sur commande", schema: "https://schema.org/BackOrder" },
  out_of_stock: { label: "Indisponible", schema: "https://schema.org/OutOfStock" },
};

/** The ranges of src/content/products.ts and the title of their picker on the product page. */
const RANGES: Record<string, string> = { althy: "Kit", htmck: "Version" };

/** The products of a product's range, in catalogue order, with the picker's title; null outside a range. */
export function rangeOf(p: Product) {
  if (!p.range) return null;
  const items = products().filter((x) => x.range?.id === p.range!.id && x.price > 0);
  return items.length > 1 ? { title: RANGES[p.range.id] ?? "Options", items } : null;
}
