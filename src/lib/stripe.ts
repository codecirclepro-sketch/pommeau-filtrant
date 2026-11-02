import Stripe from "stripe";
import { SHOP } from "@/content/shop";
import { INDEXABLE } from "./site";

let client: Stripe | null = null;

/** The Stripe client, or null while STRIPE_SECRET_KEY is not set (the cart then says payment is not open yet). */
export function stripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  client ??= new Stripe(key);
  return client;
}

/** "test", "live" or null: which Stripe mode the server runs in, from the prefix of the key. */
export function stripeMode(): "test" | "live" | null {
  const key = process.env.STRIPE_SECRET_KEY ?? "";
  if (/^(sk|rk)_test_/.test(key)) return "test";
  if (/^(sk|rk)_live_/.test(key)) return "live";
  return null;
}

/**
 * Whether the delivery and returns are in src/content/shop.ts: the carriers, the delivery options and delays, and who
 * pays a return. The consumer mediator is a legal obligation too; the dashboard and scripts/check-content.mjs ask for it.
 */
export const sellingReady = () =>
  Boolean(SHOP.carriers && SHOP.handlingDays && SHOP.returnCostPaidBy && SHOP.shipping.length);

/**
 * Whether visitors can pay: with a live key once the delivery and returns are filled in and the webhook's secret is
 * set (a live key alone does not open payments, and an order the webhook cannot record must never be taken), or with a
 * test key while the site is still a private preview. Once the site is open to search engines, real visitors never
 * land on a test checkout: the cart says payment opens soon.
 */
export function paymentOpen() {
  const mode = stripeMode();
  return (mode === "live" && sellingReady() && Boolean(process.env.STRIPE_WEBHOOK_SECRET)) || (mode === "test" && !INDEXABLE);
}
