/** The name of the shop, as shown in the header, the titles and the structured data. */
export const BRAND = "Pommeau Filtrant";
export const DOMAIN = "pommeau-filtrant.fr";

/** Absolute origin of the site, without a trailing slash. Production uses the default; .env.local sets localhost. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || `https://${DOMAIN}`).replace(/\/+$/, "");

/**
 * Whether search engines may index the site (meta robots, robots.txt, sitemap). Opened on 2026-11-02 with the first
 * products and guides; scripts/check-content.mjs refuses `true` without the seller's identity and a published product.
 * Payments open separately, with a live Stripe key (see paymentOpen in src/lib/stripe.ts).
 */
export const INDEXABLE = true;

/** Date of the last change to the home page and the category texts (sitemap). */
export const CONTENT_UPDATED = "2026-11-02";

/**
 * Draft products appear while the site is closed to search engines (the live site is then a preview for Nicolas),
 * or with SHOW_DRAFTS=1. They are never indexed nor in the sitemap, and once INDEXABLE is true they disappear.
 */
export const SHOW_DRAFTS = process.env.SHOW_DRAFTS === "1" || !INDEXABLE;

export const url = (path: string) => `${SITE_URL}${path === "/" ? "" : path}`;
