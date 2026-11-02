import Image from "next/image";
import Link from "next/link";
import { CATEGORIES } from "@/content/categories";
import { GUIDE_MENU } from "@/content/menu";
import { SHOP } from "@/content/shop";
import { categoryPath, facetPath, facets } from "@/lib/catalogue";
import { getGuide } from "@/lib/guides";
import { LEGAL } from "@/lib/legal";
import { DOMAIN, url } from "@/lib/site";
import { CartButton } from "./cart-button";
import { Icon, type IconName, Logo } from "./icon";
import { MobileMenu } from "./mobile-menu";
import { NavLinks } from "./nav-links";

/** "06 49 58 76 58" and its tel: link, from the shop's international number. */
export const phone = SHOP.phone
  ? { label: SHOP.phone.replace(/^\+33\s?/, "0"), href: `tel:${SHOP.phone.replace(/[^\d+]/g, "")}` }
  : null;

/** Whether every delivery option of src/content/shop.ts is free (false while there is none). */
const freeDelivery = SHOP.shipping.length > 0 && SHOP.shipping.every((s) => s.amount === 0);

/** The promises of the top band and of the footer: only what is true for every order. */
const PROMISES: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "truck",
    title: freeDelivery ? "Livraison offerte" : "Livraison",
    text: freeDelivery ? `en ${SHOP.countryNames}` : `en ${SHOP.countryNames}, frais affichés avant de payer`,
  },
  { icon: "undo", title: "14 jours pour changer d'avis", text: "après réception, comme pour tout achat en ligne" },
  { icon: "lock", title: "Paiement sécurisé", text: "par carte, sur la page de Stripe" },
  { icon: "mail", title: "Une question ?", text: "écrivez-nous ou appelez-nous avant de commander" },
];

/** The links of the header's bar and of the phone chips: the categories, then the whole shop. */
const LINKS = [...CATEGORIES.map((c) => ({ name: c.name, path: categoryPath(c) })), { name: "Toute la boutique", path: "/boutique" }];

/** The search field of the header: a plain form, so it also works without JavaScript. */
function Search({ id }: { id: string }) {
  return (
    <form action="/recherche" method="get" className="hd-search" role="search">
      <label htmlFor={id} className="sr-only">
        Rechercher sur le site
      </label>
      <input id={id} type="search" name="q" placeholder="Rechercher un pommeau, une recharge…" autoComplete="off" />
      <button type="submit" aria-label="Rechercher">
        <Icon name="search" size={20} />
      </button>
    </form>
  );
}

/** The guide shown on the right of the "Guides d'achat" panel. */
const FEATURED_GUIDE = "";

/** The "Guides d'achat" panel: the guides by theme, one column each, and the featured guide with its picture. */
function GuideMenu() {
  const featured = getGuide(FEATURED_GUIDE);
  return (
    <div className="mega-grid">
      {GUIDE_MENU.map((g) => (
        <div key={g.title} className="mega-col">
          <p className="mega-title">{g.title}</p>
          <ul className="mega-links">
            {g.links.map((l) => (
              <li key={l.path}>
                <Link href={l.path}>
                  {l.name}
                  <Icon name="chevron" size={16} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
      {featured && (
        <Link href={`/guides/${featured.slug}`} className="mega-feature">
          {featured.image ? (
            <Image src={featured.image.src} alt={featured.image.alt} width={600} height={400} sizes="300px" />
          ) : (
            <span className="mega-feature-pic" aria-hidden="true">
              <Icon name="shower" size={44} />
            </span>
          )}
          <span className="mega-feature-kicker">À lire en premier</span>
          <strong>{featured.title}</strong>
          <span className="mega-all">
            Tous les guides <Icon name="arrow" size={16} />
          </span>
        </Link>
      )}
    </div>
  );
}

/** The phone menu's content: the shop, the guides by theme, and how to reach us. */
function PhoneMenu() {
  return (
    <div className="mmenu">
      <Search id="recherche-menu" />
      <p className="mmenu-title">Boutique</p>
      <ul className="mmenu-list">
        {LINKS.map((l) => (
          <li key={l.path}>
            <Link href={l.path}>
              {l.name} <Icon name="chevron" size={18} />
            </Link>
          </li>
        ))}
      </ul>
      <p className="mmenu-title">Guides</p>
      {GUIDE_MENU.map((g) => (
        <details key={g.title} className="mmenu-fold">
          <summary>
            {g.title} <Icon name="plus" size={18} />
          </summary>
          <ul>
            {g.links.map((l) => (
              <li key={l.path}>
                <Link href={l.path}>{l.name}</Link>
              </li>
            ))}
          </ul>
        </details>
      ))}
      <ul className="mmenu-list">
        <li>
          <Link href="/guides">
            Tous les guides <Icon name="chevron" size={18} />
          </Link>
        </li>
      </ul>
      <div className="mmenu-help">
        {phone && (
          <a href={phone.href}>
            <Icon name="call" size={18} /> {phone.label}
          </a>
        )}
        {SHOP.email && (
          <a href={`mailto:${SHOP.email}`}>
            <Icon name="mail" size={18} /> {SHOP.email}
          </a>
        )}
      </div>
    </div>
  );
}

export function Header() {
  return (
    <>
      <header className="hd">
        <div className="hd-row wrap">
          <MobileMenu>
            <PhoneMenu />
          </MobileMenu>
          <Link href="/" className="hd-logo" aria-label={`Accueil de ${DOMAIN}`}>
            <Logo />
          </Link>
          <Search id="recherche" />
          <nav className="hd-actions" aria-label="Raccourcis">
            <Link href="/guides" className="hd-act">
              <Icon name="book" size={22} />
              <span>Guides</span>
            </Link>
            <Link href="/contact" className="hd-act">
              <Icon name="chat" size={22} />
              <span>Contact</span>
            </Link>
            <CartButton />
          </nav>
        </div>
        {/* On a computer, the categories in a bar, and "Guides d'achat" opens a panel (on hover or keyboard focus). */}
        <nav className="hd-nav" aria-label="Rayons">
          <div className="wrap">
            <NavLinks links={LINKS} />
            {GUIDE_MENU.length > 0 && (
              <div className="hd-drop">
                <button type="button" className="hd-drop-btn" aria-haspopup="true">
                  Guides d&apos;achat <Icon name="chevron" size={16} className="hd-drop-chevron" />
                </button>
                <div className="mega">
                  <div className="mega-panel wrap">
                    <GuideMenu />
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>
      </header>
      {/* On phones, the categories scroll as chips under the header. */}
      <nav className="hd-chips" aria-label="Rayons">
        <NavLinks links={[...LINKS, { name: "Guides d'achat", path: "/guides" }]} />
      </nav>
      <div className="hd-promise">
        <ul className="wrap">
          {PROMISES.slice(0, 3).map((p) => (
            <li key={p.title}>
              <Icon name={p.icon} size={18} /> {p.icon === "truck" ? `${p.title} ${p.text.split(",")[0]}` : p.title}
            </li>
          ))}
          {phone && (
            <li>
              <Icon name="call" size={18} /> Une question ? <a href={phone.href}>{phone.label}</a>
            </li>
          )}
        </ul>
      </div>
    </>
  );
}

/** The four promises in a row: above the footer, and on pages that end without one. */
export function Promises() {
  return (
    <ul className="promises wrap">
      {PROMISES.map((p) => (
        <li key={p.title}>
          <span className="promises-icon">
            <Icon name={p.icon} size={22} />
          </span>
          <span>
            <strong>{p.title}</strong>
            {p.text}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function Footer() {
  const guideLinks = GUIDE_MENU.flatMap((g) => g.links).slice(0, 8);
  return (
    <footer className="ft">
      <Promises />
      <div className="ft-main">
        <div className="wrap ft-cols">
          <div className="ft-brand">
            <Logo />
            <p>
              Des pommeaux de douche filtrants, des filtres à visser et leurs recharges, présentés avec ce qu&apos;ils font vraiment.{" "}
              {SHOP.vatExempt ? "Prix en euros, TVA non applicable (art. 293 B du CGI)" : "Prix en euros toutes taxes comprises"} ;
              paiement par carte via Stripe.
            </p>
            <p className="ft-contact">
              {phone && (
                <a href={phone.href}>
                  <Icon name="call" size={18} /> {phone.label}
                </a>
              )}
              {SHOP.email && (
                <a href={`mailto:${SHOP.email}`}>
                  <Icon name="mail" size={18} /> {SHOP.email}
                </a>
              )}
            </p>
          </div>
          <div>
            <h2>Boutique</h2>
            <ul>
              {LINKS.map((l) => (
                <li key={l.path}>
                  <Link href={l.path}>{l.name}</Link>
                </li>
              ))}
              {facets().map((f) => (
                <li key={f.slug}>
                  <Link href={facetPath(f)}>{f.h1}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2>Guides d&apos;achat</h2>
            <ul>
              {guideLinks.map((l) => (
                <li key={l.path}>
                  <Link href={l.path}>{l.name}</Link>
                </li>
              ))}
              <li>
                <Link href="/guides">Tous les guides</Link>
              </li>
            </ul>
          </div>
          <div>
            <h2>Informations</h2>
            <ul>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
              <li>
                <Link href="/retractation">Renoncer au contrat ici</Link>
              </li>
              {LEGAL.map((l) => (
                <li key={l.slug}>
                  <Link href={`/${l.slug}`}>{l.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="wrap ft-legal">© 2026 {DOMAIN}</p>
      </div>
    </footer>
  );
}

export type Crumb = { name: string; path: string };

/** Visible breadcrumb and its BreadcrumbList. The last crumb is the current page. */
export function Breadcrumb({ items }: { items: Crumb[] }) {
  const all = [{ name: "Accueil", path: "/" }, ...items];
  return (
    <>
      <nav className="crumbs wrap" aria-label="Fil d'Ariane">
        <ol>
          {all.map((c, i) => (
            <li key={c.path}>
              {i < all.length - 1 ? <Link href={c.path}>{c.name}</Link> : <span aria-current="page">{c.name}</span>}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: all.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: url(c.path) })),
        }}
      />
    </>
  );
}

/** Structured data. `<` is escaped so that no text of the catalogue can close the script tag. */
export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
