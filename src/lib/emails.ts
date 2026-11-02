import { SHOP } from "@/content/shop";
import { formatPrice } from "./format";
import { legalPage } from "./legal";
import type { Mail } from "./mail";
import { DOMAIN, url } from "./site";
import { orderNumber, type OrderItem, type Withdrawal } from "./store";

// The texts of the shop's e-mails: the order confirmation (the contract on a durable medium, Code de la consommation
// L221-13, with the CGV attached), the shop's alerts, and the acknowledgment of a withdrawal (L221-21, D221-5).
// Each one has an HTML and a plain-text version with the same content.

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** "22 octobre 2026 à 16:05", Paris time. */
export const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short", timeZone: "Europe/Paris" });

const vat = () => (SHOP.vatExempt ? "TVA non applicable, art. 293 B du CGI" : "Prix TTC");

const returnCost = () =>
  SHOP.returnCostPaidBy === "seller"
    ? "Les frais de retour sont à notre charge."
    : SHOP.returnCostPaidBy === "customer"
      ? "Les frais de retour sont à votre charge."
      : "";

/** The seller's identity, at the bottom of every e-mail to a customer. */
function seller() {
  return [
    SHOP.legalName,
    SHOP.address,
    SHOP.registration,
    [SHOP.email, SHOP.phone].filter(Boolean).join(" · "),
    DOMAIN,
  ].filter((l): l is string => Boolean(l));
}

// ------------------------------------------------------------------------------------------------ Building blocks

type Block =
  | { kind: "title"; text: string }
  | { kind: "text"; text: string }
  | { kind: "heading"; text: string }
  | { kind: "rows"; rows: [string, string][]; total?: [string, string] }
  | { kind: "quote"; rows: [string, string][] }
  | { kind: "button"; text: string; href: string };

function html(blocks: Block[], footer: string[]) {
  const body = blocks
    .map((b) => {
      switch (b.kind) {
        case "title":
          return `<h1 style="margin:0 0 16px;font-size:24px;line-height:1.2;color:#0f1115">${esc(b.text)}</h1>`;
        case "heading":
          return `<h2 style="margin:28px 0 8px;font-size:16px;color:#0f1115">${esc(b.text)}</h2>`;
        case "text":
          return `<p style="margin:0 0 12px;font-size:15px;line-height:1.55;color:#363b46">${esc(b.text)}</p>`;
        case "rows":
        case "quote": {
          const rows = b.rows
            .map(
              ([l, r]) =>
                `<tr><td style="padding:8px 0;border-bottom:1px dashed #e3e0d8;font-size:14px;color:#363b46">${esc(l)}</td><td style="padding:8px 0 8px 16px;border-bottom:1px dashed #e3e0d8;font-size:14px;text-align:right;white-space:nowrap">${esc(r)}</td></tr>`,
            )
            .join("");
          const total =
            b.kind === "rows" && b.total
              ? `<tr><td style="padding:12px 0 0;font-size:16px;font-weight:bold">${esc(b.total[0])}</td><td style="padding:12px 0 0 16px;font-size:18px;font-weight:bold;text-align:right;white-space:nowrap">${esc(b.total[1])}</td></tr>`
              : "";
          const box = b.kind === "quote" ? "background:#f7f6f2;border-radius:12px;padding:4px 16px;" : "";
          return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 12px;border-collapse:collapse;${box}">${rows}${total}</table>`;
        }
        case "button":
          return `<p style="margin:16px 0"><a href="${esc(b.href)}" style="display:inline-block;padding:12px 22px;border-radius:99px;background:#0b5d7b;color:#ffffff;font-size:15px;font-weight:bold;text-decoration:none">${esc(b.text)}</a></p>`;
      }
    })
    .join("\n");
  return `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;background:#eef7fa;font-family:Arial,Helvetica,sans-serif;color:#0f1115">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef7fa"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px">
<tr><td style="padding:20px 28px;border-bottom:1px solid #e3e0d8;font-size:18px;color:#131c26"><b style="color:#0b5d7b">pommeau</b> filtrant<span style="color:#5a6776">.fr</span></td></tr>
<tr><td style="padding:28px">${body}</td></tr>
<tr><td style="padding:18px 28px;background:#0a3446;border-radius:0 0 16px 16px;font-size:12px;line-height:1.6;color:#cfe3de">${footer.map(esc).join("<br>")}</td></tr>
</table></td></tr></table></body></html>`;
}

function text(blocks: Block[], footer: string[]) {
  const out: string[] = [];
  for (const b of blocks) {
    if (b.kind === "title") out.push(b.text.toUpperCase(), "");
    else if (b.kind === "heading") out.push("", b.text, "-".repeat(b.text.length));
    else if (b.kind === "text") out.push(b.text, "");
    else if (b.kind === "button") out.push(`${b.text} : ${b.href}`, "");
    else {
      for (const [l, r] of b.rows) out.push(`${l} : ${r}`);
      if (b.kind === "rows" && b.total) out.push(`${b.total[0]} : ${b.total[1]}`);
      out.push("");
    }
  }
  out.push("--", ...footer);
  return out.join("\n");
}

const mail = (to: string, subject: string, blocks: Block[], footer: string[], extra: Partial<Mail> = {}): Mail => ({
  to,
  subject,
  html: html(blocks, footer),
  text: text(blocks, footer),
  ...extra,
});

/** The CGV as a standalone HTML file, attached to the order confirmation. */
function cgvAttachment() {
  const page = legalPage("cgv");
  return {
    filename: "conditions-generales-de-vente.html",
    contentType: "text/html; charset=utf-8",
    content: `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>${esc(page.title)} – ${DOMAIN}</title></head><body style="max-width:760px;margin:24px auto;padding:0 16px;font-family:Arial,Helvetica,sans-serif;line-height:1.6"><h1>${esc(page.title)}</h1><p>${DOMAIN}, version du ${esc(page.updated)}</p>${page.html}</body></html>`,
  };
}

// ------------------------------------------------------------------------------------------------ Orders

export type PaidOrder = {
  id: string;
  created: string;
  items: OrderItem[];
  amountTotal: number;
  amountShipping: number;
  customerName: string | null;
  customerEmail: string;
  /** Name and address lines of the delivery. */
  shipTo: string[];
  country: string | null;
  paymentIntent: string | null;
  livemode: boolean;
};

const lines = (o: PaidOrder): [string, string][] => [
  ...o.items.map((i): [string, string] => [`${i.name} × ${i.quantity}`, formatPrice(i.unitAmount * i.quantity)]),
  ["Livraison", o.amountShipping ? formatPrice(o.amountShipping) : "Offerte"],
];

/** The confirmation of the contract, to the customer, with the CGV attached. */
export function orderConfirmation(o: PaidOrder): Mail {
  const number = orderNumber(o.id);
  const delivery = SHOP.shipping.find((s) => s.amount === o.amountShipping);
  const blocks: Block[] = [
    { kind: "title", text: "Merci pour votre commande" },
    { kind: "text", text: `${o.customerName ? `Bonjour ${o.customerName}, v` : "V"}otre paiement est confirmé. Ce message confirme le contrat de vente : gardez-le, avec nos conditions générales de vente jointes.` },
    { kind: "heading", text: `Commande n° ${number}, du ${formatDateTime(o.created)}` },
    { kind: "rows", rows: lines(o), total: ["Total payé", formatPrice(o.amountTotal)] },
    { kind: "text", text: vat() },
    ...(o.shipTo.length ? [{ kind: "heading", text: "Livraison" } as Block, { kind: "text", text: o.shipTo.join(", ") } as Block] : []),
    ...(delivery
      ? [{ kind: "text", text: `${delivery.label} : livraison estimée en ${delivery.minDays} à ${delivery.maxDays} jours ouvrés. Nous vous écrivons quand le colis part.` } as Block]
      : []),
    { kind: "heading", text: "Votre droit de rétractation" },
    {
      kind: "text",
      text: `Comme pour tout achat à distance, vous disposez de quatorze jours à compter de la réception pour vous rétracter, sans avoir à vous justifier. ${returnCost()}`.trim(),
    },
    { kind: "button", text: "Renoncer au contrat ici", href: url(`/retractation?commande=${number}`) },
    { kind: "text", text: `Vous pouvez aussi nous écrire à ${SHOP.email}, ou utiliser le formulaire de rétractation des conditions générales de vente.` },
    { kind: "heading", text: "Garanties" },
    {
      kind: "text",
      text: "Les produits bénéficient de la garantie légale de conformité pendant deux ans à compter de la livraison (articles L217-3 et suivants du Code de la consommation) et de la garantie des vices cachés (articles 1641 et suivants du Code civil). Le détail figure dans les conditions générales de vente jointes.",
    },
    ...(SHOP.mediator
      ? [{ kind: "text", text: `En cas de litige que nous n'aurions pas résolu ensemble, vous pouvez recourir gratuitement au médiateur de la consommation : ${SHOP.mediator}.` } as Block]
      : []),
    { kind: "text", text: "Une question sur votre commande ? Répondez simplement à cet e-mail." },
  ];
  return mail(o.customerEmail, `Confirmation de votre commande n° ${number}`, blocks, seller(), {
    replyTo: SHOP.email ?? undefined,
    attachments: [cgvAttachment()],
  });
}

/** The shop's alert for a new order: no name nor address, which stay in Stripe. */
export function orderAlert(o: PaidOrder, to: string): Mail {
  const number = orderNumber(o.id);
  const stripe = o.paymentIntent ? `https://dashboard.stripe.com/${o.livemode ? "" : "test/"}payments/${o.paymentIntent}` : "https://dashboard.stripe.com/payments";
  const blocks: Block[] = [
    { kind: "title", text: `Nouvelle commande n° ${number}` },
    { kind: "text", text: `${formatDateTime(o.created)}${o.livemode ? "" : " — paiement de test"}. Livraison : ${o.country ?? "pays inconnu"}.` },
    { kind: "rows", rows: lines(o), total: ["Total payé", formatPrice(o.amountTotal)] },
    { kind: "text", text: "Le nom, l'adresse et l'e-mail du client sont dans Stripe. La confirmation de commande lui a été envoyée." },
    { kind: "button", text: "Ouvrir la commande dans Stripe", href: stripe },
  ];
  return mail(to, `Nouvelle commande n° ${number} : ${formatPrice(o.amountTotal)}`, blocks, [DOMAIN]);
}

// ------------------------------------------------------------------------------------------------ Withdrawals

const declaration = (w: Withdrawal): [string, string][] => [
  ["Nom", w.name],
  ["Commande", w.order],
  ["Produits concernés", w.items || "Toute la commande"],
  ["E-mail", w.email],
  ["Déclaration reçue le", formatDateTime(w.at)],
  ["Référence", w.id],
];

/** The acknowledgment of a withdrawal, on a durable medium: the declaration and its date and time. */
export function withdrawalReceipt(w: Withdrawal): Mail {
  const blocks: Block[] = [
    { kind: "title", text: "Votre rétractation est enregistrée" },
    { kind: "text", text: `Nous avons bien reçu, le ${formatDateTime(w.at)}, votre déclaration de rétractation. En voici le contenu :` },
    { kind: "quote", rows: declaration(w) },
    { kind: "heading", text: "La suite" },
    {
      kind: "text",
      text: `Nous vous écrivons pour vous indiquer l'adresse de retour. Renvoyez les produits au plus tard quatorze jours après votre déclaration, dans un emballage qui les protège. ${returnCost()}`.trim(),
    },
    {
      kind: "text",
      text: "Nous vous remboursons au plus tard quatorze jours après avoir reçu votre déclaration, par le moyen de paiement utilisé pour la commande. Le remboursement peut attendre que nous ayons reçu les produits, ou la preuve de leur expédition.",
    },
    { kind: "text", text: "Une question ? Répondez simplement à cet e-mail." },
  ];
  return mail(w.email, `Accusé de réception de votre rétractation (${w.id})`, blocks, seller(), { replyTo: SHOP.email ?? undefined });
}

/** The shop's alert for a withdrawal, to answer the customer with the return address. */
export function withdrawalAlert(w: Withdrawal, to: string): Mail {
  const blocks: Block[] = [
    { kind: "title", text: `Rétractation ${w.id}` },
    { kind: "quote", rows: declaration(w) },
    {
      kind: "text",
      text: "À faire : répondre au client avec l'adresse de retour, puis le rembourser dans les quatorze jours qui suivent la déclaration (Stripe, Paiements, Rembourser), au plus tard à la réception des produits ou de la preuve de leur envoi.",
    },
  ];
  return mail(to, `Rétractation ${w.id} : commande ${w.order}`, blocks, [DOMAIN], { replyTo: w.email });
}
