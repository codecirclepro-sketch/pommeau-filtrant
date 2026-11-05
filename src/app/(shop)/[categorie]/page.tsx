import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/icon";
import { FilteredGrid } from "@/components/filtered-grid";
import { gridItems, ProductGrid } from "@/components/product";
import { Breadcrumb, JsonLd } from "@/components/site";
import { CATEGORIES } from "@/content/categories";
import type { Category, Product } from "@/content/types";
import {
  categoryIndexable,
  categoryPath,
  categoryProducts,
  formatPrice,
  getCategory,
  isRefill,
  productPath,
  refillFor,
} from "@/lib/catalogue";
import { getGuide } from "@/lib/guides";
import { pageMeta } from "@/lib/seo";
import { url } from "@/lib/site";

// Only the categories of src/content/categories.ts exist: any other first segment is a real 404.
export const dynamicParams = false;

export const generateStaticParams = () => CATEGORIES.map((c) => ({ categorie: c.slug }));

export async function generateMetadata({ params }: PageProps<"/[categorie]">) {
  const category = getCategory((await params).categorie);
  if (!category) return {};
  return pageMeta({
    title: category.title,
    description: category.description,
    path: categoryPath(category),
    index: categoryIndexable(category),
  });
}

/** One cell of the comparison table: the refill we sell, or the first spec the product has among the labels. */
function CompareCell({ product, column }: { product: Product; column: string }) {
  if (column === "recharge") {
    const refill = refillFor(product);
    return refill ? (
      <td>
        <Link href={productPath(refill)}>{refill.name}</Link>, {formatPrice(refill.price)}
      </td>
    ) : (
      <td className="compare-none">Pas encore en vente</td>
    );
  }
  const spec = column
    .split("|")
    .map((label) => product.specs.find((s) => s.label === label))
    .find((s) => s !== undefined);
  return spec ? <td>{spec.value}</td> : <td className="compare-none">Non précisé</td>;
}

/** The category's products side by side, on the columns of `compare`; nothing under two products. */
function CompareTable({ category, list }: { category: Category; list: Product[] }) {
  const columns = category.compare ?? [];
  const rows = columns.includes("recharge") ? list.filter((p) => !isRefill(p)) : list;
  if (!columns.length || rows.length < 2) return null;
  return (
    <section className="wrap compare" aria-labelledby="comparer">
      <h2 id="comparer" className="section-title">
        Comparer nos modèles
      </h2>
      <div className="compare-scroll">
        <table className="compare-table">
          <thead>
            <tr>
              <th scope="col">Modèle</th>
              {columns.map((c) => (
                <th key={c} scope="col">
                  {c === "recharge" ? "Recharge en vente" : c.split("|")[0]}
                </th>
              ))}
              <th scope="col">Prix</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.slug}>
                <th scope="row">
                  <Link href={productPath(p)}>{p.name}</Link>
                </th>
                {columns.map((c) => (
                  <CompareCell key={c} product={p} column={c} />
                ))}
                <td className="compare-price">{formatPrice(p.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="compare-note">Caractéristiques annoncées par chaque fabricant, prix TTC.</p>
    </section>
  );
}

export default async function CategoryPage({ params }: PageProps<"/[categorie]">) {
  const category = getCategory((await params).categorie);
  if (!category) notFound();
  const list = categoryProducts(category.slug);
  const guides = category.guides.map(getGuide).filter((g) => g !== undefined);
  const others = CATEGORIES.filter((c) => c.slug !== category.slug);
  const faq = category.faq ?? [];

  return (
    <>
      <Breadcrumb items={[{ name: category.name, path: categoryPath(category) }]} />
      {list.length > 0 && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: category.h1,
            itemListElement: list.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: url(productPath(p)), name: p.name })),
          }}
        />
      )}
      {faq.length > 0 && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faq.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
          }}
        />
      )}
      <header className="page-head wrap">
        <p className="eyebrow">Rayon</p>
        <h1>{category.h1}</h1>
        <p className="lead">{category.intro}</p>
        {list.length > 0 && !category.filters && (
          <p className="page-count">
            {list.length} produit{list.length > 1 ? "s" : ""}
          </p>
        )}
      </header>

      <section className="wrap band-tight" aria-labelledby="produits">
        <h2 id="produits" className="sr-only">
          Les produits du rayon
        </h2>
        {list.length > 0 && category.filters ? (
          <FilteredGrid filters={category.filters} items={gridItems(list)} />
        ) : list.length > 0 ? (
          <ProductGrid products={list} />
        ) : (
          <div className="soon">
            <Icon name="truck" size={28} />
            <div>
              <p className="soon-title">Les premiers produits de ce rayon arrivent.</p>
              <p>En attendant, les conseils ci-dessous et nos guides vous aident à préparer votre choix.</p>
            </div>
          </div>
        )}
      </section>

      <CompareTable category={category} list={list} />

      <div className="wrap split">
        <article className="prose">
          {category.image && (
            <figure className="cat-figure">
              <Image
                src={category.image.src}
                alt={category.image.alt}
                width={1200}
                height={800}
                sizes="(max-width: 900px) 100vw, 760px"
              />
            </figure>
          )}
          {category.sections.map((s) => (
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
          <div className="side-box">
            <h2>Autres rayons</h2>
            <ul>
              {others.map((c) => (
                <li key={c.slug}>
                  <Link href={categoryPath(c)}>{c.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      {faq.length > 0 && (
        <section className="wrap pdp-faq cat-faq" aria-labelledby="questions">
          <p className="eyebrow">FAQ</p>
          <h2 id="questions" className="section-title">
            Questions fréquentes
          </h2>
          <div className="faq">
            {faq.map((f, i) => (
              <details key={f.q} open={i === 0}>
                <summary>
                  <span>{f.q}</span>
                  <Icon name="plus" size={20} />
                </summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
