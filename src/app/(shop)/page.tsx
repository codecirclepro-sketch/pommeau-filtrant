import Image from "next/image";
import Link from "next/link";
import { GuideCard } from "@/components/guide-card";
import { Icon, type IconName } from "@/components/icon";
import { ProductGrid } from "@/components/product";
import { JsonLd } from "@/components/site";
import { products } from "@/lib/catalogue";
import { getGuide } from "@/lib/guides";
import { pageMeta } from "@/lib/seo";
import { BRAND, DOMAIN, SITE_URL, url } from "@/lib/site";
import { STORE_ID, storeLd } from "@/lib/structured";

export const metadata = pageMeta({
  title: "Pommeau filtrant : douche filtrée, vitamine C et recharges",
  description:
    "Pommeau filtrant pour la douche : des modèles à cartouche vitamine C, charbon ou billes, des filtres à visser et leurs recharges, avec ce qu'ils font vraiment.",
  path: "/",
});

// The search card of the banner: each choice opens a category.
const FINDER: { label: string; links: { icon: IconName; name: string; path: string }[] }[] = [
  {
    label: "Que voulez-vous changer ?",
    links: [
      { icon: "shower", name: "Mon pommeau", path: "/pommeau-de-douche-filtrant" },
      { icon: "filter", name: "Rien : j'ajoute un filtre", path: "/filtre-de-douche" },
    ],
  },
  {
    label: "Quelle filtration ?",
    links: [
      { icon: "citrus", name: "Vitamine C", path: "/pommeau-de-douche-vitamine-c" },
      { icon: "shield", name: "Contre le calcaire", path: "/pommeau-de-douche-anti-calcaire" },
    ],
  },
  {
    label: "Déjà équipé ?",
    links: [{ icon: "refill", name: "Les recharges", path: "/recharge-pommeau-de-douche-filtrant" }],
  },
];

// The tiles of the categories: real photos of products of the shop.
const TILES = [
  { name: "Pommeaux filtrants", path: "/pommeau-de-douche-filtrant", src: "/images/accueil/rayon-filtrant.jpg", alt: "Jet d'eau sortant d'un pommeau de douche transparent rempli de billes", width: 1000, height: 650 },
  { name: "Vitamine C", path: "/pommeau-de-douche-vitamine-c", src: "/images/accueil/rayon-vitamine-c.jpg", alt: "Pommeau de douche à poignée transparente avec sa cartouche vitamine C jaune et ses filtres", width: 1000, height: 700 },
  { name: "Filtres de douche", path: "/filtre-de-douche", src: "/images/accueil/rayon-filtre.jpg", alt: "Filtre de douche chromé vissé entre le bras de douche et la pomme", width: 800, height: 480 },
  { name: "Anti-calcaire", path: "/pommeau-de-douche-anti-calcaire", src: "/images/accueil/rayon-calcaire.jpg", alt: "Pommeau de douche blanc en fonctionnement sur une barre de douche", width: 810, height: 734 },
  { name: "Recharges", path: "/recharge-pommeau-de-douche-filtrant", src: "/images/accueil/rayon-recharges.jpg", alt: "Trois cartouches de rechange pour pommeau de douche, rose, grise et jaune", width: 1000, height: 760 },
];

// The guides of the home page.
const GUIDES = ["pommeau-de-douche-filtrant-efficace", "pommeau-douche-vitamine-c-comment-ca-marche", "detartrer-pommeau-de-douche"];

const STEPS: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "shower",
    title: "Vous le vissez à la main",
    text: "Il remplace l'ancien sur le flexible, grâce au raccord 1/2 pouce standard en France. Pas d'outil, pas de plombier.",
  },
  {
    icon: "filter",
    title: "L'eau traverse la cartouche",
    text: "Vitamine C, charbon actif ou billes, selon les modèles : la cartouche retient une partie du chlore et des particules au passage.",
  },
  {
    icon: "refill",
    title: "Vous changez la recharge",
    text: "Tous les deux à six mois selon les modèles, ou quand le débit baisse. La poignée se dévisse en quelques secondes.",
  },
];

const QUESTIONS = [
  {
    q: "Qu'est-ce qu'un pommeau filtrant ?",
    a: "C'est un pommeau de douche dont la poignée contient une cartouche : l'eau la traverse avant de sortir. Selon les matériaux, elle retient une partie du chlore de l'eau du robinet et les petites particules.",
  },
  {
    q: "Enlève-t-il le calcaire ?",
    a: "Non. Le calcaire est dissous dans l'eau, et seul un adoucisseur installé à l'arrivée d'eau le retire. Un pommeau peut en revanche se démonter et se détartrer facilement.",
  },
  {
    q: "Quand faut-il changer la cartouche ?",
    a: "Les fabricants annoncent de deux à six mois selon les modèles, et la durée réelle dépend de votre eau et du nombre de douches. Un débit qui baisse ou une odeur de chlore qui revient sont de bons signaux.",
  },
  {
    q: "Va-t-il s'adapter à ma douche ?",
    a: "Nos pommeaux se vissent sur les flexibles au filetage 1/2 pouce, standard en France. Les filtres à visser se placent avant votre pommeau, sur le bras de douche ou au bout du flexible.",
  },
  {
    q: "La pression va-t-elle baisser ?",
    a: "Une cartouche freine toujours un peu l'eau. Avec une pression normale, la différence se sent peu ; avec une pression faible, préférez un modèle à buses fines, et changez la cartouche à temps.",
  },
];

export default function HomePage() {
  const all = products();
  const featured = GUIDES.map(getGuide).filter((g) => g !== undefined);
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebSite",
              "@id": `${SITE_URL}/#site`,
              name: DOMAIN,
              alternateName: BRAND,
              url: url("/"),
              inLanguage: "fr-FR",
              publisher: { "@id": STORE_ID },
            },
            storeLd(),
            {
              "@type": "FAQPage",
              mainEntity: QUESTIONS.map((x) => ({ "@type": "Question", name: x.q, acceptedAnswer: { "@type": "Answer", text: x.a } })),
            },
          ],
        }}
      />

      <section className="hm-hero">
        <Image
          src="/images/accueil/banniere.jpg"
          alt="Une femme se rince l'épaule avec un pommeau de douche filtrant gris anthracite à tête ovale"
          width={1000}
          height={1000}
          sizes="(max-width: 900px) 100vw, 70vw"
          className="hm-hero-photo"
          priority
        />
        <div className="wrap hm-hero-in">
          <div className="hm-find">
            <h1>Le pommeau filtrant qui se visse sur votre douche</h1>
            <p className="hm-find-lead">
              Une cartouche dans la poignée retient une partie du chlore de l&apos;eau du robinet. Nos modèles, leurs recharges, et ce
              qu&apos;ils font vraiment.
            </p>
            {FINDER.map((group) => (
              <div key={group.label}>
                <p className="hm-find-label">{group.label}</p>
                <ul className="hm-find-chips">
                  {group.links.map((l) => (
                    <li key={l.path}>
                      <Link href={l.path}>
                        <Icon name={l.icon} size={18} /> {l.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <p className="hm-find-cta">
              <Link href="/boutique" className="btn btn-main btn-lg">
                Voir toute la boutique <Icon name="arrow" size={18} />
              </Link>
            </p>
          </div>
        </div>
      </section>

      <section className="wrap hm-block" aria-labelledby="produits">
        <div className="hm-head">
          <h2 id="produits" className="section-title">
            Nos pommeaux et filtres
          </h2>
          {all.length > 0 && (
            <Link href="/boutique" className="hm-more">
              Tout voir <Icon name="arrow" size={16} />
            </Link>
          )}
        </div>
        {all.length > 0 ? (
          <ProductGrid products={all.slice(0, 8)} />
        ) : (
          <div className="soon">
            <Icon name="shower" size={30} />
            <div>
              <p className="soon-title">Les premiers modèles arrivent très bientôt.</p>
            </div>
          </div>
        )}
      </section>

      <section className="wrap hm-block" aria-labelledby="choisir">
        <h2 id="choisir" className="section-title">
          Choisir son pommeau filtrant
        </h2>
        <div className="hm-about">
          <p>
            Un pommeau filtrant ne transforme pas l&apos;eau du robinet en eau de source : il retient une partie du chlore, ajouté pour la
            désinfecter, et les petites particules. C&apos;est déjà beaucoup pour qui trouve l&apos;eau de sa douche très chlorée.
          </p>
          <p>
            Deux familles se partagent le rayon. Les <Link href="/pommeau-de-douche-vitamine-c">pommeaux à la vitamine C</Link> neutralisent
            le chlore par une réaction chimique et parfument souvent l&apos;eau. Les modèles au charbon actif ou à billes le retiennent par
            filtration. Si vous tenez à votre pommeau actuel, un <Link href="/filtre-de-douche">filtre à visser</Link> se place juste avant.
          </p>
          <p>
            Pensez enfin aux <Link href="/recharge-pommeau-de-douche-filtrant">recharges</Link> : une cartouche dure de deux à six mois selon
            les modèles, et son prix compte au moins autant que celui du pommeau.
          </p>
        </div>
      </section>

      <section className="wrap hm-block" aria-labelledby="rayons">
        <h2 id="rayons" className="section-title">
          Nos rayons
        </h2>
        <div className="hm-tiles">
          {TILES.map((t) => (
            <Link key={t.path} href={t.path} className="hm-tile">
              <Image src={t.src} alt={t.alt} width={t.width} height={t.height} sizes="(max-width: 900px) 50vw, 620px" />
              <span className="hm-tile-name">{t.name}</span>
              <span className="hm-tile-more">Voir plus</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="hm-band" id="fonctionnement" aria-labelledby="fonctionnement-titre">
        <div className="wrap hm-band-in">
          <div>
            <h2 id="fonctionnement-titre">Comment fonctionne un pommeau filtrant ?</h2>
            <p className="hm-band-lead">Rien de compliqué : une cartouche, un filetage standard et un peu d&apos;entretien.</p>
          </div>
          <ol className="hm-steps">
            {STEPS.map((s) => (
              <li key={s.title}>
                <Icon name={s.icon} size={34} className="hm-step-icon" />
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="wrap hm-block hm-split" aria-labelledby="calcaire">
        <Image
          src="/produits/pommeau-douche-filtrant-billes/1.jpg"
          alt="Pommeau de douche transparent rempli de billes, vu de face et en fonctionnement"
          width={1000}
          height={1000}
          sizes="(max-width: 900px) 100vw, 460px"
          className="hm-split-photo"
        />
        <div className="hm-split-text">
          <p className="eyebrow">Parlons franchement</p>
          <h2 id="calcaire">Et le calcaire ?</h2>
          <p>
            Aucun pommeau ne retire le calcaire dissous dans l&apos;eau : seul un adoucisseur le fait. Ce qu&apos;un bon pommeau peut faire,
            c&apos;est se démonter à la main et se détartrer en quelques minutes.
          </p>
          <p className="hm-split-links">
            <Link href="/pommeau-de-douche-anti-calcaire" className="btn btn-main">
              Ce qui marche contre le calcaire
            </Link>
            <Link href="/pommeau-de-douche-filtrant" className="btn btn-ghost">
              Tous les pommeaux
            </Link>
          </p>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="wrap hm-block" aria-labelledby="guides">
          <div className="hm-head">
            <h2 id="guides" className="section-title">
              Bien choisir
            </h2>
            <Link href="/guides" className="hm-more">
              Tous les guides <Icon name="arrow" size={16} />
            </Link>
          </div>
          <div className="guide-cards">
            {featured.map((g) => (
              <GuideCard key={g.slug} guide={g} meta={`${g.minutes} min de lecture`} />
            ))}
          </div>
        </section>
      )}

      <section className="wrap hm-block hm-faq" aria-labelledby="questions">
        <h2 id="questions" className="section-title">
          Tout savoir sur le pommeau filtrant
        </h2>
        <div className="faq">
          {QUESTIONS.map((x, i) => (
            <details key={x.q} open={i === 0}>
              <summary>
                <span>{x.q}</span>
                <Icon name="plus" size={20} />
              </summary>
              <p>{x.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
