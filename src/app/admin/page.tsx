import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminLogin, AdminLogout } from "@/components/admin-login";
import { NoCount } from "@/components/no-count";
import { SHOP } from "@/content/shop";
import { getProduct, products } from "@/lib/catalogue";
import { adminPassword, isAdminSession, SESSION_COOKIE } from "@/lib/admin";
import { formatPrice } from "@/lib/format";
import { INDEXABLE } from "@/lib/site";
import { sellingReady, stripeMode } from "@/lib/stripe";
import { mailReady } from "@/lib/mail";
import { mailStatus, orderNumber, readOrders, readStats, readWithdrawals, today, type Order, type StatEvent } from "@/lib/store";

export const metadata: Metadata = { title: "Tableau de bord", robots: { index: false, follow: false } };

const PERIODS = [7, 30, 90];

const number = (n: number) => n.toLocaleString("fr-FR");
const shortDay = (day: string) =>
  new Date(`${day}T12:00:00Z`).toLocaleDateString("fr-FR", { day: "numeric", month: "short", timeZone: "Europe/Paris" });

function top(map: Record<string, number>, n: number) {
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n);
}

function sum(rows: Record<string, number>[]) {
  const out: Record<string, number> = {};
  for (const row of rows) for (const [k, v] of Object.entries(row)) out[k] = (out[k] ?? 0) + v;
  return out;
}

const STATUS_LABEL: Record<Order["status"], string> = { paid: "Payée", pending: "En attente", failed: "Échouée" };

const DEVICE_LABEL: Record<string, string> = { mobile: "Téléphone", tablet: "Tablette", desktop: "Ordinateur" };

const productName = (slug: string) => getProduct(slug)?.name ?? slug;

/** What an event of the day says, in a line. */
function eventText(ev: StatEvent) {
  const names = (ev.s ?? []).map(productName).join(", ");
  if (ev.e === "cart") return `Ajout au panier${names ? ` : ${names}` : ""}${ev.p ? ` (depuis ${ev.p})` : ""}`;
  return `Paiement commencé${names ? ` : ${names}` : ""}`;
}

export default async function AdminPage({ searchParams }: PageProps<"/admin">) {
  if (!adminPassword()) notFound();
  if (!isAdminSession((await cookies()).get(SESSION_COOKIE)?.value))
    return (
      <div className="adm">
        <AdminLogin />
      </div>
    );
  const asked = Number((await searchParams).jours);
  const days = PERIODS.includes(asked) ? asked : 30;

  const stats = readStats(days);
  const since = stats[0].day;
  const live = stripeMode() === "live";
  const orders = readOrders().filter((o) => o.livemode === live);
  const recent = orders.filter((o) => today(new Date(o.created)) >= since);
  const paid = recent.filter((o) => o.status === "paid");

  const totals = {
    entries: stats.reduce((n, d) => n + d.stats.entries, 0),
    views: stats.reduce((n, d) => n + Object.values(d.stats.views).reduce((a, b) => a + b, 0), 0),
    cart: stats.reduce((n, d) => n + d.stats.cart, 0),
    checkouts: stats.reduce((n, d) => n + d.stats.checkouts, 0),
    revenue: paid.reduce((n, o) => n + o.amountTotal, 0),
  };
  const allViews = sum(stats.map((d) => d.stats.views));
  const pages = top(allViews, 15);
  const referrers = top(sum(stats.map((d) => d.stats.referrers)), 10);
  const landings = top(sum(stats.map((d) => d.stats.landings)), 10);
  const devices = top(sum(stats.map((d) => d.stats.devices)), 3);
  const added = top(sum(stats.map((d) => d.stats.cartItems)), 10);
  const events = stats
    .flatMap(({ day, stats: s }) => s.events.map((ev, i) => ({ ...ev, day, key: `${day}-${i}` })))
    .reverse()
    .slice(0, 40);
  const productViews = Object.entries(allViews)
    .filter(([path]) => path.startsWith("/produit/"))
    .reduce((n, [, v]) => n + v, 0);
  const funnel = [
    { label: "Visites", n: totals.entries },
    { label: "Vues de fiches produits", n: productViews },
    { label: "Ajouts au panier", n: totals.cart },
    { label: "Paiements commencés", n: totals.checkouts },
    { label: "Commandes payées", n: paid.length },
  ];
  const peak = Math.max(1, ...stats.map((d) => d.stats.entries));
  const scale = niceMax(peak);

  const missing =
    Object.entries(SHOP).filter(([k, v]) => v === null && !(k === "vatNumber" && SHOP.vatExempt === true)).length +
    (SHOP.shipping.length ? 0 : 1);
  const published = products().filter((p) => !p.draft).length;
  const confirmations = mailStatus("order");
  const unconfirmed = orders.filter((o) => confirmations.failed.has(o.id)).length;
  const withdrawals = readWithdrawals();
  const receipts = mailStatus("withdrawal");
  const mode = stripeMode();
  const checks: { ok: "good" | "warning" | "critical"; label: string; detail: string }[] = [
    {
      ok: mode === "live" && sellingReady() && SHOP.mediator ? "good" : mode ? "warning" : "critical",
      label: "Paiement Stripe",
      detail:
        mode === "live"
          ? sellingReady()
            ? SHOP.mediator
              ? "Mode réel"
              : "Mode réel, paiement ouvert · médiateur de la consommation à ajouter (obligatoire)"
            : "Mode réel, mais paiement fermé : livraison ou retours manquent dans shop.ts"
          : mode === "test"
            ? INDEXABLE
              ? "Mode test : paiement fermé au public tant que la clé réelle n'est pas en place"
              : "Mode test : aucun vrai paiement"
            : "Clé STRIPE_SECRET_KEY absente",
    },
    {
      ok: process.env.STRIPE_WEBHOOK_SECRET ? "good" : "critical",
      label: "Webhook Stripe",
      detail: process.env.STRIPE_WEBHOOK_SECRET ? "Secret présent" : "STRIPE_WEBHOOK_SECRET absent : les commandes ne sont pas enregistrées",
    },
    {
      ok: missing ? "warning" : "good",
      label: "Informations vendeur",
      detail: missing ? `${missing} champ${missing > 1 ? "s" : ""} à compléter dans src/content/shop.ts` : "Complètes",
    },
    { ok: published ? "good" : "warning", label: "Produits en ligne", detail: `${published} publié${published > 1 ? "s" : ""}` },
    {
      ok: !mailReady() ? "critical" : unconfirmed ? "warning" : "good",
      label: "E-mails",
      detail: !mailReady()
        ? "SMTP_USER et SMTP_PASSWORD absents : ni confirmation de commande, ni accusé de rétractation"
        : unconfirmed
          ? `${unconfirmed} confirmation${unconfirmed > 1 ? "s" : ""} de commande non envoyée${unconfirmed > 1 ? "s" : ""} : à envoyer à la main (journal : pm2 logs)`
          : "Confirmations de commande et accusés de rétractation envoyés depuis la boîte de la boutique",
    },
    {
      ok: INDEXABLE ? "good" : "warning",
      label: "Indexation",
      detail: INDEXABLE ? "Ouverte aux moteurs de recherche" : "Fermée (INDEXABLE = false dans src/lib/site.ts)",
    },
  ];

  return (
    <div className="adm">
      <header className="adm-head">
        <div>
          <h1>Tableau de bord</h1>
          <p className="adm-sub">
            Visites comptées sans cookie ni adresse IP, robots exclus : ce sont des ordres de grandeur. Commandes {live ? "réelles" : "de test"}.
          </p>
        </div>
        <div className="adm-actions">
          <Link href="/" className="adm-link">
            Voir le site
          </Link>
          <AdminLogout />
        </div>
      </header>

      <nav className="adm-periods" aria-label="Période">
        {PERIODS.map((p) => (
          <Link key={p} href={`/admin?jours=${p}`} aria-current={p === days ? "page" : undefined}>
            {p} jours
          </Link>
        ))}
      </nav>

      <section className="adm-kpis" aria-label="Chiffres de la période">
        <div className="adm-hero">
          <p>Visites</p>
          <strong>{number(totals.entries)}</strong>
          <span>sur {days} jours</span>
        </div>
        <Tile label="Pages vues" value={number(totals.views)} />
        <Tile label="Ajouts au panier" value={number(totals.cart)} />
        <Tile label="Paiements commencés" value={number(totals.checkouts)} />
        <Tile label="Commandes payées" value={number(paid.length)} />
        <Tile label="Chiffre d'affaires TTC" value={formatPrice(totals.revenue)} />
      </section>

      <section className="adm-card" aria-labelledby="chart-title">
        <h2 id="chart-title">Visites par jour</h2>
        <div className="chart">
          <div className="chart-axis" aria-hidden="true">
            {[scale, scale / 2, 0].map((t) => (
              <span key={t}>{number(t)}</span>
            ))}
          </div>
          <div className="chart-plot">
            <div className="chart-grid" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
            <ol className="chart-bars" style={{ gridTemplateColumns: `repeat(${stats.length}, 1fr)` }}>
              {stats.map(({ day, stats: s }) => (
                <li key={day} tabIndex={0} aria-label={`${shortDay(day)} : ${s.entries} visite${s.entries > 1 ? "s" : ""}`}>
                  <span className="chart-bar" style={{ height: `${(s.entries / scale) * 100}%` }} />
                  <span className="chart-tip" role="tooltip">
                    <strong>{number(s.entries)}</strong> {shortDay(day)}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <div className="chart-x" aria-hidden="true">
          <span>{shortDay(stats[0].day)}</span>
          <span>{shortDay(stats[stats.length - 1].day)}</span>
        </div>
        <details className="adm-table-toggle">
          <summary>Voir le tableau jour par jour</summary>
          <table className="adm-table">
            <thead>
              <tr>
                <th scope="col">Jour</th>
                <th scope="col">Visites</th>
                <th scope="col">Pages vues</th>
                <th scope="col">Ajouts au panier</th>
                <th scope="col">Paiements commencés</th>
              </tr>
            </thead>
            <tbody>
              {[...stats].reverse().map(({ day, stats: s }) => (
                <tr key={day}>
                  <td>{shortDay(day)}</td>
                  <td>{number(s.entries)}</td>
                  <td>{number(Object.values(s.views).reduce((a, b) => a + b, 0))}</td>
                  <td>{number(s.cart)}</td>
                  <td>{number(s.checkouts)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      </section>

      <section className="adm-card" aria-labelledby="funnel-title">
        <h2 id="funnel-title">Parcours d&apos;achat</h2>
        <ol className="funnel">
          {funnel.map((step, i) => {
            const before = i ? funnel[i - 1].n : 0;
            return (
              <li key={step.label}>
                <span className="funnel-label">{step.label}</span>
                <span className="funnel-track" aria-hidden="true">
                  <span className="funnel-bar" style={{ width: `${funnel[0].n ? Math.min(100, Math.max(1, (step.n / funnel[0].n) * 100)) : 0}%` }} />
                </span>
                <strong className="funnel-n">{number(step.n)}</strong>
                <span className="funnel-rate">{i && before ? `${Math.round((step.n / before) * 100)} % de l'étape d'avant` : ""}</span>
              </li>
            );
          })}
        </ol>
        <p className="adm-note">
          Une fiche vue plusieurs fois compte plusieurs fois, et un même visiteur peut ajouter plusieurs produits : ce sont des ordres de
          grandeur, pas un suivi de chaque visiteur.
        </p>
      </section>

      <div className="adm-cols">
        <section className="adm-card" aria-labelledby="added-title">
          <h2 id="added-title">Produits ajoutés au panier</h2>
          <Ranking
            rows={added.map(([slug, n]) => ({ key: slug, label: productName(slug), n }))}
            empty="Aucun ajout au panier enregistré avec son produit sur la période."
          />
        </section>
        <section className="adm-card" aria-labelledby="events-title">
          <h2 id="events-title">Derniers événements</h2>
          {events.length ? (
            <ol className="adm-events">
              {events.map((ev) => (
                <li key={ev.key}>
                  <time>
                    {shortDay(ev.day)} {ev.t}
                  </time>
                  <span>{eventText(ev)}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="adm-empty">Les ajouts au panier, les paiements commencés et les PDF des outils gratuits apparaîtront ici.</p>
          )}
        </section>
      </div>

      <div className="adm-cols">
        <section className="adm-card" aria-labelledby="pages-title">
          <h2 id="pages-title">Pages les plus vues</h2>
          <Ranking rows={pages.map(([path, n]) => ({ key: path, label: path, n }))} empty="Aucune page vue sur la période." />
        </section>
        <section className="adm-card" aria-labelledby="ref-title">
          <h2 id="ref-title">Provenance des visites</h2>
          <Ranking
            rows={referrers.map(([host, n]) => ({ key: host, label: host === "direct" ? "Accès direct ou inconnu" : host, n }))}
            empty="Aucune visite sur la période."
          />
        </section>
      </div>

      <div className="adm-cols">
        <section className="adm-card" aria-labelledby="landings-title">
          <h2 id="landings-title">Pages d&apos;entrée</h2>
          <Ranking rows={landings.map(([path, n]) => ({ key: path, label: path, n }))} empty="Aucune visite sur la période." />
        </section>
        <div>
          <section className="adm-card" aria-labelledby="devices-title">
            <h2 id="devices-title">Appareils</h2>
            <Ranking
              rows={devices.map(([kind, n]) => ({ key: kind, label: DEVICE_LABEL[kind] ?? kind, n }))}
              empty="Aucune visite sur la période."
            />
          </section>
        </div>
      </div>

      <section className="adm-card" aria-labelledby="orders-title">
        <h2 id="orders-title">Dernières commandes</h2>
        {orders.length ? (
          <div className="adm-scroll">
            <table className="adm-table">
              <thead>
                <tr>
                  <th scope="col">Date</th>
                  <th scope="col">N°</th>
                  <th scope="col">Articles</th>
                  <th scope="col">Pays</th>
                  <th scope="col">Total TTC</th>
                  <th scope="col">Statut</th>
                  <th scope="col">Stripe</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 50).map((o) => (
                  <tr key={o.id}>
                    <td>{new Date(o.created).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Paris" })}</td>
                    <td>{orderNumber(o.id)}</td>
                    <td>
                      {o.items.length
                        ? o.items.map((i) => `${i.quantity} × ${getProduct(i.slug)?.name ?? i.name}`).join(", ")
                        : "Voir dans Stripe"}
                    </td>
                    <td>{o.country ?? "–"}</td>
                    <td>{formatPrice(o.amountTotal)}</td>
                    <td>
                      <span className={`adm-status adm-status-${o.status}`}>{STATUS_LABEL[o.status]}</span>
                    </td>
                    <td>
                      {o.paymentIntent ? (
                        <a href={`https://dashboard.stripe.com/${o.livemode ? "" : "test/"}payments/${o.paymentIntent}`} target="_blank" rel="noreferrer">
                          Ouvrir
                        </a>
                      ) : (
                        "–"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="adm-empty">Aucune commande pour l&apos;instant. Le nom et l&apos;adresse des clients restent dans Stripe.</p>
        )}
      </section>

      <section className="adm-card" aria-labelledby="withdrawals-title">
        <h2 id="withdrawals-title">Rétractations</h2>
        {withdrawals.length ? (
          <div className="adm-scroll">
            <table className="adm-table">
              <thead>
                <tr>
                  <th scope="col">Reçue le</th>
                  <th scope="col">Référence</th>
                  <th scope="col">Commande</th>
                  <th scope="col">Client</th>
                  <th scope="col">Produits</th>
                  <th scope="col">Accusé</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.slice(0, 50).map((w) => (
                  <tr key={w.id}>
                    <td>{new Date(w.at).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Paris" })}</td>
                    <td>{w.id}</td>
                    <td>{w.order}</td>
                    <td>
                      {w.name}
                      <br />
                      <a href={`mailto:${w.email}`}>{w.email}</a>
                    </td>
                    <td>{w.items || "Toute la commande"}</td>
                    <td>{receipts.sent.has(w.id) ? "Envoyé" : "Non envoyé"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="adm-empty">Aucune rétractation. Les clients la déclarent sur la page « Renoncer au contrat ici » (/retractation).</p>
        )}
      </section>

      <section className="adm-card" aria-labelledby="config-title">
        <h2 id="config-title">Mise en ligne</h2>
        <ul className="adm-checks">
          {checks.map((c) => (
            <li key={c.label}>
              <span className={`adm-dot adm-dot-${c.ok}`} aria-hidden="true">
                {c.ok === "good" ? "✓" : "!"}
              </span>
              <strong>{c.label}</strong>
              <span>{c.detail}</span>
            </li>
          ))}
        </ul>
        <NoCount />
      </section>
    </div>
  );
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="adm-tile">
      <p>{label}</p>
      <strong>{value}</strong>
    </div>
  );
}

function Ranking({ rows, empty }: { rows: { key: string; label: string; n: number }[]; empty: string }) {
  if (!rows.length) return <p className="adm-empty">{empty}</p>;
  const max = rows[0].n;
  return (
    <ol className="rank">
      {rows.map((r) => (
        <li key={r.key}>
          <span className="rank-label">{r.label}</span>
          <span className="rank-n">{number(r.n)}</span>
          <span className="rank-bar" style={{ width: `${(r.n / max) * 100}%` }} aria-hidden="true" />
        </li>
      ))}
    </ol>
  );
}

/** A clean top for the axis: 1, 2, 5 or 10 times a power of ten, at least the peak. */
function niceMax(peak: number) {
  const power = 10 ** Math.floor(Math.log10(peak));
  for (const step of [1, 2, 5, 10]) if (step * power >= peak) return Math.max(2, step * power);
  return peak;
}
