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
          "Aucune cartouche ne fait de l'eau de la douche une eau à boire, et aucune ne soigne la peau ni les cheveux. Ce que l'on peut en attendre, c'est une eau qui sent moins le chlore, si la cartouche est changée à temps.",
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
          "Le pommeau à billes et le pommeau trois jets n'ont pas encore de recharge dans notre boutique : une fois leur filtre épuisé, ils restent de bons pommeaux, mais ne filtrent plus.",
        ],
      },
    ],
    guides: ["pommeau-de-douche-filtrant-efficace", "installer-filtre-de-douche", "changer-cartouche-pommeau-filtrant"],
    image: {
      src: "/images/rayons/pommeau-de-douche-filtrant.jpg",
      alt: "Une douchette à poignée transparente, avec sa cartouche filtrante blanche, accrochée à son support mural dans une salle de bain carrelée de blanc",
    },
    compare: ["Filtration", "Raccord", "recharge"],
    faq: [
      {
        q: "Un pommeau filtrant s'adapte-t-il à ma douche ?",
        a: "Très probablement. Les pommeaux ALTHY, à billes et trois jets se vissent sur un flexible au filetage 15 × 21 (G1/2), le plus courant en France. Pour le pommeau design, le fabricant ne précise pas le filetage : écrivez-nous avant de commander si vous avez un doute.",
      },
      {
        q: "Faut-il des outils ou un plombier ?",
        a: "Non. On dévisse l'ancienne douchette à la main, on contrôle le joint plat au fond de l'écrou du flexible, puis on visse le pommeau filtrant à sa place. Comptez quelques minutes.",
      },
      {
        q: "Le débit sera-t-il plus faible ?",
        a: "Une cartouche oppose toujours un peu de résistance à l'eau. Avec une pression normale, l'écart reste discret ; avec un chauffe-eau instantané, assurez-vous qu'il s'allume toujours bien après l'installation.",
      },
      {
        q: "Combien coûte un pommeau filtrant à l'usage ?",
        a: "Le pommeau s'achète une fois, ce sont les cartouches qui reviennent. Le tableau du haut de page donne, pour chaque modèle, la recharge que nous vendons et son prix.",
      },
    ],
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
          "Le kit ALTHY à trois cartouches permet de démarrer avec une réserve, et de ne pas repasser commande avant plusieurs mois.",
        ],
      },
    ],
    guides: ["pommeau-douche-vitamine-c-comment-ca-marche", "changer-cartouche-pommeau-filtrant"],
    image: {
      src: "/images/rayons/pommeau-de-douche-vitamine-c.jpg",
      alt: "Une douchette à poignée transparente avec sa cartouche jaune, sur une tablette en marbre, à côté de deux rondelles de citron et d'une serviette blanche",
    },
    compare: ["Filtration", "recharge"],
    faq: [
      {
        q: "Combien de temps dure une cartouche vitamine C ?",
        a: "ALTHY annonce environ deux mois par cartouche ; pour le pommeau design, le fabricant conseille de la changer quand le parfum faiblit. Une famille nombreuse l'usera plus vite qu'une personne seule.",
      },
      {
        q: "La cartouche vitamine C supporte-t-elle l'eau chaude ?",
        a: "Oui, la vitamine C réagit aussi avec le chlore dans l'eau chaude. Respectez tout de même les limites de chaque notice : ALTHY donne une plage de 5 à 45 °C pour son pommeau.",
      },
      {
        q: "Les recharges sont-elles interchangeables ?",
        a: "Non. La cartouche du pommeau design est un long cylindre, celle d'ALTHY un disque : prenez celle indiquée sur la fiche de votre pommeau.",
      },
    ],
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
          "Avant de commander, regardez la place disponible sous votre pomme : le filtre ajoute quelques centimètres entre le bras et la pomme.",
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
    image: {
      src: "/images/guides/installer-filtre-de-douche.jpg",
      alt: "Deux mains vissent un filtre de douche chromé entre le bras de douche et la pomme, au-dessus d'un rouleau de ruban téflon",
    },
    faq: [
      {
        q: "Filtre à visser ou pommeau filtrant : que choisir ?",
        a: "Le filtre à visser vous laisse garder votre pommeau actuel, même une grande pomme de douche de tête. Le pommeau filtrant réunit tout en un seul objet, plus simple sur une douche à main.",
      },
      {
        q: "Où placer le filtre sur une douche à main ?",
        a: "Entre le flexible et la douchette, ou à la sortie du mitigeur, juste avant le flexible. Cette seconde place évite d'alourdir la douchette que l'on tient à la main.",
      },
      {
        q: "Que contient la cartouche de notre filtre ?",
        a: "Quinze couches de matériaux selon le fabricant, parmi lesquelles du KDF-55, du charbon actif et du sulfite de calcium. Il annonce une durée de quatre à six mois.",
      },
      {
        q: "Que trouve-t-on dans la boîte ?",
        a: "Le filtre chromé et sa cartouche, un ruban téflon, deux joints et une notice : de quoi l'installer sans rien acheter de plus.",
      },
    ],
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
          "Le geste qui compte le plus reste le détartrage régulier : quelques minutes de travail suffisent, avec un saladier et du vinaigre blanc.",
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
    image: {
      src: "/images/guides/detartrer-pommeau-de-douche.jpg",
      alt: "Une douchette chromée en train de tremper dans un saladier de vinaigre blanc, sur le bord d'un lavabo",
    },
    faq: [
      {
        q: "Un pommeau filtrant protège-t-il du calcaire ?",
        a: "Non. Ses cartouches visent le chlore et les particules : le calcaire dissous passe au travers et continue de se déposer sur la grille.",
      },
      {
        q: "Comment connaître la dureté de mon eau ?",
        a: "Elle s'exprime en degrés français (°f) et figure dans la note sur la qualité de l'eau envoyée chaque année avec la facture. Au-delà de 25 à 30 °f, on parle généralement d'une eau dure.",
      },
      {
        q: "À quelle fréquence détartrer mon pommeau ?",
        a: "Dès que des jets partent de travers ou que le débit baisse. Là où l'eau est très calcaire, un bain de vinaigre blanc chaque mois empêche le tartre de s'installer.",
      },
      {
        q: "Les billes du pommeau à billes adoucissent-elles l'eau ?",
        a: "Non, rien de sérieux ne le montre. Ce pommeau a sa place dans ce rayon parce que sa tête se démonte à la main, ce qui facilite le détartrage.",
      },
    ],
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
    image: {
      src: "/images/rayons/recharge-pommeau-de-douche-filtrant.jpg",
      alt: "Deux mains remplacent la cartouche d'une douchette à poignée transparente au-dessus d'un lavabo, l'ancienne cartouche grisée posée à côté",
    },
    compare: ["Compatibilité", "Composition", "Quantité", "Durée annoncée"],
    faq: [
      {
        q: "Comment trouver la bonne recharge ?",
        a: "Partez de votre pommeau ou de votre filtre : sa fiche indique la recharge qui lui correspond, et le tableau du haut de page la compatibilité de chacune.",
      },
      {
        q: "Combien de recharges prévoir pour un an ?",
        a: "Avec une durée annoncée de deux mois, comptez environ six cartouches par an ; avec quatre à six mois, deux ou trois. Une forte consommation d'eau raccourcit ces durées.",
      },
      {
        q: "Avez-vous des recharges pour tous vos pommeaux ?",
        a: "Pas encore : le pommeau à billes et le pommeau trois jets n'ont pas de recharge chez nous pour le moment. Écrivez-nous si vous en cherchez une.",
      },
      {
        q: "Comment conserver une recharge d'avance ?",
        a: "Gardez-la dans son emballage fermé, au sec et à l'abri de la chaleur, jusqu'au moment de la monter.",
      },
    ],
  },
];
