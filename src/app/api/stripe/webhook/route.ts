import type Stripe from "stripe";
import { SHOP } from "@/content/shop";
import { orderAlert, orderConfirmation, type PaidOrder } from "@/lib/emails";
import { sendMail } from "@/lib/mail";
import { DOMAIN } from "@/lib/site";
import { stripe } from "@/lib/stripe";
import { findCheckout, mailSent, recordMail, saveOrder, type Order, type OrderItem } from "@/lib/store";

const countryName = (code: string) => new Intl.DisplayNames(["fr"], { type: "region" }).of(code) ?? code;

/**
 * Once an order is paid: its confirmation to the customer and the shop's alert, each sent once even when Stripe
 * repeats the event. The customer's name and address are read from the event, used for the e-mail and not stored.
 */
async function sendOrderMails(client: Stripe, session: Stripe.Checkout.Session, order: Order) {
  let items: OrderItem[] = order.items;
  if (!items.length) {
    // The cart's record is missing (written on another server?): ask Stripe for the lines.
    const listed = await client.checkout.sessions.listLineItems(session.id, { limit: 50 }).catch(() => null);
    items = (listed?.data ?? []).map((l) => ({ slug: "", sku: "", name: l.description ?? "Article", quantity: l.quantity ?? 1, unitAmount: l.price?.unit_amount ?? 0 }));
  }
  const shipping = session.collected_information?.shipping_details;
  const a = shipping?.address;
  const paid: PaidOrder = {
    ...order,
    items,
    customerName: shipping?.name ?? session.customer_details?.name ?? null,
    customerEmail: session.customer_details?.email ?? "",
    shipTo: [shipping?.name, a?.line1, a?.line2, [a?.postal_code, a?.city].filter(Boolean).join(" "), a?.country ? countryName(a.country) : null].filter(
      (l): l is string => Boolean(l),
    ),
  };
  if (paid.customerEmail && !mailSent("order", order.id)) recordMail("order", order.id, await sendMail(orderConfirmation(paid)));
  const shop = process.env.MAIL_ADMIN || SHOP.email;
  if (shop && !mailSent("order-alert", order.id)) recordMail("order-alert", order.id, await sendMail(orderAlert(paid, shop)));
}

// Stripe calls this address after each payment (see docs/mise-en-ligne.md for the events to select). Only a request
// signed with STRIPE_WEBHOOK_SECRET is read; anything else gets a 400 and changes nothing.
export async function POST(req: Request) {
  const client = stripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!client || !secret) return new Response("Webhook not configured", { status: 503 });

  const signature = req.headers.get("stripe-signature");
  if (!signature) return new Response("Missing signature", { status: 400 });
  const payload = await req.text();
  let event: Stripe.Event;
  try {
    event = client.webhooks.constructEvent(payload, signature, secret);
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  if (
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.async_payment_succeeded" ||
    event.type === "checkout.session.async_payment_failed"
  ) {
    const session = event.data.object;
    if (session.metadata?.site !== DOMAIN) return new Response("Ignored: another site", { status: 200 });
    const status: Order["status"] =
      event.type === "checkout.session.async_payment_failed"
        ? "failed"
        : session.payment_status === "unpaid"
          ? "pending"
          : "paid";
    const intent = session.payment_intent;
    const order: Order = {
      id: session.id,
      created: new Date(session.created * 1000).toISOString(),
      status,
      amountTotal: session.amount_total ?? 0,
      amountShipping: session.total_details?.amount_shipping ?? 0,
      currency: session.currency ?? "eur",
      items: findCheckout(session.id)?.items ?? [],
      country: session.collected_information?.shipping_details?.address?.country ?? session.customer_details?.address?.country ?? null,
      paymentIntent: typeof intent === "string" ? intent : (intent?.id ?? null),
      livemode: event.livemode,
    };
    saveOrder(order);
    if (status === "paid") await sendOrderMails(client, session, order);
  }
  return new Response("ok");
}
