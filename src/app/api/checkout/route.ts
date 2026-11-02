import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { SHOP } from "@/content/shop";
import { buyable, getProduct } from "@/lib/catalogue";
import { allow, clientAddress, sameOrigin } from "@/lib/limits";
import { DOMAIN, SITE_URL } from "@/lib/site";
import { paymentOpen, stripe } from "@/lib/stripe";
import { count, nowTime, saveCheckout, type OrderItem } from "@/lib/store";

const MAX_LINES = 20;
const MAX_QTY = 20;

const fail = (error: string, status: number) => NextResponse.json({ error }, { status });

/** Turns the cart into a Stripe Checkout session. Prices always come from the catalogue, never from the browser. */
export async function POST(req: Request) {
  if (!sameOrigin(req)) return fail("Requête refusée.", 403);
  if (!allow(`checkout:${clientAddress(req)}`, 10, 10 * 60_000))
    return fail("Trop de tentatives : réessayez dans quelques minutes.", 429);
  const client = stripe();
  if (!client || !paymentOpen()) return fail("Le paiement en ligne n'est pas encore ouvert.", 503);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail("Panier illisible.", 400);
  }
  const lines = (body as { items?: unknown })?.items;
  if (!Array.isArray(lines) || lines.length === 0 || lines.length > MAX_LINES) return fail("Panier vide ou trop long.", 400);

  const items: OrderItem[] = [];
  for (const line of lines) {
    const { slug, qty } = (line ?? {}) as { slug?: unknown; qty?: unknown };
    if (typeof slug !== "string" || !Number.isInteger(qty) || (qty as number) < 1 || (qty as number) > MAX_QTY)
      return fail("Panier illisible.", 400);
    const product = getProduct(slug);
    if (!product || !buyable(product))
      return fail(`Un article du panier n'est plus disponible${product ? ` : ${product.name}` : ""}. Retirez-le pour continuer.`, 409);
    if (items.some((i) => i.slug === slug)) return fail("Panier illisible.", 400);
    items.push({ slug, sku: product.sku, name: product.name, quantity: qty as number, unitAmount: product.price });
  }

  const params: Stripe.Checkout.SessionCreateParams = {
    mode: "payment",
    locale: "fr",
    line_items: items.map((item) => {
      const product = getProduct(item.slug)!;
      // Stripe fetches the photo itself: only send it when the site is public.
      const images = SITE_URL.startsWith("https://") && product.images[0] ? [SITE_URL + product.images[0].src] : undefined;
      return {
        quantity: item.quantity,
        price_data: {
          currency: "eur",
          unit_amount: item.unitAmount,
          product_data: { name: product.name, images, metadata: { slug: item.slug, sku: item.sku } },
        },
      };
    }),
    shipping_address_collection: { allowed_countries: SHOP.countries },
    shipping_options: SHOP.shipping.length
      ? SHOP.shipping.map((s) => ({
          shipping_rate_data: {
            type: "fixed_amount",
            display_name: s.label,
            fixed_amount: { amount: s.amount, currency: "eur" },
            delivery_estimate: {
              minimum: { unit: "business_day", value: s.minDays },
              maximum: { unit: "business_day", value: s.maxDays },
            },
          },
        }))
      : undefined,
    custom_text: {
      submit: {
        message:
          "En cliquant sur Payer, vous passez une commande avec obligation de paiement et acceptez nos conditions générales de vente.",
      },
    },
    // The webhook only records the sessions that carry this mark, in case the Stripe account serves other sites.
    metadata: { site: DOMAIN },
    success_url: `${SITE_URL}/commande/merci?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${SITE_URL}/commande/annulee`,
  };

  let session: Stripe.Checkout.Session;
  try {
    session = await client.checkout.sessions.create(params);
  } catch (e) {
    console.error("checkout: Stripe refused the session", e instanceof Error ? e.message : e);
    return fail("Le paiement n'a pas pu démarrer. Réessayez dans un instant.", 502);
  }
  if (!session.url) return fail("Le paiement n'a pas pu démarrer. Réessayez dans un instant.", 502);

  saveCheckout({ id: session.id, created: new Date().toISOString(), items });
  count((day) => {
    day.checkouts++;
    day.events.push({ t: nowTime(), e: "checkout", s: items.map((i) => i.slug) });
  });
  return NextResponse.json({ url: session.url });
}
