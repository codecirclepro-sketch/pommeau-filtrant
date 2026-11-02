import { SHOP } from "@/content/shop";
import { formatPrice } from "./catalogue";
import { readMarkdown, renderMarkdown } from "./markdown";
import { DOMAIN, INDEXABLE } from "./site";

/** The legal pages (content/legal/<slug>.md), each served by its own route. */
export const LEGAL = [
  { slug: "mentions-legales", name: "Mentions légales" },
  { slug: "cgv", name: "Conditions générales de vente" },
  { slug: "livraison-retours", name: "Livraison et retours" },
  { slug: "confidentialite", name: "Confidentialité" },
] as const;

export type LegalSlug = (typeof LEGAL)[number]["slug"];

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const todo = (label: string) => `<mark class="todo">[À compléter : ${label}]</mark>`;
const value = (v: string | null, label: string) => (v ? esc(v) : todo(label));

/** "1 jour ouvré", "1 à 2 jours ouvrés". */
const days = (min: number, max: number) => (min === max ? `${min} jour${min > 1 ? "s" : ""} ouvré${min > 1 ? "s" : ""}` : `${min} à ${max} jours ouvrés`);

/** The `{{token}}` of the legal Markdown, filled from src/content/shop.ts. */
function tokens(): Record<string, string> {
  const shipping = SHOP.shipping.length
    ? SHOP.shipping
        .map((s) => `${esc(s.label)} : ${s.amount ? formatPrice(s.amount) : "offerte"}, livrée en ${s.minDays} à ${s.maxDays} jours ouvrés`)
        .join(" ; ")
    : todo("modes de livraison, prix et délais");
  return {
    site: DOMAIN,
    raison_sociale: value(SHOP.legalName, "raison sociale ou nom de l'entrepreneur"),
    forme: value(SHOP.legalForm, "forme juridique et capital"),
    immatriculation: value(SHOP.registration, "SIREN et registre (RCS ou RNE)"),
    tva:
      SHOP.vatExempt === true
        ? "TVA non applicable, art. 293 B du CGI"
        : value(SHOP.vatNumber, "numéro de TVA intracommunautaire, ou mention d'exonération"),
    prix_tva: SHOP.vatExempt === true ? "TVA non applicable, art. 293 B du CGI" : "toutes taxes comprises (TTC)",
    adresse: value(SHOP.address, "adresse du siège"),
    email: value(SHOP.email, "adresse e-mail de contact"),
    telephone: value(SHOP.phone, "téléphone"),
    directeur_publication: value(SHOP.publisher, "directeur de la publication"),
    hebergeur: value(SHOP.host, "hébergeur : nom, adresse et téléphone"),
    mediateur: value(SHOP.mediator, "médiateur de la consommation : nom et site"),
    duree_journaux: value(SHOP.logRetention, "durée de conservation des journaux du serveur"),
    pays: esc(SHOP.countryNames),
    transporteurs: value(SHOP.carriers, "transporteurs"),
    preparation: SHOP.handlingDays ? days(SHOP.handlingDays.min, SHOP.handlingDays.max) : todo("délai de préparation"),
    livraison: shipping,
    frais_retour:
      SHOP.returnCostPaidBy === "seller"
        ? "pris en charge par le vendeur"
        : SHOP.returnCostPaidBy === "customer"
          ? "à la charge du client"
          : todo("frais de retour à la charge du client ou du vendeur"),
  };
}

export function legalPage(slug: LegalSlug) {
  const { meta, body: raw } = readMarkdown("legal", `${slug}.md`, ["title", "description", "updated"]);
  // A note to Nicolas (a quoted "[À compléter : …]" line) is not shown on the public site; the checker still lists it.
  const body = INDEXABLE ? raw.replace(/^> <mark class="todo">.*\n+/gm, "") : raw;
  const filled = tokens();
  const text = body.replace(/\{\{(\w+)\}\}/g, (all, key: string) => {
    if (!(key in filled)) throw new Error(`content/legal/${slug}.md: unknown token ${all}`);
    return filled[key];
  });
  return { title: meta.title, description: meta.description, updated: meta.updated, ...renderMarkdown(text) };
}
