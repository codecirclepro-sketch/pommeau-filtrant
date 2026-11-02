import { SHOP } from "@/content/shop";
import { buyable, getCategory, productPath, products } from "@/lib/catalogue";
import { DOMAIN, INDEXABLE, url } from "@/lib/site";

export const dynamic = "force-static";

const xml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const tag = (name: string, value: string | number) => `      <g:${name}>${xml(String(value))}</g:${name}>`;
const price = (cents: number) => `${(cents / 100).toFixed(2)} EUR`;

/**
 * Product feed for Google Merchant Center (free listings in Google Shopping), in Google's RSS 2.0 format. Only
 * published products that can be bought; delivery appears once src/content/shop.ts has rates. Submit it in Merchant
 * Center once payments are open (docs/mise-en-ligne.md).
 */
export function GET() {
  const cheapest = [...SHOP.shipping].sort((a, b) => a.amount - b.amount)[0];
  const items = INDEXABLE ? products().filter((p) => !p.draft && buyable(p) && p.images.length && p.availability === "in_stock") : [];
  const entries = items.map((p) => {
    const [first, ...more] = p.images;
    const category = getCategory(p.category);
    return [
      "    <item>",
      tag("id", p.sku),
      tag("title", p.name),
      tag("description", p.description),
      tag("link", url(productPath(p))),
      tag("image_link", url(first.src)),
      ...more.slice(0, 10).map((i) => tag("additional_image_link", url(i.src))),
      tag("availability", "in_stock"),
      tag("price", price(p.price)),
      tag("condition", "new"),
      // Unbranded products without a known barcode: say so rather than inventing identifiers.
      ...(p.gtin ? [tag("gtin", p.gtin)] : []),
      ...(p.mpn ? [tag("mpn", p.mpn)] : []),
      ...(p.brand ? [tag("brand", p.brand)] : []),
      ...(!p.gtin && !p.mpn && !p.brand ? [tag("identifier_exists", "no")] : []),
      ...(category ? [tag("product_type", category.name)] : []),
      ...(cheapest
        ? [
            "      <g:shipping>",
            `        <g:country>${SHOP.countries[0]}</g:country>`,
            `        <g:price>${price(cheapest.amount)}</g:price>`,
            // The delays of src/content/shop.ts count from the order: preparation, then transport.
            ...(SHOP.handlingDays
              ? [
                  `        <g:min_handling_time>${SHOP.handlingDays.min}</g:min_handling_time>`,
                  `        <g:max_handling_time>${SHOP.handlingDays.max}</g:max_handling_time>`,
                ]
              : []),
            `        <g:min_transit_time>${cheapest.minDays - (SHOP.handlingDays?.min ?? 0)}</g:min_transit_time>`,
            `        <g:max_transit_time>${cheapest.maxDays - (SHOP.handlingDays?.max ?? 0)}</g:max_transit_time>`,
            "      </g:shipping>",
          ]
        : []),
      "    </item>",
    ].join("\n");
  });
  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">',
    "  <channel>",
    `    <title>${xml(DOMAIN)}</title>`,
    `    <link>${xml(url("/"))}</link>`,
    "    <description>Pommeaux de douche filtrants, filtres et recharges</description>",
    ...entries,
    "  </channel>",
    "</rss>",
    "",
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
