import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { SHOP } from "@/content/shop";
import { withdrawalAlert, withdrawalReceipt } from "@/lib/emails";
import { allow, clientAddress, sameOrigin } from "@/lib/limits";
import { sendMail } from "@/lib/mail";
import { recordMail, saveWithdrawal, type Withdrawal } from "@/lib/store";

const fail = (error: string, status: number) => NextResponse.json({ error }, { status });

/** One line of text, without control characters, at most `max` characters. */
const clean = (v: unknown, max: number) =>
  typeof v === "string" ? v.replace(/[\u0000-\u001f\u007f]+/g, " ").replace(/\s+/g, " ").trim().slice(0, max) : "";

/**
 * The online withdrawal function (Code de la consommation L221-21 and D221-5): records the declaration with its date
 * and time, then sends the acknowledgment to the customer and an alert to the shop.
 */
export async function POST(req: Request) {
  if (!sameOrigin(req)) return fail("Requête refusée.", 403);
  if (!allow(`withdrawal:${clientAddress(req)}`, 5, 15 * 60_000)) return fail("Trop d'envois : réessayez dans quelques minutes.", 429);

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return fail("Formulaire illisible.", 400);
  }
  const name = clean(body.name, 120);
  const order = clean(body.order, 80);
  const email = clean(body.email, 200);
  const items = clean(body.items, 600);
  if (!name) return fail("Indiquez votre nom et votre prénom.", 400);
  if (!order) return fail("Indiquez le numéro de la commande, ou sa date et ses produits.", 400);
  // A plain address only: no display name, comment, quote or group syntax that a mail library could misread.
  if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/.test(email))
    return fail("Indiquez une adresse e-mail valide pour recevoir l'accusé de réception.", 400);

  const w: Withdrawal = {
    id: `R-${randomBytes(4).toString("hex").slice(0, 6).toUpperCase()}`,
    at: new Date().toISOString(),
    name,
    order,
    email,
    items,
  };
  saveWithdrawal(w);
  const acknowledged = await sendMail(withdrawalReceipt(w));
  recordMail("withdrawal", w.id, acknowledged);
  const shop = process.env.MAIL_ADMIN || SHOP.email;
  if (shop) recordMail("withdrawal-alert", w.id, await sendMail(withdrawalAlert(w, shop)));
  return NextResponse.json({ id: w.id, at: w.at, acknowledged });
}
