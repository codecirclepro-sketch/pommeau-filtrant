// The cart, kept in the visitor's browser (localStorage) until checkout: product slugs and quantities only.
// Browser code only. Components read it with useCart(), which stays in sync across tabs.
import { useSyncExternalStore } from "react";
import { beacon } from "./beacon";

export type CartLine = { slug: string; qty: number };

/** What the cart, the drawer and the buy bar know about a product (sent by the server, prices included). */
export type CartProduct = {
  slug: string;
  name: string;
  price: number;
  path: string;
  available: boolean;
  image: { src: string; alt: string } | null;
  /** Drawing shown while the product has no photo. */
  icon: "shower" | "refill" | "box";
  /** Compatible products, suggested in the cart. */
  related: string[];
};

export const MAX_QTY = 20;
const MAX_LINES = 20;
const KEY = "cart:v1";
const EMPTY: CartLine[] = [];

let memory: string | null = null; // used when localStorage is blocked (private browsing, strict settings)
let lastRaw: string | null = null;
let lastLines: CartLine[] = EMPTY;
const listeners = new Set<() => void>();

function readRaw() {
  try {
    return localStorage.getItem(KEY) ?? memory;
  } catch {
    return memory;
  }
}

function parse(raw: string | null): CartLine[] {
  if (!raw) return EMPTY;
  try {
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return EMPTY;
    return data
      .filter((l) => typeof l?.slug === "string" && Number.isInteger(l?.qty) && l.qty > 0)
      .map((l) => ({ slug: l.slug, qty: Math.min(l.qty, MAX_QTY) }))
      .slice(0, MAX_LINES);
  } catch {
    return EMPTY;
  }
}

function snapshot() {
  const raw = readRaw();
  if (raw !== lastRaw) {
    lastRaw = raw;
    lastLines = parse(raw);
  }
  return lastLines;
}

function save(lines: CartLine[]) {
  const raw = JSON.stringify(lines);
  memory = raw;
  try {
    localStorage.setItem(KEY, raw);
  } catch {}
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export const useCart = () => useSyncExternalStore(subscribe, snapshot, () => EMPTY);

export function addToCart(slug: string, qty: number) {
  const lines = snapshot();
  const found = lines.find((l) => l.slug === slug);
  if (!found && lines.length >= MAX_LINES) return;
  save(
    found
      ? lines.map((l) => (l.slug === slug ? { slug, qty: Math.min(l.qty + qty, MAX_QTY) } : l))
      : [...lines, { slug, qty: Math.min(qty, MAX_QTY) }],
  );
}

export const setQuantity = (slug: string, qty: number) =>
  save(snapshot().map((l) => (l.slug === slug ? { slug, qty: Math.max(1, Math.min(qty, MAX_QTY)) } : l)));

export const removeFromCart = (slug: string) => save(snapshot().filter((l) => l.slug !== slug));

export const clearCart = () => save([]);

/** Drops the lines of products that are no longer in the catalogue, so that the header count stays right. */
export function pruneCart(known: string[]) {
  const lines = snapshot();
  if (lines.some((l) => !known.includes(l.slug))) save(lines.filter((l) => known.includes(l.slug)));
}

/** Counts an "add to cart" for the dashboard, with the product and the page it was added from. */
export const trackAddToCart = (slug: string) => beacon({ e: "cart", s: slug, p: location.pathname });

// The cart drawer opens on this event, with the slug just added (if any) to confirm it.
const OPEN = "cart:open";

export const openCart = (added?: string) => window.dispatchEvent(new CustomEvent(OPEN, { detail: added ?? null }));

export function onCartOpen(listener: (added: string | null) => void) {
  const handle = (e: Event) => listener((e as CustomEvent<string | null>).detail);
  window.addEventListener(OPEN, handle);
  return () => window.removeEventListener(OPEN, handle);
}

/** Adds, counts and opens the drawer: what every "Ajouter au panier" button does. */
export function addAndOpen(slug: string, qty = 1) {
  addToCart(slug, qty);
  trackAddToCart(slug);
  openCart(slug);
}

/** Up to `max` compatible products to suggest, not already in the cart. */
export function suggestions(lines: { product: CartProduct }[], all: CartProduct[], max: number) {
  const inCart = new Set(lines.map((l) => l.product.slug));
  const out: CartProduct[] = [];
  for (const l of lines)
    for (const slug of l.product.related) {
      const p = all.find((x) => x.slug === slug);
      if (p && p.available && !inCart.has(slug) && !out.includes(p)) out.push(p);
    }
  return out.slice(0, max);
}
