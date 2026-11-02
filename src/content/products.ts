import type { Product, ProductImage } from "./types";

// The products, one entry per page. Fill them from the supplier's data only: name, references, specifications,
// price and photos (in public/produits/<slug>/). Nothing invented: no specification, review or stock figure
// that the supplier or Nicolas did not give. Margins never go here: this file builds public pages.
//
// Source: the AliExpress listings below, read on 2026-11-02 (specification table, options, delivery, and the figures
// printed on their photos). The makers' claims are given as theirs; their promises about skin, hair or health are never
// repeated (see CLAUDE.md, Rules). Listings, never shown on the site:
//   pommeau-douche-filtrant-vitamine-c-design            aliexpress.com/item/1005008493660009 (Home Rhyme Store, Paper Box)
//   recharge-vitamine-c-citron-pommeau-design            aliexpress.com/item/1005008734002477 (same store, Lemon Vit C)
//   pommeau-douche-filtrant-vitamine-c-althy             aliexpress.com/item/1005008295498961 (ALTHY official store, VC Shower suit)
//   pommeau-douche-filtrant-vitamine-c-althy-3-recharges same listing, VCx3 Shower Suit
//   recharges-vitamine-c-althy-sfh70                     aliexpress.com/item/1005008300125168 (ALTHY, 4xVCfilter)
//   pommeau-douche-filtrant-billes                       aliexpress.com/item/1005007009631932 (VILOYI, Large Shower head)
//   pommeau-douche-filtrant-3-jets-blanc                 aliexpress.com/item/1005010706564934 (HTMCK, White shower head)
//   pommeau-douche-filtrant-3-jets-noir-flexible         same listing, Black Shower set
//   filtre-de-douche-15-etages                           aliexpress.com/item/1005007857212026 (15 Stages Filt, the complete filter)
//   recharge-filtre-de-douche-15-etages                  same listing, 15 Stage Filter (the cartridge alone)
// Prices: first prices chosen on 2026-11-02 against French prices of the same kind of product; Nicolas can change them.

export const TODO = (what: string) => `<mark class="todo">[À compléter : ${what}]</mark>`;

const ALL = "pommeau-de-douche-filtrant";
const VITC = "pommeau-de-douche-vitamine-c";
const FILTER = "filtre-de-douche";
const LIME = "pommeau-de-douche-anti-calcaire";
const REFILL = "recharge-pommeau-de-douche-filtrant";

const photo = (slug: string, n: number, alt: string, width = 1000, height = width): ProductImage => ({
  src: `/produits/${slug}/${n}.jpg`,
  alt,
  width,
  height,
});

const DESIGN = "pommeau-douche-filtrant-vitamine-c-design";
const DESIGN_REFILL = "recharge-vitamine-c-citron-pommeau-design";
const ALTHY = "pommeau-douche-filtrant-vitamine-c-althy";
const ALTHY3 = "pommeau-douche-filtrant-vitamine-c-althy-3-recharges";
const ALTHY_REFILL = "recharges-vitamine-c-althy-sfh70";
const BEADS = "pommeau-douche-filtrant-billes";
const WHITE = "pommeau-douche-filtrant-3-jets-blanc";
const BLACK = "pommeau-douche-filtrant-3-jets-noir-flexible";
const INLINE = "filtre-de-douche-15-etages";
const INLINE_REFILL = "recharge-filtre-de-douche-15-etages";

export const PRODUCTS: Product[] = [
  {
    slug: DESIGN,
    sku: "PF-HR1",
    name: "Pommeau de douche filtrant vitamine C design",
    brand: "",
    category: VITC,
    also: [ALL],
    price: 7900,
    availability: "in_stock",
    title: "Pommeau de douche filtrant vitamine C, design anthracite",
    description:
      "Pommeau de douche filtrant au design anthracite : cartouche vitamine C parfumée et fibre de charbon actif, panneau inox de 392 trous, 27,5 cm de long.",
    summary: "Un pommeau au design soigné, avec une cartouche vitamine C parfumée et une fibre de charbon actif.",
    body: `### Présentation

Son corps gris anthracite, sa tête ovale évidée et sa poignée crantée en font la pièce la plus soignée de notre sélection. Il mesure 27,5 cm de long pour une tête de 8,3 cm de large. L'eau sort par un panneau en acier inoxydable percé de 392 trous de 0,25 mm, d'après le fabricant.

### La filtration

Dans la poignée, deux éléments se suivent. Une cartouche à la vitamine C diffuse un léger parfum au passage de l'eau. Une fibre de charbon actif (ACF) retient ensuite une partie des impuretés, selon le fabricant.

### Les recharges

La cartouche s'use avec le temps. Nous vendons sa [recharge vitamine C au citron](/produit/${DESIGN_REFILL}), du même fabricant.

### Questions fréquentes

**Combien de temps dure la cartouche ?**

Le fabricant ne donne pas de durée : elle dépend de votre eau et de l'usage. Changez-la quand le parfum disparaît ou que le débit baisse.

**Adoucit-il l'eau calcaire ?**

Non. Comme tous les pommeaux filtrants, il ne retire pas le calcaire dissous dans l'eau.`,
    specs: [
      { label: "Dimensions", value: "27,5 cm de long, tête de 8,3 cm de large" },
      { label: "Panneau", value: "Acier inoxydable, 392 trous de 0,25 mm, selon le fabricant" },
      { label: "Filtration", value: "Cartouche vitamine C parfumée, puis fibre de charbon actif (ACF)" },
      { label: "Matière", value: "ABS" },
      { label: "Couleur", value: "Gris anthracite" },
      { label: "Fournis", value: "Le pommeau et sa cartouche, en boîte carton" },
    ],
    images: [
      photo(DESIGN, 1, "Pommeau de douche filtrant gris anthracite à tête ovale, à côté de sa boîte et de sa cartouche vitamine C", 1000, 920),
      photo(DESIGN, 2, "Pommeau de douche filtrant anthracite avec ses dimensions : 27,5 cm de long et une tête de 8,3 cm"),
      photo(DESIGN, 3, "Une femme se rince l'épaule avec le pommeau de douche filtrant anthracite à tête ovale"),
    ],
    related: [DESIGN_REFILL, ALTHY],
    filters: { type: "Pommeau", technologie: "Vitamine C" },
    updated: "2026-11-02",
  },
  {
    slug: ALTHY,
    sku: "PF-AL1",
    name: "Pommeau de douche filtrant vitamine C ALTHY",
    brand: "ALTHY",
    mpn: "SFH70",
    category: VITC,
    also: [ALL],
    price: 4490,
    availability: "in_stock",
    title: "Pommeau de douche filtrant vitamine C ALTHY SFH70",
    description:
      "Pommeau de douche filtrant ALTHY SFH70 : trois étages de filtration dont la vitamine C, panneau inox 304, raccord standard, livré avec ses filtres de rechange.",
    summary: "Trois étages de filtration, dont la vitamine C, dans une poignée transparente, avec des filtres de rechange.",
    body: `### Présentation

Le pommeau SFH70 de la marque ALTHY se reconnaît à sa poignée transparente, qui laisse voir les filtres. Il mesure 28 cm de long pour une tête de 8 cm, avec un panneau en acier inoxydable 304. Son raccord G1/2 est le filetage standard des flexibles de douche en France.

### Trois étages de filtration

L'eau traverse d'abord un filtre en coton PP, qui retient les particules. Elle passe ensuite par la cartouche à la vitamine C, au léger parfum de citron, puis par un second filtre PP. ALTHY annonce que l'ensemble réduit le chlore, les odeurs et les sédiments.

### Ce qu'il y a dans la boîte

Le pommeau, une cartouche vitamine C et quatre filtres PP, dont une cartouche et un filtre déjà montés. ALTHY indique une durée d'environ deux mois par cartouche, selon votre eau et votre usage.

### Questions fréquentes

**Quelles conditions d'utilisation ?**

ALTHY le prévoit pour une pression de 0,1 à 0,4 MPa (1 à 4 bars) et une eau de 5 à 45 °C.

**Où trouver les recharges ?**

Nous vendons le [lot de quatre recharges vitamine C](/produit/${ALTHY_REFILL}) d'ALTHY, ou le [kit avec trois cartouches](/produit/${ALTHY3}) d'avance.`,
    specs: [
      { label: "Dimensions", value: "28 cm de long, tête de 8 cm" },
      { label: "Panneau", value: "Acier inoxydable 304" },
      { label: "Filtration", value: "Filtre PP, cartouche vitamine C, filtre PP" },
      { label: "Raccord", value: "G1/2, standard" },
      { label: "Conditions", value: "0,1 à 0,4 MPa, eau de 5 à 45 °C" },
      { label: "Durée annoncée", value: "Environ deux mois par cartouche, selon l'eau et l'usage" },
      { label: "Fournis", value: "1 cartouche vitamine C, 4 filtres PP" },
    ],
    images: [
      photo(ALTHY, 1, "Pommeau de douche filtrant ALTHY à poignée transparente, devant sa boîte bleue, avec une cartouche vitamine C jaune et des filtres de rechange"),
      photo(ALTHY, 2, "Pommeau de douche ALTHY à côté de son sachet de filtres de rechange", 1000, 860),
    ],
    range: { id: "althy", option: "1 cartouche vitamine C" },
    related: [ALTHY_REFILL, DESIGN],
    filters: { type: "Pommeau", technologie: "Vitamine C" },
    updated: "2026-11-02",
  },
  {
    slug: ALTHY3,
    sku: "PF-AL2",
    name: "Pommeau de douche filtrant vitamine C ALTHY, 3 recharges",
    brand: "ALTHY",
    mpn: "SFH70",
    category: VITC,
    also: [ALL],
    price: 5490,
    availability: "in_stock",
    title: "Pommeau filtrant vitamine C ALTHY avec 3 recharges",
    description:
      "Le kit ALTHY SFH70 avec trois cartouches vitamine C et quatre filtres PP : de quoi tenir plusieurs mois avant de racheter des recharges.",
    summary: "Le même pommeau ALTHY, livré avec trois cartouches vitamine C et quatre filtres PP.",
    body: `### Le kit

C'est le pommeau [ALTHY SFH70](/produit/${ALTHY}), vendu cette fois avec trois cartouches à la vitamine C au lieu d'une. Les quatre filtres PP sont toujours de la partie, dont un déjà monté avec la première cartouche.

### Pourquoi le choisir

Si vous adoptez ce pommeau, il faudra changer la cartouche vitamine C régulièrement : ALTHY compte environ deux mois chacune. Ce kit vous évite une deuxième commande pendant plusieurs mois.

### Questions fréquentes

**Les cartouches sont-elles les mêmes que celles vendues à part ?**

Oui, ce sont les recharges du modèle SFH70.`,
    specs: [
      { label: "Pommeau", value: "ALTHY SFH70, 28 cm, panneau inox 304" },
      { label: "Filtration", value: "Filtre PP, cartouche vitamine C, filtre PP" },
      { label: "Raccord", value: "G1/2, standard" },
      { label: "Fournis", value: "3 cartouches vitamine C, 4 filtres PP" },
    ],
    images: [
      photo(ALTHY3, 1, "Pommeau de douche ALTHY avec deux cartouches vitamine C jaunes et un sachet de filtres de rechange", 1000, 860),
      photo(ALTHY3, 2, "Boîte du pommeau de douche filtrant ALTHY, avec le pommeau, une cartouche jaune et les filtres de rechange"),
    ],
    range: { id: "althy", option: "3 cartouches vitamine C" },
    related: [ALTHY_REFILL, DESIGN],
    filters: { type: "Pommeau", technologie: "Vitamine C" },
    updated: "2026-11-02",
  },
  {
    slug: BEADS,
    sku: "PF-VI1",
    name: "Pommeau de douche filtrant à billes",
    brand: "VILOYI",
    category: ALL,
    also: [LIME],
    price: 2490,
    availability: "in_stock",
    title: "Pommeau de douche filtrant à billes, poignée transparente",
    description:
      "Pommeau de douche filtrant à billes : poignée transparente garnie de billes de charbon actif et de billes minérales, 24 cm, démontable sans outil.",
    summary: "Une poignée transparente remplie de billes de charbon actif et de billes minérales, qui se démonte à la main.",
    body: `### Présentation

Le modèle le plus reconnaissable : sa poignée transparente laisse voir les billes qu'elle contient. Il mesure 24 cm de long pour une tête de 7,8 cm, avec un panneau en acier inoxydable sur un corps en ABS.

### Les billes

Le fabricant associe des billes de charbon actif, destinées à retenir le chlore et les odeurs, à des billes minérales de couleur orangée. Il prête d'autres vertus à ces billes minérales, que nous ne reprenons pas faute de preuve.

### Entretien

La tête et la poignée se dévissent à la main : on peut rincer les buses ou changer les billes sans outil. Le raccord G1/2 se visse sur un flexible standard.

### Questions fréquentes

**Les billes enlèvent-elles le calcaire ?**

Non : aucune bille ne rend l'eau douce. En revanche, une tête qui se démonte facilement se détartre mieux, comme l'explique notre rayon [pommeau de douche anti-calcaire](/${LIME}).`,
    specs: [
      { label: "Dimensions", value: "24 cm de long, tête de 7,8 cm" },
      { label: "Matière", value: "Corps en ABS, panneau en acier inoxydable" },
      { label: "Filtration", value: "Billes de charbon actif et billes minérales" },
      { label: "Raccord", value: "G1/2, standard" },
      { label: "Entretien", value: "Tête et poignée démontables à la main" },
    ],
    images: [
      photo(BEADS, 1, "Pommeau de douche filtrant à poignée transparente remplie de billes orangées, vu de face et en fonctionnement"),
      photo(BEADS, 2, "Jet d'eau dense sortant du pommeau de douche transparent à billes, avec quelques feuilles vertes"),
    ],
    related: [WHITE, INLINE],
    filters: { type: "Pommeau", technologie: "Billes" },
    updated: "2026-11-02",
  },
  {
    slug: WHITE,
    sku: "PF-HT1",
    name: "Pommeau de douche filtrant 3 jets blanc",
    brand: "HTMCK",
    category: ALL,
    also: [LIME],
    price: 1990,
    availability: "in_stock",
    title: "Pommeau de douche filtrant 3 jets avec bouton stop, blanc",
    description:
      "Pommeau de douche filtrant blanc à trois jets, avec un bouton stop pour couper l'eau sous la main et un filtre remplaçable dans la poignée, raccord standard.",
    summary: "Trois jets, un bouton stop et un filtre remplaçable, pour le prix d'un pommeau ordinaire.",
    body: `### Présentation

Un pommeau simple et bien pensé : trois jets au choix (pluie, jet et mixte) se règlent avec une petite manette, et un bouton stop coupe l'eau sans toucher au mitigeur, pratique pendant le shampoing.

### La filtration

La poignée transparente accueille un filtre remplaçable. Le fabricant l'annonce contre les impuretés de l'eau, sans détailler sa composition.

### Installation

Il se visse sur un flexible standard grâce à son raccord G1/2, sans outil. C'est la version blanche, vendue seule, pour garder votre flexible actuel.

### Questions fréquentes

**Et si je veux changer aussi le flexible ?**

Choisissez la [version noire avec flexible de 1,5 m](/produit/${BLACK}).`,
    specs: [
      { label: "Jets", value: "3 : pluie, jet, mixte" },
      { label: "Commande", value: "Manette des jets, bouton stop" },
      { label: "Filtration", value: "Filtre remplaçable dans la poignée" },
      { label: "Raccord", value: "G1/2, standard" },
      { label: "Couleur", value: "Blanc, tête grise" },
      { label: "Fournis", value: "Le pommeau seul" },
    ],
    images: [
      photo(WHITE, 1, "Pommeau de douche filtrant blanc à trois jets avec bouton stop, monté sur un flexible inox", 602, 1000),
      photo(WHITE, 2, "Pommeau de douche blanc en fonctionnement sur une barre de douche, avec un jet dense", 810, 886),
    ],
    range: { id: "htmck", option: "Blanc, pommeau seul" },
    related: [BEADS, ALTHY],
    filters: { type: "Pommeau", technologie: "Filtre remplaçable" },
    updated: "2026-11-02",
  },
  {
    slug: BLACK,
    sku: "PF-HT2",
    name: "Pommeau de douche filtrant 3 jets noir avec flexible",
    brand: "HTMCK",
    category: ALL,
    also: [LIME],
    price: 2990,
    availability: "in_stock",
    title: "Pommeau filtrant 3 jets noir avec flexible de 1,5 m",
    description:
      "Pommeau de douche filtrant noir à trois jets et bouton stop, livré avec un flexible noir de 1,5 m : de quoi renouveler toute la douche à main en une fois.",
    summary: "Le pommeau filtrant trois jets en noir, livré avec un flexible noir de 1,5 m.",
    body: `### Présentation

La version noire de notre [pommeau filtrant trois jets](/produit/${WHITE}), livrée avec un flexible noir de 1,5 m. L'ensemble donne un aspect plus graphique à la douche, et remplace d'un coup un flexible fatigué.

### Ce qui ne change pas

Mêmes trois jets, même bouton stop et même filtre remplaçable dans la poignée. Le raccord reste le G1/2 standard.

### Questions fréquentes

**Le flexible convient-il à mon mitigeur ?**

Il se visse sur les sorties standard 1/2 pouce, les plus courantes. Vérifiez simplement que votre ancien flexible se dévisse à la main.`,
    specs: [
      { label: "Jets", value: "3 : pluie, jet, mixte" },
      { label: "Commande", value: "Manette des jets, bouton stop" },
      { label: "Filtration", value: "Filtre remplaçable dans la poignée" },
      { label: "Raccord", value: "G1/2, standard" },
      { label: "Couleur", value: "Noir" },
      { label: "Fournis", value: "Le pommeau et un flexible noir de 1,5 m" },
    ],
    images: [
      photo(BLACK, 1, "Pommeau de douche filtrant noir à trois jets avec son flexible noir enroulé", 626, 1000),
      photo(BLACK, 2, "Les deux versions du pommeau filtrant trois jets, noire et blanche, avec leurs flexibles", 1000, 830),
    ],
    range: { id: "htmck", option: "Noir, avec flexible" },
    related: [WHITE, BEADS],
    filters: { type: "Pommeau", technologie: "Filtre remplaçable" },
    updated: "2026-11-02",
  },
  {
    slug: INLINE,
    sku: "PF-FI1",
    name: "Filtre de douche 15 étages",
    brand: "",
    category: FILTER,
    also: [LIME],
    price: 3490,
    availability: "in_stock",
    title: "Filtre de douche 15 étages à visser, corps chromé",
    description:
      "Filtre de douche 15 étages à visser sur le bras ou le flexible : corps chromé, cartouche multicouche à KDF et charbon actif, garde votre pommeau actuel.",
    summary: "Un filtre chromé qui se visse avant votre pommeau actuel, avec une cartouche de 15 couches.",
    body: `### Présentation

Vous tenez à votre pommeau ? Ce filtre se visse juste avant lui, sur le bras de la douche de tête ou entre le flexible et la douchette. Son corps est chromé, et sa cartouche se change en dévissant le boîtier.

### La cartouche

Selon le fabricant, elle superpose quinze couches, parmi lesquelles du KDF-55, du charbon actif de noix de coco et du sulfite de calcium, des matériaux employés contre le chlore. Il indique une durée de quatre à six mois.

### Dans la boîte

Le filtre et sa cartouche, du ruban téflon pour l'étanchéité du filetage, deux joints et une notice.

### Questions fréquentes

**Où trouver la recharge ?**

Nous vendons la [cartouche de rechange 15 étages](/produit/${INLINE_REFILL}) seule.

**Va-t-il gêner le débit ?**

Toute cartouche freine un peu l'eau. Le passage est large, mais avec une pression faible au départ, la différence se sentira davantage.`,
    specs: [
      { label: "Type", value: "Filtre à visser, avant le pommeau" },
      { label: "Corps", value: "Chromé" },
      { label: "Cartouche", value: "15 couches, dont KDF-55, charbon actif et sulfite de calcium, selon le fabricant" },
      { label: "Durée annoncée", value: "4 à 6 mois" },
      { label: "Fournis", value: "Filtre, cartouche, ruban téflon, 2 joints, notice" },
    ],
    images: [
      photo(INLINE, 1, "Filtre de douche chromé avec sa boîte, sa cartouche blanche, un rouleau de ruban téflon, deux joints et la notice", 800, 592),
      photo(INLINE, 2, "Filtre de douche chromé vissé entre le bras de douche et la tête, avec sa cartouche multicouche visible en coupe", 800, 480),
    ],
    related: [INLINE_REFILL, BEADS],
    filters: { type: "Filtre à visser", technologie: "Multicouche" },
    updated: "2026-11-02",
  },
  {
    slug: DESIGN_REFILL,
    sku: "PF-HR2",
    name: "Recharge vitamine C citron pour pommeau design",
    brand: "",
    category: REFILL,
    also: [VITC],
    price: 2490,
    availability: "in_stock",
    title: "Recharge vitamine C citron pour pommeau filtrant design",
    description:
      "Recharge du pommeau de douche filtrant design : cartouche vitamine C au parfum de citron sur fibre de charbon actif, à changer quand le parfum faiblit.",
    summary: "La cartouche de rechange du pommeau design : vitamine C au citron et fibre de charbon actif.",
    body: `### Présentation

C'est la cartouche d'origine de notre [pommeau filtrant vitamine C design](/produit/${DESIGN}), vendue par le même fabricant. Elle associe une partie à la vitamine C, au parfum de citron, et une fibre de charbon actif (ACF).

### Quand la changer

Le fabricant ne fixe pas de durée. Remplacez-la quand le parfum s'estompe ou que le débit diminue nettement.

### Questions fréquentes

**Convient-elle à un autre pommeau ?**

Non : elle est prévue pour le pommeau design de notre boutique. Pour le modèle ALTHY, prenez ses [recharges vitamine C](/produit/${ALTHY_REFILL}).`,
    specs: [
      { label: "Compatibilité", value: "Pommeau filtrant vitamine C design" },
      { label: "Composition", value: "Vitamine C parfum citron, fibre de charbon actif (ACF)" },
      { label: "Quantité", value: "1 cartouche" },
    ],
    images: [
      photo(DESIGN_REFILL, 1, "Cartouche de rechange avec une partie jaune à la vitamine C au-dessus d'une fibre de charbon gris", 360, 1000),
      photo(DESIGN_REFILL, 2, "Trois cartouches du fabricant côte à côte : parfum rose, charbon seul et parfum citron"),
    ],
    related: [DESIGN, ALTHY_REFILL],
    filters: { type: "Recharge", technologie: "Vitamine C" },
    updated: "2026-11-02",
  },
  {
    slug: ALTHY_REFILL,
    sku: "PF-AL3",
    name: "Recharges vitamine C ALTHY SFH70, lot de 4",
    brand: "ALTHY",
    mpn: "SFH70",
    category: REFILL,
    also: [VITC],
    price: 3990,
    availability: "in_stock",
    title: "Recharges vitamine C ALTHY SFH70, lot de 4 cartouches",
    description:
      "Lot de quatre cartouches vitamine C pour le pommeau de douche filtrant ALTHY SFH70 : de quoi tenir plusieurs mois, à raison d'environ deux mois par cartouche.",
    summary: "Quatre cartouches vitamine C pour le pommeau ALTHY SFH70.",
    body: `### Présentation

Les cartouches d'origine du pommeau [ALTHY SFH70](/produit/${ALTHY}), par lot de quatre. Elles se placent dans la poignée, entre les deux filtres PP, et dégagent un léger parfum de citron.

### Combien de temps

ALTHY compte environ deux mois par cartouche, selon votre eau et votre usage. Ce lot couvre donc plusieurs mois de douche.

### Questions fréquentes

**Faut-il changer aussi les filtres PP ?**

Oui, de temps en temps : ALTHY annonce une durée comparable pour chacun. Le pommeau en est livré avec quatre.`,
    specs: [
      { label: "Compatibilité", value: "Pommeau ALTHY SFH70" },
      { label: "Composition", value: "Vitamine C, parfum citron" },
      { label: "Quantité", value: "4 cartouches" },
      { label: "Durée annoncée", value: "Environ deux mois par cartouche" },
    ],
    images: [photo(ALTHY_REFILL, 1, "Quatre cartouches rondes et jaunes à la vitamine C pour pommeau de douche ALTHY", 1000, 800)],
    related: [ALTHY, ALTHY3],
    filters: { type: "Recharge", technologie: "Vitamine C" },
    updated: "2026-11-02",
  },
  {
    slug: INLINE_REFILL,
    sku: "PF-FI2",
    name: "Recharge filtre de douche 15 étages",
    brand: "",
    category: REFILL,
    also: [FILTER],
    price: 1990,
    availability: "in_stock",
    title: "Cartouche de rechange pour filtre de douche 15 étages",
    description:
      "Cartouche de rechange du filtre de douche 15 étages : KDF, charbon actif et sulfite de calcium selon le fabricant, à changer tous les quatre à six mois.",
    summary: "La cartouche de rechange de notre filtre de douche chromé à 15 étages.",
    body: `### Présentation

La cartouche d'origine de notre [filtre de douche 15 étages](/produit/${INLINE}). Elle se glisse dans le boîtier chromé une fois celui-ci dévissé, sans outil.

### Quand la changer

Le fabricant indique quatre à six mois d'usage. Un débit qui faiblit est aussi un bon signal.

### Questions fréquentes

**Que contient-elle ?**

D'après le fabricant, quinze couches de matériaux, dont du KDF-55, du charbon actif et du sulfite de calcium.`,
    specs: [
      { label: "Compatibilité", value: "Filtre de douche 15 étages" },
      { label: "Composition", value: "15 couches, dont KDF-55, charbon actif et sulfite de calcium, selon le fabricant" },
      { label: "Durée annoncée", value: "4 à 6 mois" },
      { label: "Quantité", value: "1 cartouche" },
    ],
    images: [photo(INLINE_REFILL, 1, "Cartouche blanche de filtre de douche, vue en coupe avec ses couches de billes colorées", 352, 648)],
    related: [INLINE, ALTHY_REFILL],
    filters: { type: "Recharge", technologie: "Multicouche" },
    updated: "2026-11-02",
  },
];
