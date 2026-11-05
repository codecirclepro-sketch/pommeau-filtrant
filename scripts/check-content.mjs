// Checks the catalogue and the guides against the SEO rules of src/content/types.ts, and lists what is left to
// fill before launch. Exits with 1 when something is wrong, or when INDEXABLE is true while a placeholder is left.
//   node scripts/check-content.mjs
// Node strips the TypeScript types itself: the content files only import types.
import { existsSync, readdirSync, readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const load = (path) => import(new URL(path, root).href);

const { CATEGORIES } = await load("src/content/categories.ts");
const { BOUTIQUE, FACET_GROUPS, FACETS } = await load("src/content/facets.ts");
const { GUIDE_MENU } = await load("src/content/menu.ts");
const { PRODUCTS } = await load("src/content/products.ts");
const { SHOP } = await load("src/content/shop.ts");
const { INDEXABLE } = await load("src/lib/site.ts");

const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[’']/g, " ");
const len = (s) => [...(s ?? "")].length;
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

let problems = 0;
const say = (where, what) => {
  problems++;
  console.log(`  ${where}: ${what}`);
};
const range = (where, field, value, min, max) => {
  const n = len(value);
  if (n < min || n > max) say(where, `${field} is ${n} characters (${min}-${max}): "${String(value).slice(0, 70)}"`);
};
const unique = (items, key, label) => {
  const seen = new Map();
  for (const item of items) {
    const k = norm(item[key] ?? "");
    if (seen.has(k)) say(label(item), `same ${key} as ${label(seen.get(k))}`);
    else seen.set(k, item);
  }
};

// ---------------------------------------------------------------------------------------------------- Guides

const guideDir = new URL("content/guides/", root);
const guides = readdirSync(guideDir)
  .filter((f) => f.endsWith(".md"))
  .map((file) => {
    const raw = readFileSync(new URL(file, guideDir), "utf8").replace(/\r\n/g, "\n");
    const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    const meta = {};
    for (const line of (m?.[1] ?? "").split("\n")) {
      const i = line.indexOf(":");
      if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^"(.*)"$/, "$1");
    }
    return { slug: file.replace(/\.md$/, ""), meta, body: m?.[2] ?? "" };
  });

// ---------------------------------------------------------------------------------------------------- Known pages

const legal = ["mentions-legales", "cgv", "livraison-retours", "confidentialite"];
const published = PRODUCTS.filter((p) => !p.draft);
const values = (p, key) => [p.filters?.[key] ?? []].flat();
const facetProducts = (f) => published.filter((p) => values(p, f.key).includes(f.value));
const known = new Set([
  "/",
  "/boutique",
  ...FACETS.filter((f) => facetProducts(f).length >= 2).map((f) => `/boutique/${f.slug}`),
  "/guides",
  "/contact",
  "/panier",
  "/retractation",
  "/recherche",
  ...legal.map((l) => `/${l}`),
  ...CATEGORIES.map((c) => `/${c.slug}`),
  ...published.map((p) => `/produit/${p.slug}`),
  ...guides.map((g) => `/guides/${g.slug}`),
]);

// ---------------------------------------------------------------------------------------------------- Categories

console.log(`Categories (${CATEGORIES.length})`);
for (const c of CATEGORIES) {
  const where = `/${c.slug}`;
  if (!SLUG.test(c.slug)) say(where, "slug must be lowercase words joined by hyphens");
  range(where, "title", c.title, 30, 60);
  range(where, "description", c.description, 110, 160);
  range(where, "intro", c.intro, 150, 500);
  const k = norm(c.keyword);
  for (const field of ["title", "description", "h1"]) if (!norm(c[field]).includes(k)) say(where, `keyword "${c.keyword}" missing from ${field}`);
  if (c.sections.length < 3) say(where, "needs at least 3 sections of buying advice");
  for (const g of c.guides) if (!guides.some((x) => x.slug === g)) say(where, `unknown guide "${g}"`);
  if (c.image) {
    if (!/^\/images\/(rayons|guides)\/[a-z0-9-]+\.jpg$/.test(c.image.src)) say(where, "image must be /images/rayons/<name>.jpg or a guide's picture");
    else if (!existsSync(new URL(`public${c.image.src}`, root))) say(where, `image not found: public${c.image.src}`);
    if (!c.image.alt) say(where, "an image needs alt");
  }
  for (const col of c.compare ?? [])
    if (col !== "recharge" && !PRODUCTS.some((p) => col.split("|").some((l) => p.specs.some((s) => s.label === l))))
      say(where, `compare column "${col}" matches no product's spec`);
  for (const f of c.faq ?? []) if (!f.q?.trim() || !f.a?.trim()) say(where, "a question of the FAQ is empty");
}

// ---------------------------------------------------------------------------------------------------- Shop pages

console.log(`Shop pages (${FACETS.length})`);
range("/boutique", "title", BOUTIQUE.title, 30, 60);
range("/boutique", "description", BOUTIQUE.description, 110, 160);
for (const g of BOUTIQUE.guides) if (!guides.some((x) => x.slug === g)) say("/boutique", `unknown guide "${g}"`);
for (const f of FACETS) {
  const where = `/boutique/${f.slug}`;
  if (!SLUG.test(f.slug)) say(where, "slug must be lowercase words joined by hyphens");
  if (!FACET_GROUPS.some((g) => g.key === f.key)) say(where, `unknown filter "${f.key}"`);
  const n = facetProducts(f).length;
  if (n < 2) say(where, `${n} published product(s) with ${f.key} "${f.value}": a shop page needs 2`);
  range(where, "title", f.title, 30, 60);
  range(where, "description", f.description, 110, 160);
  range(where, "intro", f.intro, 150, 500);
  const k = norm(f.keyword);
  for (const field of ["title", "description", "h1"]) if (!norm(f[field]).includes(k)) say(where, `keyword "${f.keyword}" missing from ${field}`);
  if (f.sections.length < 2) say(where, "needs at least 2 sections of advice");
  for (const g of f.guides) if (!guides.some((x) => x.slug === g)) say(where, `unknown guide "${g}"`);
}

// One search phrase, title and description per page, across the categories and the shop pages.
const hubs = [
  ...CATEGORIES.map((c) => ({ ...c, where: `/${c.slug}` })),
  ...FACETS.map((f) => ({ ...f, where: `/boutique/${f.slug}` })),
];
const pages = [...hubs, { ...BOUTIQUE, where: "/boutique" }];
unique(hubs, "slug", (x) => x.where);
unique(hubs, "keyword", (x) => x.where);
unique(pages, "title", (x) => x.where);
unique(pages, "description", (x) => x.where);

// ---------------------------------------------------------------------------------------------------- Products

/** What a product still lacks before it can be published. Photos are wanted but not required: they come later. */
function gaps(p) {
  const out = [];
  if (!p.price) out.push("price");
  if (JSON.stringify([p.body, p.specs, p.summary]).includes("[À compléter")) out.push("the supplier data marked « À compléter »");
  return out;
}

console.log(`Products (${published.length} published, ${PRODUCTS.length - published.length} draft)`);
for (const p of PRODUCTS) {
  const where = `/produit/${p.slug}`;
  if (!SLUG.test(p.slug)) say(where, "slug must be lowercase words joined by hyphens");
  if (!p.sku) say(where, "sku missing");
  if (!CATEGORIES.some((c) => c.slug === p.category)) say(where, `unknown category "${p.category}"`);
  for (const a of p.also ?? []) if (!CATEGORIES.some((c) => c.slug === a)) say(where, `unknown category "${a}" in also`);
  if (!Number.isInteger(p.price) || p.price < 0) say(where, "price must be a whole number of cents");
  if (!["in_stock", "backorder", "out_of_stock"].includes(p.availability)) say(where, `unknown availability "${p.availability}"`);
  range(where, "title", p.title, 30, 60);
  range(where, "description", p.description, 110, 160);
  if (!p.summary) say(where, "summary missing");
  if (!DATE.test(p.updated ?? "")) say(where, "updated must be YYYY-MM-DD");
  if (p.gtin && !/^\d{8}(\d{4,6})?$/.test(p.gtin)) say(where, "gtin must be 8, 12, 13 or 14 digits");
  // What a draft still needs is listed under "Before launch"; a published product must have all of it.
  if (!p.draft) for (const gap of gaps(p)) say(where, `published without ${gap}`);
  for (const img of p.images) {
    if (!existsSync(new URL(`public${img.src}`, root))) say(where, `photo not found: public${img.src}`);
    if (!img.alt) say(where, `photo ${img.src} needs an alt text`);
  }
  for (const r of p.related ?? []) if (!PRODUCTS.some((x) => x.slug === r)) say(where, `unknown related product "${r}"`);
}
unique(PRODUCTS, "slug", (p) => `/produit/${p.slug}`);
unique(PRODUCTS, "sku", (p) => `/produit/${p.slug}`);
unique(PRODUCTS, "title", (p) => `/produit/${p.slug}`);
unique([...PRODUCTS, ...pages], "description", (x) => x.where ?? `/produit/${x.slug}`);

// ---------------------------------------------------------------------------------------------------- Guides

console.log(`Guides (${guides.length})`);
for (const g of guides) {
  const where = `/guides/${g.slug}`;
  for (const key of ["title", "description", "category", "date"]) if (!g.meta[key]) say(where, `front matter "${key}" missing`);
  if (!SLUG.test(g.slug)) say(where, "file name must be lowercase words joined by hyphens");
  range(where, "title", g.meta.title, 20, 70);
  range(where, "description", g.meta.description, 110, 170);
  if (g.meta.category !== "accueil" && !CATEGORIES.some((c) => c.slug === g.meta.category))
    say(where, `unknown category "${g.meta.category}"`);
  if (!DATE.test(g.meta.date ?? "")) say(where, "date must be YYYY-MM-DD");
  if (/^# /m.test(g.body)) say(where, "no H1 in the body: the title is the H1");
  const target = g.meta.category === "accueil" ? null : `/${g.meta.category}`;
  if (target && !g.body.includes(`](${target})`)) say(where, `must link to the page it serves, ${target}`);
  if (g.meta.image) {
    if (!/^\/images\/guides\/[a-z0-9-]+\.jpg$/.test(g.meta.image)) say(where, "image must be /images/guides/<name>.jpg");
    else if (!existsSync(new URL(`public${g.meta.image}`, root))) say(where, `image not found: public${g.meta.image}`);
    if (!g.meta.imageAlt) say(where, "an image needs imageAlt");
  }
}
unique(guides.map((g) => ({ ...g.meta, slug: g.slug })), "title", (g) => `/guides/${g.slug}`);

// ---------------------------------------------------------------------------------------------------- Menus

// Every guide is in a group of the menus, and every link of the menus opens a page.
const menuPaths = GUIDE_MENU.flatMap((g) => g.links.map((l) => l.path));
for (const path of menuPaths) if (!known.has(path)) say("src/content/menu.ts", `link to an unknown page: ${path}`);
for (const g of guides) if (!menuPaths.includes(`/guides/${g.slug}`)) say("src/content/menu.ts", `guide not in a group: ${g.slug}`);

// ---------------------------------------------------------------------------------------------------- Links and repeated sentences

const texts = [
  ...hubs.map((h) => ({
    where: h.where,
    text: [h.intro, ...h.sections.flatMap((s) => s.body), ...(h.faq ?? []).flatMap((f) => [f.q, f.a])].join(" "),
  })),
  { where: "/boutique", text: [BOUTIQUE.intro, ...BOUTIQUE.sections.flatMap((s) => s.body)].join(" ") },
  ...guides.map((g) => ({ where: `/guides/${g.slug}`, text: g.body })),
  ...PRODUCTS.filter((p) => !p.draft).map((p) => ({ where: `/produit/${p.slug}`, text: `${p.summary} ${p.body}` })),
];
const sentences = new Map();
for (const { where, text } of texts) {
  for (const [, href] of text.matchAll(/\]\((\/[^)#\s]*)/g)) if (!known.has(href)) say(where, `link to an unknown page: ${href}`);
  const plain = text.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/[*_`#>|]/g, " ");
  for (const s of plain.split(/(?<=[.!?])\s+/)) {
    const key = norm(s).replace(/\s+/g, " ").trim();
    if (key.length < 50) continue;
    const first = sentences.get(key);
    if (first && first !== where) say(where, `sentence also on ${first}: "${s.trim().slice(0, 70)}…"`);
    else sentences.set(key, where);
  }
}

// ---------------------------------------------------------------------------------------------------- Launch

// Two gates. Opening the site to search engines needs the seller's identity (mentions légales) and a product.
// Opening payments (a live Stripe key) needs the rest: delivery, returns, mediator, CGV read by a lawyer.
const IDENTITY = ["legalName", "legalForm", "registration", "vatNumber", "vatExempt", "address", "email", "phone", "publisher", "host"];
const unset = (k) => SHOP[k] === null && !(k === "vatNumber" && SHOP.vatExempt === true);
const identity = IDENTITY.filter(unset);
const selling = Object.keys(SHOP).filter((k) => !IDENTITY.includes(k) && unset(k));
if (!SHOP.shipping.length) selling.push("shipping");
const legalTodo = legal.filter((l) => readFileSync(new URL(`content/legal/${l}.md`, root), "utf8").includes("[À compléter"));

console.log("\nBefore opening to search engines");
console.log(`  seller identity left in src/content/shop.ts: ${identity.length ? identity.join(", ") : "none"}`);
console.log(`  published products: ${published.length}`);
const noPhoto = published.filter((p) => !p.images.length);
if (noPhoto.length) console.log(`  published without photos (add them soon): ${noPhoto.map((p) => p.sku).join(", ")}`);
const drafts = PRODUCTS.filter((p) => p.draft);
if (drafts.length) {
  console.log("  drafts and what they still need:");
  for (const p of drafts) console.log(`    ${p.sku.padEnd(17)} ${gaps(p).join(", ") || "nothing: remove draft: true to publish"}`);
}
console.log("\nBefore opening payments (live Stripe key)");
console.log(`  delivery and returns fields left in src/content/shop.ts: ${selling.length ? selling.join(", ") : "none"}`);
console.log(`  legal pages with a written note to remove: ${legalTodo.length ? legalTodo.join(", ") : "none"}`);
if (INDEXABLE && (identity.length || !published.length))
  say("src/lib/site.ts", "INDEXABLE is true while the seller's identity or a published product is missing");

console.log(`\n${problems} problem${problems === 1 ? "" : "s"}.${INDEXABLE ? "" : " Site closed to search engines (INDEXABLE = false)."}`);
process.exit(problems ? 1 : 0);
