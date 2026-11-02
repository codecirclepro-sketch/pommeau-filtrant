import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/icon";
import { Breadcrumb, JsonLd } from "@/components/site";
import { categoryPath, getCategory } from "@/lib/catalogue";
import { formatDate } from "@/lib/format";
import { getGuide, guides } from "@/lib/guides";
import { pageMeta } from "@/lib/seo";
import { DOMAIN, url } from "@/lib/site";
import { STORE_ID } from "@/lib/structured";

export const dynamicParams = false;

export const generateStaticParams = () => guides().map((g) => ({ slug: g.slug }));

export async function generateMetadata({ params }: PageProps<"/guides/[slug]">) {
  const guide = getGuide((await params).slug);
  if (!guide) return {};
  return pageMeta({
    title: guide.title,
    description: guide.description,
    path: `/guides/${guide.slug}`,
    type: "article",
    image: guide.image && { url: guide.image.src, width: guide.image.width, height: guide.image.height, alt: guide.image.alt },
  });
}

export default async function GuidePage({ params }: PageProps<"/guides/[slug]">) {
  const guide = getGuide((await params).slug);
  if (!guide) notFound();
  const category = getCategory(guide.category);
  const others = guides().filter((g) => g.slug !== guide.slug);

  return (
    <>
      <Breadcrumb
        items={[
          { name: "Guides d'achat", path: "/guides" },
          { name: guide.title, path: `/guides/${guide.slug}` },
        ]}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: guide.title,
          description: guide.description,
          datePublished: guide.date,
          dateModified: guide.updated,
          inLanguage: "fr-FR",
          mainEntityOfPage: url(`/guides/${guide.slug}`),
          image: url(guide.image?.src ?? "/opengraph-image"),
          author: { "@type": "OnlineStore", "@id": STORE_ID, name: DOMAIN, url: url("/") },
          publisher: { "@type": "OnlineStore", "@id": STORE_ID, name: DOMAIN, url: url("/") },
        }}
      />
      <header className="page-head wrap guide-head">
        <p className="kicker">Guide d&apos;achat</p>
        <h1>{guide.title}</h1>
        <p className="lead">{guide.description}</p>
        <p className="meta">
          Mis à jour le {formatDate(guide.updated)} · {guide.minutes} min de lecture
        </p>
      </header>
      {guide.image && (
        <figure className="wrap guide-hero">
          <Image
            src={guide.image.src}
            alt={guide.image.alt}
            width={guide.image.width}
            height={guide.image.height}
            sizes="(max-width: 1240px) 100vw, 1184px"
            loading="eager"
            fetchPriority="high"
          />
        </figure>
      )}
      <div className="wrap split">
        <article className="prose guide-body">
          {guide.headings.length > 2 && (
            <nav className="toc" aria-label="Sommaire">
              <p>Sommaire</p>
              <ul>
                {guide.headings.map((h) => (
                  <li key={h.id}>
                    <a href={`#${h.id}`}>{h.text}</a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
          <div dangerouslySetInnerHTML={{ __html: guide.html }} />
        </article>
        <aside className="side">
          {category && (
            <Link href={categoryPath(category)} className="side-cta">
              <span>Le rayon</span>
              <strong>{category.name}</strong>
              <Icon name="arrow" size={18} />
            </Link>
          )}
          <div className="side-box">
            <h2>Autres guides</h2>
            <ul>
              {others.map((g) => (
                <li key={g.slug}>
                  <Link href={`/guides/${g.slug}`}>{g.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </>
  );
}
