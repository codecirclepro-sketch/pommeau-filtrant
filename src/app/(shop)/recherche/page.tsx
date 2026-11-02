import Link from "next/link";
import { GuideCard } from "@/components/guide-card";
import { Icon } from "@/components/icon";
import { ProductGrid } from "@/components/product";
import { CATEGORIES } from "@/content/categories";
import { categoryPath, products } from "@/lib/catalogue";
import { guides } from "@/lib/guides";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Recherche",
  description: "Rechercher un pommeau, une recharge ou un guide sur le site.",
  path: "/recherche",
  index: false,
});

/** Lower case, without accents or punctuation: "Pommeau filtrant vitamine C" and "pommeau filtrant vitamine c" match. */
const fold = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ");

/** Whether every word of the query appears in the text. */
const matches = (words: string[], ...texts: string[]) => {
  const hay = fold(texts.join(" "));
  return words.every((w) => hay.includes(w));
};

/** The header's search: products, categories and guides whose texts hold every word typed. Read on each request. */
export default async function SearchPage({ searchParams }: PageProps<"/recherche">) {
  const raw = (await searchParams).q;
  const q = (Array.isArray(raw) ? raw[0] : raw ?? "").slice(0, 80).trim();
  const words = fold(q).split(" ").filter((w) => w.length > 1);
  const found = words.length
    ? {
        products: products().filter((p) => matches(words, p.name, p.brand, p.summary, p.body, ...p.specs.map((s) => s.value))),
        categories: CATEGORIES.filter((c) => matches(words, c.name, c.h1, c.intro)),
        guides: guides().filter((g) => matches(words, g.title, g.description)),
      }
    : { products: [], categories: [], guides: [] };
  const total = found.products.length + found.categories.length + found.guides.length;

  return (
    <>
      <header className="page-head wrap">
        <p className="eyebrow">Recherche</p>
        <h1>{q ? `Résultats pour « ${q} »` : "Rechercher sur le site"}</h1>
        <form action="/recherche" method="get" className="hd-search search-page" role="search">
          <label htmlFor="recherche-page" className="sr-only">
            Rechercher
          </label>
          <input id="recherche-page" type="search" name="q" defaultValue={q} placeholder="Un pommeau, une recharge…" />
          <button type="submit" aria-label="Rechercher">
            <Icon name="search" size={20} />
          </button>
        </form>
        {q && <p className="page-count">{total ? `${total} résultat${total > 1 ? "s" : ""}` : "Aucun résultat"}</p>}
      </header>

      {found.products.length > 0 && (
        <section className="wrap band-tight" aria-labelledby="r-produits">
          <h2 id="r-produits" className="section-title">
            Produits
          </h2>
          <ProductGrid products={found.products} />
        </section>
      )}

      {found.categories.length > 0 && (
        <section className="wrap band-tight" aria-labelledby="r-rayons">
          <h2 id="r-rayons" className="section-title">
            Rayons
          </h2>
          <ul className="hm-chips">
            {found.categories.map((c) => (
              <li key={c.slug}>
                <Link href={categoryPath(c)} className="hm-chip">
                  <span className="hm-chip-icon">
                    <Icon name={c.icon} size={26} />
                  </span>
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {found.guides.length > 0 && (
        <section className="wrap band-tight" aria-labelledby="r-guides">
          <h2 id="r-guides" className="section-title">
            Guides
          </h2>
          <div className="guide-cards">
            {found.guides.map((g) => (
              <GuideCard key={g.slug} guide={g} meta={`${g.minutes} min de lecture`} />
            ))}
          </div>
        </section>
      )}

      {q && !total && (
        <div className="wrap band-tight">
          <div className="soon">
            <Icon name="search" size={28} />
            <div>
              <p className="soon-title">Rien ne correspond à cette recherche.</p>
              <p>
                Essayez un mot plus court, parcourez <Link href="/boutique">toute la boutique</Link> ou{" "}
                <Link href="/contact">posez-nous la question</Link>.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
