import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/icon";
import { FilteredGrid } from "@/components/filtered-grid";
import { gridItems, ProductGrid } from "@/components/product";
import { Breadcrumb, JsonLd } from "@/components/site";
import { CATEGORIES } from "@/content/categories";
import { categoryIndexable, categoryPath, categoryProducts, getCategory, productPath } from "@/lib/catalogue";
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

export default async function CategoryPage({ params }: PageProps<"/[categorie]">) {
  const category = getCategory((await params).categorie);
  if (!category) notFound();
  const list = categoryProducts(category.slug);
  const guides = category.guides.map(getGuide).filter((g) => g !== undefined);
  const others = CATEGORIES.filter((c) => c.slug !== category.slug);

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

      <div className="wrap split">
        <article className="prose">
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
    </>
  );
}
