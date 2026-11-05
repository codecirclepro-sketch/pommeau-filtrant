// Types of the catalogue. The data files of this folder only import types from here, so that
// scripts/check-content.mjs can load them with Node alone (Node strips the types).

/**
 * A category page, served at /<slug>. One search intention per category: its keyword appears in the title, the
 * description and the H1, and no other page of the site targets it.
 */
export type Category = {
  slug: string;
  /** Short label for the menus and the cards. */
  name: string;
  /** Drawing and one-line summary of the menus and the home page's category cards. */
  icon: "shower" | "citrus" | "filter" | "shield" | "refill";
  teaser: string;
  /** The search phrase the page targets. */
  keyword: string;
  /** <title>: 30 to 60 characters. */
  title: string;
  /** Meta description: 110 to 155 characters. */
  description: string;
  h1: string;
  /** Paragraph under the H1, above the products. */
  intro: string;
  /** Buying advice under the products: each body item is a paragraph (plain text). */
  sections: { h2: string; body: string[] }[];
  /** Slugs of the guides shown at the bottom of the page. */
  guides: string[];
  /** Filters above the products, in this order; `all` is the choice that shows every product. */
  filters?: { key: FilterKey; label: string; all: string }[];
  /**
   * Picture above the buying advice, 1200 × 800, under public/images/ (rayons/ or guides/): a product on sale or a
   * generic scene, never another brand's product.
   */
  image?: { src: string; alt: string };
  /**
   * Columns of the table that compares the products under the grid: spec labels ("Filtration|Composition" shows the
   * first one a product has), or "recharge" for the refill we sell for it (refills are then left out of the rows).
   */
  compare?: string[];
  /** Questions and answers under the advice, in plain text, with their FAQPage structured data. */
  faq?: { q: string; a: string }[];
};

/** What products can be filtered on: the values come from each product's `filters`. */
export type FilterKey = "type" | "technologie";

/**
 * A page of the shop for one filter value, served at /boutique/<slug>: the products whose `filters[key]` holds
 * `value`. Like a category, it targets one search phrase (in the title, the description and the H1) that no other
 * page targets, and it is only published with at least two products.
 */
export type Facet = {
  slug: string;
  key: FilterKey;
  value: string;
  /** Short label of the shop's filters and of the menus. */
  name: string;
  keyword: string;
  /** <title>: 30 to 60 characters. */
  title: string;
  /** Meta description: 110 to 160 characters. */
  description: string;
  h1: string;
  /** Paragraph under the H1, above the products. */
  intro: string;
  /** Advice under the products: each body item is a paragraph (plain text). */
  sections: { h2: string; body: string[] }[];
  /** Slugs of the guides shown next to the advice. */
  guides: string[];
};

/** A group of links of the menus, for example the guides by theme. */
export type MenuGroup = { title: string; links: { name: string; path: string }[] };

export type Availability = "in_stock" | "backorder" | "out_of_stock";

export type ProductImage = {
  /** Path under public/, for example "/produits/<slug>/1.webp". */
  src: string;
  alt: string;
  width: number;
  height: number;
};

/** A product page, served at /produit/<slug>. Every field comes from the supplier or from Nicolas: nothing invented. */
export type Product = {
  slug: string;
  /** Internal reference, shown on the page and sent to Stripe. */
  sku: string;
  name: string;
  /** Manufacturer's brand; empty for an unbranded (white-label) product. */
  brand: string;
  /** Manufacturer part number and barcode (EAN), when known: they help search engines match the product. */
  mpn?: string;
  gtin?: string;
  /** Category of the breadcrumb and of the canonical path. */
  category: string;
  /** Other categories that also list the product. */
  also?: string[];
  /** Price in cents, all taxes included (TTC). 0 only on a draft whose price is not known yet. */
  price: number;
  availability: Availability;
  /** What to say about the delay, when Nicolas knows it, for example "Expédié sous 2 jours ouvrés". */
  dispatch?: string;
  /** <title>: 30 to 60 characters. */
  title: string;
  /** Meta description: 110 to 155 characters. */
  description: string;
  /** One or two sentences under the name. */
  summary: string;
  /** Description in Markdown. */
  body: string;
  /** Key characteristics, in the order shown. */
  specs: { label: string; value: string }[];
  images: ProductImage[];
  /** Slugs of compatible products (a shower head and its refills…). */
  related?: string[];
  /**
   * Products offered as options of one another on their pages (the colours or kits of one shower head):
   * the id of the range (see RANGES in src/lib/catalogue.ts) and this product's short label in the picker.
   */
  range?: { id: string; option: string };
  /** Its values for the filters of its category pages (Category `filters`); several when it fits more than one. */
  filters?: Partial<Record<FilterKey, string | string[]>>;
  /** ISO date of the last change (sitemap). */
  updated: string;
  /** Not published: only shown with SHOW_DRAFTS=1, never indexed. */
  draft?: boolean;
};
