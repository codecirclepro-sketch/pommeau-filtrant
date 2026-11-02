import Link from "next/link";
import { BOUTIQUE, FACET_GROUPS } from "@/content/facets";
import { CATEGORIES } from "@/content/categories";
import type { Facet } from "@/content/types";
import { categoryPath, categoryProducts, facetPath, facetProducts, facets, productPath, products } from "@/lib/catalogue";
import { getGuide } from "@/lib/guides";
import { url } from "@/lib/site";
import { FilteredGrid } from "./filtered-grid";
import { Icon } from "./icon";
import { gridItems } from "./product";
import { Breadcrumb, JsonLd } from "./site";

const groupOf = (f: Facet) => FACET_GROUPS.find((g) => g.key === f.key)!;

/**
 * The shop, /boutique, and its pages for one filter, /boutique/<facet>. The filter column is made of links: each
 * choice opens its own indexable page, with its own title, text and products.
 */
export function ShopPage({ facet }: { facet?: Facet }) {
  const page = facet ?? BOUTIQUE;
  const path = facet ? facetPath(facet) : "/boutique";
  const list = facet ? facetProducts(facet) : products();
  const published = facets();
  const guides = page.guides.map(getGuide).filter((g) => g !== undefined);
  const neighbours = facet ? published.filter((f) => f.slug !== facet.slug && groupOf(f).family === groupOf(facet).family) : [];

  return (
    <>
      <Breadcrumb items={[{ name: "Boutique", path: "/boutique" }, ...(facet ? [{ name: facet.h1, path }] : [])]} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: page.h1,
          description: page.description,
          url: url(path),
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: list.length,
            itemListElement: list.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: url(productPath(p)), name: p.name })),
          },
        }}
      />

      <header className="page-head wrap shop-head">
        <p className="eyebrow">{facet ? `Boutique · ${groupOf(facet).family}` : "Boutique"}</p>
        <h1>{page.h1}</h1>
        <p className="lead">{page.intro}</p>
      </header>

      <div className="wrap shop">
        <aside className="shop-side" aria-label="Filtres de la boutique">
          <div className="shop-group">
            <p className="shop-group-title">Tout voir</p>
            <ul>
              <li>
                <Link href="/boutique" className="shop-facet" aria-current={facet ? undefined : "page"}>
                  Tous les produits <span className="shop-n">{products().length}</span>
                </Link>
              </li>
            </ul>
          </div>
          {FACET_GROUPS.map((g) => {
            const links = published.filter((f) => f.key === g.key);
            if (!links.length) return null;
            return (
              <div key={g.key} className="shop-group">
                <p className="shop-group-title">
                  {g.family} <span>· {g.label}</span>
                </p>
                <ul>
                  {links.map((f) => (
                    <li key={f.slug}>
                      <Link href={facetPath(f)} className="shop-facet" aria-current={facet?.slug === f.slug ? "page" : undefined}>
                        {f.name} <span className="shop-n">{facetProducts(f).length}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
          <div className="shop-group">
            <p className="shop-group-title">Rayons</p>
            <ul>
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link href={categoryPath(c)} className="shop-facet">
                    {c.name} <span className="shop-n">{categoryProducts(c.slug).length}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <section className="shop-main" aria-labelledby="produits">
          <h2 id="produits" className="sr-only">
            Les produits
          </h2>
          {facet && (
            <p className="shop-active">
              <span>Filtre actif</span>
              <Link href="/boutique" className="shop-active-chip" aria-label={`Retirer le filtre ${facet.name}`}>
                {groupOf(facet).label} : {facet.name} <Icon name="close" size={16} />
              </Link>
            </p>
          )}
          <FilteredGrid items={gridItems(list)} />
        </section>
      </div>

      <div className="wrap split">
        <article className="prose">
          {page.sections.map((s) => (
            <section key={s.h2}>
              <h2>{s.h2}</h2>
              {s.body.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
            </section>
          ))}
        </article>
        <aside className="side">
          {guides.length > 0 && (
            <div className="side-box">
              <h2>Guides</h2>
              <ul>
                {guides.map((g) => (
                  <li key={g.slug}>
                    <Link href={`/guides/${g.slug}`}>{g.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {neighbours.length > 0 && (
            <div className="side-box">
              <h2>Voir aussi</h2>
              <ul>
                {neighbours.map((f) => (
                  <li key={f.slug}>
                    <Link href={facetPath(f)}>{f.h1}</Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </>
  );
}
