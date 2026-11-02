// In-memory request limits per client address. An address is only held while its window lasts (at most 15 minutes),
// never written anywhere: the privacy policy says so.

const KEEP = 15 * 60_000;

const g = globalThis as unknown as { __limits?: Map<string, { start: number; n: number }>; __limitsSwept?: number };
g.__limits ??= new Map();

/** True while `key` stays under `max` calls per `windowMs` (at most 15 minutes). */
export function allow(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const hits = g.__limits!;
  if (now - (g.__limitsSwept ?? 0) > 60_000) {
    for (const [k, v] of hits) if (now - v.start > KEEP) hits.delete(k);
    g.__limitsSwept = now;
  }
  const entry = hits.get(key);
  if (!entry || now - entry.start > windowMs) {
    hits.set(key, { start: now, n: 1 });
    return true;
  }
  entry.n++;
  return entry.n <= max;
}

/** The visitor's address as nginx gives it (the app only listens on 127.0.0.1, behind nginx). */
export const clientAddress = (req: Request) =>
  req.headers.get("x-real-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "local";

/** Requests that change something must come from a page of the site. */
export function sameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  if (!origin) return false;
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
