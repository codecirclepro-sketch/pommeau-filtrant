import { getProduct } from "@/lib/catalogue";
import { allow, clientAddress } from "@/lib/limits";
import { knownPaths } from "@/lib/routes";
import { count, nowTime } from "@/lib/store";

// Visit counter, called by the browser on each page (src/components/hit.tsx) and on a few actions. It keeps counts
// only: path, number of visits, referring site's host, first page of a visit, kind of device; for an "add to cart",
// the product, the page and the time; for a PDF made with a free tool, the tool and the time. No cookie, no IP written, no identifier. Robots are left out.

const BOT = /bot|crawl|spider|slurp|facebookexternalhit|preview|headless|lighthouse|pagespeed|monitor|curl|wget|python|axios|fetch/i;
const HOST = /^[a-z0-9.-]{1,100}$/;

/** The kind of device, from the browser's name (which is not kept). */
const device = (agent: string) =>
  /iPad|Tablet|Android(?!.*Mobile)/i.test(agent) ? "tablet" : /Mobi|iPhone|Android/i.test(agent) ? "mobile" : "desktop";

const done = () => new Response(null, { status: 204 });

export async function POST(req: Request) {
  const agent = req.headers.get("user-agent") ?? "";
  if (!agent || BOT.test(agent) || !allow(`hit:${clientAddress(req)}`, 120, 60_000)) return done();
  let data: { p?: unknown; r?: unknown; n?: unknown; e?: unknown; s?: unknown };
  try {
    data = JSON.parse((await req.text()).slice(0, 1000));
  } catch {
    return done();
  }
  const path = typeof data.p === "string" && knownPaths().has(data.p) ? data.p : "";

  if (data.e === "cart") {
    // Pages loaded before the product was sent with the add send none; an unknown product is not a real add.
    if (data.s !== undefined && !(typeof data.s === "string" && getProduct(data.s))) return done();
    const slug = typeof data.s === "string" ? data.s : "";
    count((day) => {
      day.cart++;
      if (slug) day.cartItems[slug] = (day.cartItems[slug] ?? 0) + 1;
      day.events.push({ t: nowTime(), e: "cart", ...(slug && { s: [slug] }), ...(path && { p: path }) });
    });
    return done();
  }

  if (!path) return done();
  const referrer = typeof data.r === "string" && HOST.test(data.r) ? data.r.replace(/^www\./, "") : "direct";
  count((day) => {
    day.views[path] = (day.views[path] ?? 0) + 1;
    if (data.n === true) {
      day.entries++;
      day.referrers[referrer] = (day.referrers[referrer] ?? 0) + 1;
      day.landings[path] = (day.landings[path] ?? 0) + 1;
      const kind = device(agent);
      day.devices[kind] = (day.devices[kind] ?? 0) + 1;
    }
  });
  return done();
}
