// What the legal pages, the checkout and the structured data say about the seller, the delivery and the returns.
// Every `null` is shown as "[À compléter : …]" on the site and counted by scripts/check-content.mjs: the seller's
// identity is needed before opening to search engines, the delivery and returns before opening payments.

export type Shipping = {
  /** Shown to the customer in Stripe Checkout. */
  label: string;
  /** Price in cents TTC; 0 for free delivery. */
  amount: number;
  /** Business days, as promised to the customer. */
  minDays: number;
  maxDays: number;
};

export const SHOP = {
  /** Company name or, for a sole trader, first and last name followed by "EI". */
  legalName: "Nicolas Buathier EI" as string | null,
  /** Legal form and share capital, for example "SASU au capital de 1 000 €". */
  legalForm: "Entrepreneur individuel (micro-entreprise)" as string | null,
  /** SIREN (9 digits) and the register: "RCS Ville 123 456 789" or "RNE 123 456 789". */
  registration: "SIRET 889 648 937 00015" as string | null,
  /** Intra-community VAT number, or null with vatExempt = true. */
  vatNumber: null as string | null,
  /** Micro-entrepreneur under the VAT threshold: prices show "TVA non applicable, art. 293 B du CGI". */
  vatExempt: true as boolean | null,
  /** Postal address of the head office. */
  address: "299 route de Genas, 69100 Villeurbanne, France" as string | null,
  email: "contact@pommeau-filtrant.fr" as string | null,
  phone: "+33 6 49 58 76 58" as string | null,
  /** Person responsible for the publication (directeur de la publication). */
  publisher: "Nicolas Buathier" as string | null,
  /** Host of the site: name, address and phone of the company that rents the server. */
  host: "Hostinger International Ltd, 61 Lordou Vironos Street, 6023 Larnaca, Chypre (hostinger.fr)" as string | null,
  /** Consumer mediator the company has joined (name, website): required before selling to consumers. */
  mediator: null as string | null,
  /** How long the server's access logs (nginx) are kept, for example "14 jours" (see docs/mise-en-ligne.md). */
  logRetention: "14 jours" as string | null,
  /** Countries delivered (ISO codes, used by Stripe Checkout) and their names for the pages. */
  countries: ["FR"] as string[],
  countryNames: "France métropolitaine",
  /** Delivery options offered in Stripe Checkout, also shown in the buy box, the legal pages and the structured data. */
  // As for the other shops of the same seller: the supplier ships for free, one day to place the order, then the
  // listings' estimates of 2026-11-02 (from China: 4 to 13 business days), so 5 to 15 in all with a margin.
  shipping: [{ label: "Livraison standard", amount: 0, minDays: 5, maxDays: 15 }] as Shipping[],
  /** Who ships, as it reads after "confiées à" in the CGV and on the delivery page. */
  carriers: "notre fournisseur, qui les expédie avec le transporteur de son choix" as string | null,
  /** Business days to prepare an order before it leaves; part of the shipping delays above. */
  handlingDays: { min: 1, max: 1 } as { min: number; max: number } | null,
  /** Who pays the return of a product sent back under the 14-day withdrawal right. */
  returnCostPaidBy: "customer" as "customer" | "seller" | null,
};
