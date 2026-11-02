import { formatDate } from "@/lib/format";
import { LEGAL, legalPage, type LegalSlug } from "@/lib/legal";
import { pageMeta } from "@/lib/seo";
import { Breadcrumb } from "./site";

export function legalMetadata(slug: LegalSlug) {
  const page = legalPage(slug);
  return pageMeta({ title: page.title, description: page.description, path: `/${slug}` });
}

export function LegalPage({ slug }: { slug: LegalSlug }) {
  const page = legalPage(slug);
  const name = LEGAL.find((l) => l.slug === slug)!.name;
  return (
    <>
      <Breadcrumb items={[{ name, path: `/${slug}` }]} />
      <article className="wrap legal">
        <h1>{page.title}</h1>
        <p className="meta">Mise à jour le {formatDate(page.updated)}</p>
        <div className="prose" dangerouslySetInnerHTML={{ __html: page.html }} />
      </article>
    </>
  );
}
