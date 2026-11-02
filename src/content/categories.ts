import type { Category } from "./types";

// The category pages, in menu order. A category without a published product stays out of the index and the
// sitemap (see src/lib/catalogue.ts): an empty shop page is thin content.
export const CATEGORIES: Category[] = [
  {
    slug: "pommeau-de-douche-filtrant",
    name: "Pommeaux filtrants",
    icon: "shower",
    teaser: "Tous nos pommeaux à cartouche, du modèle simple au design vitamine C.",
    keyword: "pommeau de douche filtrant",
    title: "Pommeau de douche filtrant : tous nos modèles",
    description:
      "Pommeau de douche filtrant : des pommeaux à cartouche qui retiennent une partie du chlore et des impuretés de l'eau du robinet, avec leurs recharges.",
    h1: "Pommeau de douche filtrant",
    filters: [{ key: "technologie", label: "Filtration", all: "Toutes" }],
    intro:
      "Un pommeau de douche filtrant cache une cartouche dans sa poignée : l'eau la traverse avant de sortir. Vitamine C, charbon actif ou billes, voici tous nos modèles, avec ce que chaque fabricant annonce et ce qu'il faut en attendre vraiment.",
    sections: [
      {
        h2: "Ce que filtre vraiment un pommeau",
        body: [
          "La plupart des cartouches visent le chlore, ajouté à l'eau du robinet pour la désinfecter, et les petites particules. Elles ne rendent pas l'eau douce : le calcaire dissous passe à travers.",
        ],
      },
      {
        h2: "Vitamine C, charbon ou billes ?",
        body: [
          "La vitamine C réagit avec le chlore et parfume souvent l'eau. Le charbon actif et le KDF le retiennent aussi, chacun à sa façon. Les billes minérales font beaucoup parler d'elles, mais leurs vertus restent à démontrer.",
        ],
      },
      {
        h2: "Le coût des recharges",
        body: [
          "Une cartouche s'use : comptez de deux à six mois selon les modèles, votre eau et votre usage. Avant de choisir, regardez le prix et la disponibilité des recharges, qui pèsent plus que le pommeau au fil des années.",
        ],
      },
    ],
    guides: ["pommeau-de-douche-filtrant-efficace", "installer-filtre-de-douche", "changer-cartouche-pommeau-filtrant"],
  },
  {
    slug: "pommeau-de-douche-vitamine-c",
    name: "Vitamine C",
    icon: "citrus",
    teaser: "Des pommeaux à cartouche vitamine C, souvent parfumée.",
    keyword: "pommeau de douche vitamine C",
    title: "Pommeau de douche vitamine C : modèles et recharges",
    description:
      "Pommeau de douche vitamine C : des pommeaux filtrants dont la cartouche à la vitamine C réagit avec le chlore de l'eau, souvent parfumée, et leurs recharges.",
    h1: "Pommeau de douche vitamine C",
    intro:
      "Dans un pommeau de douche vitamine C, l'eau traverse une cartouche contenant de l'acide ascorbique, qui réagit avec le chlore. Beaucoup de modèles y ajoutent un parfum léger, citron le plus souvent. Voici nos modèles et leurs cartouches de rechange.",
    sections: [
      {
        h2: "Comment agit la vitamine C",
        body: [
          "L'acide ascorbique neutralise le chlore libre par une réaction chimique, même dans l'eau chaude. La cartouche s'épuise à mesure qu'elle travaille : c'est pourquoi les fabricants parlent en semaines ou en mois.",
        ],
      },
      {
        h2: "Ce qu'elle ne fait pas",
        body: [
          "Elle n'adoucit pas l'eau et ne retient pas le calcaire. Méfiez-vous aussi des promesses sur la peau ou les cheveux : nous ne les reprenons pas, faute de preuve solide.",
        ],
      },
      {
        h2: "Penser aux recharges",
        body: [
          "Avec une cartouche qui dure environ deux mois chez certains fabricants, le prix des recharges compte autant que celui du pommeau. Chaque modèle de ce rayon a les siennes dans notre boutique.",
        ],
      },
    ],
    guides: ["pommeau-douche-vitamine-c-comment-ca-marche", "changer-cartouche-pommeau-filtrant"],
  },
  {
    slug: "filtre-de-douche",
    name: "Filtres de douche",
    icon: "filter",
    teaser: "Un filtre à visser avant votre pommeau, pour le garder.",
    keyword: "filtre de douche",
    title: "Filtre de douche à visser : gardez votre pommeau",
    description:
      "Filtre de douche à visser sur le bras de douche ou le flexible : une cartouche multicouche contre le chlore, sans changer de pommeau, et ses recharges.",
    h1: "Filtre de douche",
    intro:
      "Un filtre de douche se visse avant votre pommeau, sur le bras de la douche de tête ou au bout du flexible. Il accueille une cartouche plus grosse que celle d'un pommeau filtrant, et vous laisse garder la douchette ou la pomme que vous aimez.",
    sections: [
      {
        h2: "Où l'installer",
        body: [
          "Sur une douche de tête, il se place entre le bras et la pomme. Sur une douche à main, entre le flexible et la douchette. Un ruban téflon assure l'étanchéité du filetage, et l'opération se fait à la main.",
        ],
      },
      {
        h2: "Ce que contient la cartouche",
        body: [
          "Les fabricants empilent des couches de matériaux : KDF, charbon actif, sulfite de calcium, billes diverses. Le nombre d'étages annoncé dit peu de choses en soi : regardez surtout les matériaux employés contre le chlore.",
        ],
      },
      {
        h2: "Le débit",
        body: [
          "Toute cartouche freine un peu l'eau. Avec une bonne pression, la différence se sent à peine ; avec une pression faible, préférez un pommeau filtrant dont les buses compensent.",
        ],
      },
    ],
    guides: ["installer-filtre-de-douche", "pommeau-de-douche-filtrant-efficace"],
  },
  {
    slug: "pommeau-de-douche-anti-calcaire",
    name: "Anti-calcaire",
    icon: "shield",
    teaser: "Ce qu'un pommeau peut faire contre le calcaire, et ce qu'il ne fait pas.",
    keyword: "pommeau de douche anti calcaire",
    title: "Pommeau de douche anti calcaire : ce qui marche vraiment",
    description:
      "Pommeau de douche anti calcaire : ce qu'un pommeau peut faire contre le tartre (buses faciles à nettoyer, tête démontable) et ce qu'il ne fera jamais.",
    h1: "Pommeau de douche anti calcaire",
    intro:
      "Disons-le tout de suite : aucun pommeau ne retire le calcaire dissous dans l'eau, seul un adoucisseur le fait. Un pommeau peut en revanche mieux résister au tartre et se nettoyer plus facilement. Voici les modèles qui s'y prêtent le mieux.",
    sections: [
      {
        h2: "Pourquoi le calcaire passe",
        body: [
          "Le calcaire est dissous dans l'eau, sous forme d'ions calcium et magnésium. Les cartouches des pommeaux, conçues contre le chlore et les particules, ne les retiennent pas.",
        ],
      },
      {
        h2: "Ce qui aide vraiment",
        body: [
          "Une tête qui se démonte à la main, pour tremper les buses dans du vinaigre blanc. Des buses souples, que l'on frotte du doigt pour les déboucher. Et un filtre qui retient les particules avant qu'elles n'encrassent les trous.",
        ],
      },
      {
        h2: "Si votre eau est très dure",
        body: [
          "Dans une région très calcaire, la vraie solution se trouve à l'arrivée d'eau : un adoucisseur, à faire poser par un plombier. Un pommeau filtrant reste alors un complément pour le chlore.",
        ],
      },
    ],
    guides: ["detartrer-pommeau-de-douche", "pommeau-de-douche-filtrant-efficace"],
  },
  {
    slug: "recharge-pommeau-de-douche-filtrant",
    name: "Recharges",
    icon: "refill",
    teaser: "Les cartouches de rechange de chacun de nos pommeaux et filtres.",
    keyword: "recharge pommeau de douche filtrant",
    title: "Recharge pommeau de douche filtrant : nos cartouches",
    description:
      "Recharge pommeau de douche filtrant : les cartouches de rechange vitamine C et multicouches de nos modèles, avec la durée annoncée par chaque fabricant.",
    h1: "Recharge pommeau de douche filtrant",
    intro:
      "Une cartouche filtrante s'use : passé quelques mois, elle ne retient plus grand-chose et peut même freiner le débit. Voici les recharges de nos pommeaux et filtres, chacune prévue pour un modèle précis.",
    sections: [
      {
        h2: "Quand changer la cartouche",
        body: [
          "Suivez d'abord la durée du fabricant, de deux à six mois selon les modèles. Un parfum qui s'estompe, une odeur de chlore qui revient ou un débit qui baisse sont aussi de bons signaux.",
        ],
      },
      {
        h2: "Prendre la bonne recharge",
        body: [
          "Les cartouches ne sont pas universelles : chacune a sa forme et sa taille. Chaque fiche de ce rayon indique le pommeau ou le filtre avec lequel elle fonctionne.",
        ],
      },
      {
        h2: "Changer la cartouche",
        body: [
          "Fermez l'eau, dévissez la poignée ou le boîtier à la main, remplacez la cartouche et revissez. Laissez ensuite couler l'eau quelques secondes avant la première douche.",
        ],
      },
    ],
    guides: ["changer-cartouche-pommeau-filtrant", "pommeau-douche-vitamine-c-comment-ca-marche"],
  },
];
