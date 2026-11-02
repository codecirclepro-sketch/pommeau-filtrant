# pommeau-filtrant.fr

@AGENTS.md

## What this is

pommeau-filtrant.fr, a French online shop of filtering shower heads, shower filters and their refills, built for SEO first. Owner: Nicolas. Started on 2026-11-02 from the engine and the layout of cadre-photo-connecte.fr (`~/cadre-photo-connecte`, a separate live shop), emptied of its catalogue, guides and texts, with a new palette and logo. Nicolas will send a design to follow; until then the layout is cadre-photo-connecte's (itself after cadrephoto.fr). It shares nothing at run time with the other shops (imprimante-etiquettes.fr, parcourschat.fr, litiere-electrique.fr, cadre-photo-connecte.fr) or with Chat IA and IA Gratuit: own repository, folder, pm2 app, port, data folder, mailbox, and its own Stripe account (created on 2026-11-02): never copy a Stripe key from another shop.

**State on 2026-11-02**: opened to search engines (`INDEXABLE = true`) the day it went live. Ten published products from AliExpress (docs/catalogue-a-importer.md says why each was chosen, what to check and what was set aside), five categories, five guides (pictures: supplier photos of products on sale). Delivery is filled in, and payments open with the live key and the webhook secret of the VPS's `.env.local` (no consumer mediator yet, as on the other shops). The prices are first prices, chosen against French prices, for Nicolas to change.

All site text is in French and addresses the customer as "vous". Code, comments and commit messages are in English. Nicolas is addressed as "tu".

## Commands

Node 22 or newer (the content checker relies on Node's built-in TypeScript stripping, 22.18+). In Nicolas's PowerShell, scripts are blocked: give him `npm.cmd` and `npx.cmd`, with the folder (`npm.cmd --prefix C:\Users\nicolas\pommeau-filtrant run dev`).

```bash
npm install
npm run dev                         # http://localhost:3000
npm run lint
node scripts/check-content.mjs      # SEO rules of the catalogue and guides, and the launch list
npm run build
```

Run `npm run lint`, `node scripts/check-content.mjs` and `npm run build` before pushing. `npx next typegen` writes the `PageProps` types that `tsc` needs.

## Environment

`.env.example` lists the variables; `.env.local` holds them and is never committed or pasted into a chat.

- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`: the shop's Stripe account. Test keys first.
- `ADMIN_PASSWORD`: the dashboard's password (12 characters or more, otherwise `/admin` is closed).
- `DATA_DIR`: where orders and visit counts are written; on the VPS, `~/pommeau-filtrant-data` (set in `ecosystem.config.cjs`).
- `NEXT_PUBLIC_SITE_URL`, `SHOW_DRAFTS=1`: local development only.

## Map

| Path | Role |
|---|---|
| `src/content/types.ts` | `Category`, `Product`, `Facet` and `MenuGroup` types, with every limit. `FilterKey`: `type` (pommeau, filtre à visser, recharge) and `technologie` (vitamine C, billes, filtre remplaçable, multicouche) |
| `src/content/categories.ts` | The category pages (`/<slug>`), one search intention each; `filters` adds chips above a category's products (client-side, no new address). They also make the header's bar and the phone chips |
| `src/content/facets.ts`, `src/components/shop-page.tsx`, `src/app/(shop)/boutique/` | The shop: `/boutique` (every product) and one indexable page per filter value, `/boutique/<slug>` (`FACETS`). A page needs two published products: with fewer, it is not built (404) and the checker complains |
| `src/content/menu.ts` | `GUIDE_MENU`: the guides by theme, in the "Guides d'achat" panel of the header, the phone menu and the footer. Every guide must be in a group (the checker says which is missing) |
| `src/content/products.ts` | The products (`/produit/<slug>`). Only real supplier data. `draft: true` = shown only while the site is closed to search engines (a preview), never indexed, never payable with a live Stripe key. A product without a photo gets a drawing: a box for an `ACC` SKU, a loop for a refill, a shower head otherwise (`productIcon`, `src/lib/cart-products.ts`) |
| `src/content/shop.ts` | Seller identity, delivery, returns, mediator. Every `null` shows as "[À compléter : …]" |
| `content/guides/*.md` | Buying guides (`/guides/<slug>`): front matter `title`, `description`, `category` (the page served, or `accueil`), `date`, optional `updated`, optional `image` (`/images/guides/<name>.jpg`, 1200 × 800, in `public/`) and `imageAlt`; no H1 |
| `content/legal/*.md` | Legal pages, with `{{tokens}}` filled from `shop.ts` (`src/lib/legal.ts`) |
| `src/lib/catalogue.ts`, `guides.ts`, `legal.ts`, `markdown.ts` | Reading the content |
| `src/lib/site.ts` | Brand, URL, `INDEXABLE`, `CONTENT_UPDATED` |
| `src/lib/seo.ts`, `structured.ts` | Canonical, robots and share preview of a page; schema.org data |
| `src/app/(shop)/` | The shop's pages: home (banner with the search card `FINDER`, products, text, tiles of the categories `TILES`, how it works, the limescale block, FAQ with its FAQPage data), `[categorie]`, `produit/[slug]`, `boutique`, `guides`, `recherche`, `panier`, `commande/merci`, `commande/annulee`, `contact`, legal pages |
| `src/app/(shop)/recherche` | The header's search: a plain GET form (works without JavaScript), read on each request, over the products, categories and guides; `noindex` |
| `src/components/site.tsx` | Band of promises, header (logo, search, Guides, Contact, cart; the categories bar and the "Guides d'achat" panel), phone menu, the promises row and the footer, breadcrumb, `JsonLd` |
| `src/components/icon.tsx` | The line icons and the logo (a shower head and its drops in a blue square, reversed in the header) |
| `src/components/product.tsx`, `product-parts.tsx` | Product cards (photo on a sand tile, round add button, brand, name, summary, price, "Voir le produit"); range picker and spec table |
| `src/app/api/checkout` | Cart → Stripe Checkout session (prices from the catalogue, never from the browser) |
| `src/app/api/stripe/webhook` | Records orders from signed Stripe events |
| `src/app/api/hit` | Visit counter (no cookie, no IP written): visits, pages, referrers, landing pages, devices, adds to cart by product, checkouts |
| `src/app/admin`, `src/app/api/admin`, `src/lib/admin.ts` | Dashboard behind a password form and a signed session cookie |
| `src/lib/store.ts` | Plain files in `DATA_DIR`: `stats/<day>.json`, `checkouts.jsonl`, `orders.jsonl` |
| `src/lib/cart.ts`, `src/components/cart-view.tsx`, `cart-drawer.tsx` | The cart, in the browser's localStorage |
| `TOOLS` in `src/lib/routes.ts` | Free tools (none): a client-side page listed in `TOOLS` appears in the sitemap and `llms.txt`. `STATIC_PAGES` lists the fixed pages (the visit counter ignores any other path) |
| `src/lib/mail.ts`, `src/lib/emails.ts` | E-mails from the shop's Hostinger mailbox (SMTP): order confirmation with the CGV attached and the shop's alert, withdrawal acknowledgment and alert |
| `src/app/(shop)/retractation`, `src/app/api/retractation` | The online withdrawal function ("Renoncer au contrat ici", required since 19 June 2026) |
| `src/styles/site.css`, `admin.css` | All CSS, plain. `site.css`: tokens (deep teal blue `--brand`, pale blue `--tint`, sand `--sand` for photos, coral `--accent`, darker `--cta` for white text, `--wall` the colour the banner photo fades into), then one section per part of the site; Manrope, self-hosted by `next/font` (`src/app/layout.tsx`). `admin.css`: the dashboard's own rules |
| `deploy/`, `ecosystem.config.cjs` | VPS: git hook, nginx site, pm2 app `pommeau-filtrant` on 127.0.0.1:3080 |
| `docs/mise-en-ligne.md` | Nicolas's launch guide (DNS, Stripe, VPS, Search Console), in French |

**To add a product**: add it to `src/content/products.ts` from the supplier's data, its photos to `public/produits/<slug>/` (product photos on a white or transparent ground: the cards show them on the sand ground with `mix-blend-mode: multiply`), then run `node scripts/check-content.mjs` until it reports 0 problems. Categories, sitemap, `llms.txt`, cart and checkout follow. Products sold as options of one another (colours, packs) share a `range` (titles in `RANGES`, `src/lib/catalogue.ts`). Give it its `filters` values.

**To add a shop page**: add a `Facet` to `src/content/facets.ts` (a filter value shared by at least two products, a keyword no other page targets), its group to `FACET_GROUPS`, then run the checker.

**To add a guide**: add its Markdown file, then a short name for it in a `GUIDE_MENU` group (`src/content/menu.ts`). The header's "Guides d'achat" panel appears with the first group; set `FEATURED_GUIDE` in `src/components/site.tsx` then.

**Home and category photos** are in `public/images/accueil/`: crops of supplier photos, without their English captions. The photo of a product shown there must stay one of a product on sale.

## Rules

- **Nothing invented**: no product, price, specification, stock figure, review, rating, statistic or testimonial that Nicolas or the supplier did not give. Guides and the home page's FAQ state general, checkable facts about these devices and hedge where models differ ("selon les modèles", "le fabricant précise").
- One search intention per URL; the keyword is in the title, the description and the H1 (the checker enforces it, and refuses repeated sentences). The home page targets "pommeau filtrant"; the categories, the sub-intents ("pommeau de douche filtrant", "pommeau de douche vitamine C", "filtre de douche", "pommeau de douche anti calcaire", recharges).
- A category without a published product is `noindex` and out of the sitemap.
- No persuasion tricks (French consumer law, DGCCRF): no countdown, stock counter, struck-through price, "best seller" badge or invented review. The 14-day withdrawal right and the legal guarantee are written as the law's, for any purchase at a distance, never as a perk of the shop (Code de la consommation, L121-4 10°).
- Two gates (`docs/mise-en-ligne.md`, section 5). `INDEXABLE` opens the site to search engines: it needs the seller's identity and a published product (the checker enforces it). Payments open with a live Stripe key once the delivery and returns of `shop.ts` are filled in and the webhook's secret is set, so that no order can be taken that the webhook would not record (`paymentOpen()` and `sellingReady()` in `src/lib/stripe.ts`; the dashboard says why they stay closed); with a test key, the cart is closed to the public once `INDEXABLE` is true. While visitors cannot pay, product pages carry no Offer in their structured data.
- **No health or beauty promise.** A shower filter is not a treatment: say what its materials are meant to retain (chlorine, particles), as the maker's claim, never effects on skin, hair, eczema or hair loss, nor "medical" or "pH" virtues. The listings and their photos are full of such claims: do not repeat them, and do not use photos that show them (before/after pictures, captions).
- **Limescale, honestly.** No shower head softens water; only a softener removes dissolved limescale. The anti-calcaire page says so first, then what helps (heads that come apart, soft nozzles, particle filters).
- The products are bathroom goods from China: French instructions, the EU responsible person (GPSR) and, for materials in contact with tap water, what French rules ask (sanitary conformity) are checked before selling (launch guide, section 5).
- In a legal page, a note to Nicolas written as a quoted `> <mark class="todo">[À compléter : …]</mark>` line is hidden from the public site once `INDEXABLE` is true; `scripts/check-content.mjs` still lists it. Other `[À compléter]` marks (empty fields of `shop.ts`) stay visible.
- `GUIDES` in `src/app/(shop)/page.tsx` picks the guides of the home page and `FEATURED_GUIDE` in `src/components/site.tsx` the one of the header's panel: both empty until the first guides.
- Legal pages must stay true to what the code does (`confidentialite.md`: no cookie, no IP written, customer details kept in Stripe only). Update them, and their `updated` date, with any change.

## Things that are not obvious

- **Real 404s**: every dynamic route has `dynamicParams = false` and lists its pages in `generateStaticParams`. Cache Components is off on purpose (with it, `notFound()` after streaming answers 200). `/recherche` is the one page rendered on each request.
- **The cart page reads `STRIPE_SECRET_KEY` at build time** to know whether payment is open: rebuild after setting the key (a `git push` without a new commit rebuilds nothing).
- **The webhook only records sessions whose metadata `site` is the domain**, in case the Stripe account also serves something else. Card data never reaches the server; customer name, e-mail and address stay in Stripe.
- **Stats live in memory for up to 10 seconds** before being added to the day's file; they are flushed on exit. pm2 must run a single instance.
- **The dashboard shows a password form** (`/api/admin/login`, 5 attempts per address every 15 minutes) and then trusts an HttpOnly cookie signed with the password for 30 days; changing `ADMIN_PASSWORD` signs everyone out. Without `ADMIN_PASSWORD` it answers 404.
- **E-mails need `SMTP_USER` and `SMTP_PASSWORD`** in the VPS's `.env.local` (docs/mise-en-ligne.md, "Les e-mails"); without them nothing is sent and the dashboard shows it in red. Locally, `MAIL_OUTBOX=1` writes them to `DATA_DIR/outbox/` instead.
- **Security headers and the CSP are in `next.config.ts`.** The site loads nothing from other domains; adding a third-party script means updating the CSP and the privacy policy. The fonts are downloaded by `next/font` when the site is built (the VPS needs to reach Google Fonts during `npm run build`) and then served by the site itself.
- **The header is sticky with a backdrop-filter**: a fixed panel inside it would be trapped, so the phone menu is rendered into `<body>` and the cart drawer sits outside the header.

## Git and deployment

- Nicolas works alone on this repository so far: commits go to `main` (`origin`, `codecirclepro-sketch/pommeau-filtrant`). The two-person routine of litiere-electrique.fr (branches and pull requests, `.githooks/pre-push`, the CI of `.github/workflows`) is not here: copy it from there if someone else joins.
- Production deployment is done by Nicolas only: `git -C C:\Users\nicolas\pommeau-filtrant push vps main` runs `deploy/post-receive` on the VPS (checkout, `npm ci`, build, `pm2 startOrRestart`). His terminal opens in `~/chat-ia`, which has its own `vps` remote: every command given to him names this folder.
- On the VPS (shared with IA Gratuit on 3020, Chat IA on 3030, imprimante-etiquettes.fr on 3040, parcourschat.fr on 3050, litiere-electrique.fr on 3060 and cadre-photo-connecte.fr on 3070, among other apps): bare repository `~/repos/pommeau-filtrant.git`, app folder `~/pommeau-filtrant`, data `~/pommeau-filtrant-data`, pm2 app `pommeau-filtrant` on 127.0.0.1:3080. Never reuse another app's names, folders or port, and never run commands on the VPS for Nicolas.
