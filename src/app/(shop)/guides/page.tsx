import { GuideCard } from "@/components/guide-card";
import { Icon } from "@/components/icon";
import { Breadcrumb } from "@/components/site";
import { getCategory } from "@/lib/catalogue";
import { guides } from "@/lib/guides";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Guides : bien choisir son pommeau de douche filtrant",
  description:
    "Nos guides pour choisir un pommeau de douche filtrant : chlore, calcaire, vitamine C, recharges, installation et entretien.",
  path: "/guides",
});

export default function GuidesPage() {
  const list = guides();
  return (
    <>
      <Breadcrumb items={[{ name: "Guides d'achat", path: "/guides" }]} />
      <header className="page-head wrap">
        <h1>Guides d&apos;achat</h1>
        <p className="lead">
          Des explications concrètes pour choisir un pommeau filtrant, l&apos;installer et l&apos;entretenir, sans promesses en l&apos;air.
        </p>
      </header>
      {list.length > 0 ? (
        <div className="wrap guide-cards band-tight">
          {list.map((g) => {
            const category = getCategory(g.category);
            return (
              <GuideCard key={g.slug} guide={g} meta={`${g.minutes} min de lecture${category ? ` · ${category.name}` : ""}`} />
            );
          })}
        </div>
      ) : (
        <div className="wrap band-tight">
          <div className="soon">
            <Icon name="book" size={30} />
            <div>
              <p className="soon-title">Nos premiers guides arrivent très bientôt.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
