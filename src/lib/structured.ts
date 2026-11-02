import { SHOP } from "@/content/shop";
import { splitBody } from "./product-body";
import { DOMAIN, SITE_URL, url } from "./site";

// Structured data shared by the pages (schema.org, read by Google's merchant listings and by other engines).
// Only what is true and known: delivery appears once src/content/shop.ts has rates, return fees once decided.

export const STORE_ID = `${SITE_URL}/#shop`;

/** The 14-day withdrawal right of French distance selling, as a return policy. */
export function returnPolicyLd() {
  return {
    "@type": "MerchantReturnPolicy",
    applicableCountry: SHOP.countries,
    returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
    merchantReturnDays: 14,
    returnMethod: "https://schema.org/ReturnByMail",
    ...(SHOP.returnCostPaidBy && {
      returnFees:
        SHOP.returnCostPaidBy === "seller" ? "https://schema.org/FreeReturn" : "https://schema.org/ReturnFeesCustomerResponsibility",
    }),
  };
}

/** The cheapest delivery option, or nothing while no rate is set. */
export function shippingLd() {
  const cheapest = [...SHOP.shipping].sort((a, b) => a.amount - b.amount)[0];
  if (!cheapest) return undefined;
  const h = SHOP.handlingDays;
  return {
    "@type": "OfferShippingDetails",
    shippingRate: { "@type": "MonetaryAmount", value: (cheapest.amount / 100).toFixed(2), currency: "EUR" },
    shippingDestination: SHOP.countries.map((c) => ({ "@type": "DefinedRegion", addressCountry: c })),
    deliveryTime: {
      "@type": "ShippingDeliveryTime",
      // The delays of src/content/shop.ts count from the order: preparation, then transport.
      ...(h && { handlingTime: { "@type": "QuantitativeValue", minValue: h.min, maxValue: h.max, unitCode: "DAY" } }),
      transitTime: {
        "@type": "QuantitativeValue",
        minValue: cheapest.minDays - (h?.min ?? 0),
        maxValue: cheapest.maxDays - (h?.max ?? 0),
        unitCode: "DAY",
      },
    },
  };
}

/** "299 route de Genas, 69100 Villeurbanne, France" → a PostalAddress. */
function postalAddress(address: string | null) {
  const m = address?.match(/^(.+?),\s*(\d{5})\s+([^,]+)/);
  if (!m) return undefined;
  return { "@type": "PostalAddress", streetAddress: m[1], postalCode: m[2], addressLocality: m[3], addressCountry: "FR" };
}

/** The shop itself: identity, contact and policies (home page). */
export function storeLd() {
  const address = postalAddress(SHOP.address);
  return {
    "@type": "OnlineStore",
    "@id": STORE_ID,
    name: DOMAIN,
    url: url("/"),
    logo: { "@type": "ImageObject", url: url("/logo.png"), width: 512, height: 512 },
    image: url("/opengraph-image"),
    description: "Boutique en ligne de pommeaux de douche filtrants, de filtres de douche et de leurs recharges.",
    ...(SHOP.legalName && { legalName: SHOP.legalName }),
    ...(SHOP.email && { email: SHOP.email }),
    ...(SHOP.phone && { telephone: SHOP.phone }),
    ...(address && { address }),
    ...((SHOP.email || SHOP.phone) && {
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        availableLanguage: "French",
        ...(SHOP.email && { email: SHOP.email }),
        ...(SHOP.phone && { telephone: SHOP.phone }),
      },
    }),
    hasMerchantReturnPolicy: returnPolicyLd(),
  };
}

const plain = (s: string) => s.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/[*_`]/g, "").trim();

/**
 * The questions of a product's "Questions fréquentes" section (src/lib/product-body.ts), as a FAQPage. Google shows
 * FAQ results only for a few authoritative sites, but other engines and assistants read it.
 */
export function faqLd(markdown: string) {
  const { faq } = splitBody(markdown);
  if (!faq.length) return undefined;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map(({ q, a }) => ({ "@type": "Question", name: plain(q), acceptedAnswer: { "@type": "Answer", text: plain(a) } })),
  };
}
