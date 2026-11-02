import fs from "node:fs";
import path from "node:path";

// The shop's own data, in plain files under DATA_DIR (on the server: a folder outside the app, see
// ecosystem.config.cjs). One process writes them (pm2 runs a single instance), with synchronous calls.
//   stats/<YYYY-MM-DD>.json  visit counts of the day: no IP, no cookie, no identifier
//   checkouts.jsonl          what each Stripe Checkout session contains, written when it is created
//   orders.jsonl             one line per payment event received from Stripe; the last line of an id wins
//   mails.jsonl              which e-mails left (kind, order or withdrawal id, success): no address, no content
//   withdrawals.jsonl        withdrawals declared on /retractation, kept as proof (name, e-mail, order, date)
//   outbox/                  only with MAIL_OUTBOX=1 (local tests): the e-mails, written instead of sent
// Customer details of orders (name, e-mail, address) stay in Stripe and are never written here.

const DIR = process.env.DATA_DIR || path.join(process.cwd(), "data");

// The data folder is outside the build: nothing to trace there.
const file = (name: string) => path.join(/*turbopackIgnore: true*/ DIR, name);

function writeAtomic(name: string, text: string) {
  fs.mkdirSync(path.dirname(file(name)), { recursive: true });
  fs.writeFileSync(file(name) + ".tmp", text);
  fs.renameSync(file(name) + ".tmp", file(name));
}

function appendLine(name: string, row: unknown) {
  fs.mkdirSync(DIR, { recursive: true });
  fs.appendFileSync(file(name), JSON.stringify(row) + "\n");
}

function readLines<T>(name: string): T[] {
  let text = "";
  try {
    text = fs.readFileSync(file(name), "utf8");
  } catch {
    return [];
  }
  const rows: T[] = [];
  for (const line of text.split("\n")) {
    if (!line.trim()) continue;
    try {
      rows.push(JSON.parse(line) as T);
    } catch {
      // A line cut by a crash: skip it.
    }
  }
  return rows;
}

/** Today's date in Paris, YYYY-MM-DD. */
export const today = (d = new Date()) => d.toLocaleDateString("sv-SE", { timeZone: "Europe/Paris" });

// ---------------------------------------------------------------------------------------------------- Visits

export type DayStats = {
  /** Page views by path. */
  views: Record<string, number>;
  /** Visits: page views of a visitor arriving from outside the site. */
  entries: number;
  /** Where visits come from: host of the referring site, or "direct". */
  referrers: Record<string, number>;
  /** "Ajouter au panier" clicks. */
  cart: number;
  /** Stripe Checkout sessions created. */
  checkouts: number;
  /** First page of each visit. */
  landings: Record<string, number>;
  /** Visits by kind of device ("mobile", "tablet", "desktop"), read from the browser's name, which is not kept. */
  devices: Record<string, number>;
  /** "Ajouter au panier" clicks by product slug. */
  cartItems: Record<string, number>;
  /** The day's last events, oldest first, at most MAX_EVENTS: time in Paris, kind, product slugs, page. */
  events: StatEvent[];
};

export type StatEvent = { t: string; e: "cart" | "checkout"; s?: string[]; p?: string };

const MAX_EVENTS = 300;

// Days written before a field existed lack it: every read spreads the file over emptyDay().
const emptyDay = (): DayStats => ({
  views: {},
  entries: 0,
  referrers: {},
  cart: 0,
  checkouts: 0,
  landings: {},
  devices: {},
  cartItems: {},
  events: [],
});

const addTo = (into: Record<string, number>, from: Record<string, number> = {}) => {
  for (const [k, n] of Object.entries(from)) into[k] = (into[k] ?? 0) + n;
};

function merge(into: DayStats, add: DayStats) {
  addTo(into.views, add.views);
  addTo(into.referrers, add.referrers);
  addTo(into.landings, add.landings);
  addTo(into.devices, add.devices);
  addTo(into.cartItems, add.cartItems);
  into.events = [...into.events, ...(add.events ?? [])].slice(-MAX_EVENTS);
  into.entries += add.entries;
  into.cart += add.cart;
  into.checkouts += add.checkouts;
  return into;
}

/** The time in Paris, HH:MM, of an event. */
export const nowTime = () => new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" });

// Counts wait in memory and are added to the day's file every few seconds. The buffer lives on globalThis because
// each route bundle may load its own copy of this module.
const g = globalThis as unknown as { __stats?: Map<string, DayStats>; __statsTimer?: NodeJS.Timeout | null; __statsExit?: boolean };
g.__stats ??= new Map();

function flush() {
  const pending = g.__stats!;
  g.__statsTimer = null;
  for (const [day, add] of pending) {
    const name = `stats/${day}.json`;
    let current = emptyDay();
    try {
      current = { ...emptyDay(), ...JSON.parse(fs.readFileSync(file(name), "utf8")) };
    } catch {}
    writeAtomic(name, JSON.stringify(merge(current, add)));
  }
  pending.clear();
}

export function count(change: (day: DayStats) => void) {
  const key = today();
  const day = g.__stats!.get(key) ?? emptyDay();
  change(day);
  g.__stats!.set(key, day);
  g.__statsTimer ??= setTimeout(() => {
    try {
      flush();
    } catch (e) {
      console.error("stats flush failed", e);
    }
  }, 10_000);
  if (!g.__statsExit) {
    g.__statsExit = true;
    process.on("exit", () => {
      try {
        flush();
      } catch {}
    });
  }
}

/** The last `days` days, oldest first, including the counts not written yet. */
export function readStats(days: number): { day: string; stats: DayStats }[] {
  const out = [];
  for (let i = days - 1; i >= 0; i--) {
    const day = today(new Date(Date.now() - i * 86_400_000));
    let stats = emptyDay();
    try {
      stats = { ...emptyDay(), ...JSON.parse(fs.readFileSync(file(`stats/${day}.json`), "utf8")) };
    } catch {}
    const pending = g.__stats!.get(day);
    out.push({ day, stats: pending ? merge(stats, pending) : stats });
  }
  return out;
}

// ---------------------------------------------------------------------------------------------------- Orders

export type OrderItem = { slug: string; sku: string; name: string; quantity: number; unitAmount: number };

export type Checkout = { id: string; created: string; items: OrderItem[] };

export const saveCheckout = (c: Checkout) => appendLine("checkouts.jsonl", c);

export const findCheckout = (id: string) => readLines<Checkout>("checkouts.jsonl").find((c) => c.id === id);

export type Order = {
  /** Stripe Checkout session id. */
  id: string;
  created: string;
  status: "paid" | "pending" | "failed";
  /** Cents, as charged by Stripe. */
  amountTotal: number;
  amountShipping: number;
  currency: string;
  items: OrderItem[];
  /** Delivery country (ISO code), the only part of the address kept here. */
  country: string | null;
  paymentIntent: string | null;
  livemode: boolean;
};

export const saveOrder = (o: Order) => appendLine("orders.jsonl", o);

/** The number shown to the customer: the end of the Stripe session id. */
export const orderNumber = (sessionId: string) => sessionId.slice(-8).toUpperCase();

/** Every order, newest first. A late "pending" never replaces "paid" (Stripe does not guarantee the event order). */
export function readOrders(): Order[] {
  const byId = new Map<string, Order>();
  for (const o of readLines<Order>("orders.jsonl")) {
    const before = byId.get(o.id);
    if (before?.status === "paid" && o.status === "pending") continue;
    byId.set(o.id, before ? { ...before, ...o, items: o.items.length ? o.items : before.items } : o);
  }
  return [...byId.values()].sort((a, b) => b.created.localeCompare(a.created));
}

// ---------------------------------------------------------------------------------------------------- E-mails

export type MailKind = "order" | "order-alert" | "withdrawal" | "withdrawal-alert";

type MailRow = { kind: MailKind; id: string; at: string; ok: boolean };

export const recordMail = (kind: MailKind, id: string, ok: boolean) =>
  appendLine("mails.jsonl", { kind, id, at: new Date().toISOString(), ok } satisfies MailRow);

/** Whether this e-mail already left: a Stripe event sent twice must not send it twice. */
export const mailSent = (kind: MailKind, id: string) => readLines<MailRow>("mails.jsonl").some((m) => m.kind === kind && m.id === id && m.ok);

/** The ids whose e-mail of this kind left, and those whose every attempt failed. */
export function mailStatus(kind: MailKind) {
  const sent = new Set<string>();
  const tried = new Set<string>();
  for (const m of readLines<MailRow>("mails.jsonl"))
    if (m.kind === kind) (m.ok ? sent : tried).add(m.id);
  return { sent, failed: new Set([...tried].filter((id) => !sent.has(id))) };
}

/** Local tests (MAIL_OUTBOX=1): an e-mail written to DATA_DIR/outbox instead of being sent. */
export function writeOutbox(name: string, raw: Buffer) {
  fs.mkdirSync(file("outbox"), { recursive: true });
  fs.writeFileSync(file(`outbox/${name}`), raw);
}

// ---------------------------------------------------------------------------------------------------- Withdrawals

export type Withdrawal = {
  /** Reference given to the customer, "R-" and 6 characters. */
  id: string;
  /** Date and time of the declaration (ISO). */
  at: string;
  name: string;
  /** What identifies the contract: the order number, or what the customer wrote. */
  order: string;
  email: string;
  /** The products concerned, empty for the whole order. */
  items: string;
};

export const saveWithdrawal = (w: Withdrawal) => appendLine("withdrawals.jsonl", w);

/** Every withdrawal, newest first. */
export const readWithdrawals = () => readLines<Withdrawal>("withdrawals.jsonl").sort((a, b) => b.at.localeCompare(a.at));
