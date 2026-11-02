import { notFound } from "next/navigation";
import { ShopPage } from "@/components/shop-page";
import { facetPath, facets, getFacet } from "@/lib/catalogue";
import { pageMeta } from "@/lib/seo";

// Only the published pages of src/content/facets.ts exist: any other address is a real 404.
export const dynamicParams = false;

export const generateStaticParams = () => facets().map((f) => ({ facette: f.slug }));

export async function generateMetadata({ params }: PageProps<"/boutique/[facette]">) {
  const facet = getFacet((await params).facette);
  if (!facet) return {};
  return pageMeta({ title: facet.title, description: facet.description, path: facetPath(facet) });
}

export default async function FacetPage({ params }: PageProps<"/boutique/[facette]">) {
  const facet = getFacet((await params).facette);
  if (!facet) notFound();
  return <ShopPage facet={facet} />;
}
