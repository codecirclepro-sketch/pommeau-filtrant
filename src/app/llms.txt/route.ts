import { CATEGORIES } from "@/content/categories";
import { categoryPath, facetPath, facets, formatPrice, productPath, products } from "@/lib/catalogue";
import { guides } from "@/lib/guides";
import { LEGAL } from "@/lib/legal";
import { TOOLS } from "@/lib/routes";
import { DOMAIN, url } from "@/lib/site";

export const dynamic = "force-static";

/** Map of the site for AI assistants (llmstxt.org format). */
export function GET() {
  const published = products().filter((p) => !p.draft);
  const lines = [
    `# ${DOMAIN}`,
    "",
    "> Boutique en ligne française de pommeaux de douche filtrants, de filtres de douche et de leurs recharges, présentés avec ce qu'ils font vraiment. Prix en euros, paiement par Stripe.",
    "",
    "## Rayons",
    ...CATEGORIES.map((c) => `- [${c.h1}](${url(categoryPath(c))}): ${c.description}`),
    "",
    "## Boutique par filtre",
    `- [Toute la boutique](${url("/boutique")})`,
    ...facets().map((f) => `- [${f.h1}](${url(facetPath(f))}): ${f.description}`),
    "",
    ...(published.length
      ? ["## Produits", ...published.map((p) => `- [${p.name}](${url(productPath(p))}): ${p.brand ? `${p.brand}, ` : ""}${formatPrice(p.price)}. ${p.summary}`), ""]
      : []),
    ...(TOOLS.length ? ["## Outils gratuits", ...TOOLS.map((t) => `- [${t.name}](${url(t.path)}): ${t.description}`), ""] : []),
    "## Guides",
    ...guides().map((g) => `- [${g.title}](${url(`/guides/${g.slug}`)}): ${g.description}`),
    "",
    "## Informations",
    `- [Contact](${url("/contact")})`,
    ...LEGAL.map((l) => `- [${l.name}](${url(`/${l.slug}`)})`),
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
