import type { Facet, FilterKey } from "./types";

/** The shop's filters, in the order of the filter column and of the menus, under their family. */
export const FACET_GROUPS: { key: FilterKey; label: string; family: string }[] = [];

/** The page of the whole shop, /boutique. */
export const BOUTIQUE = {
  title: "Boutique : pommeaux filtrants, filtres et recharges",
  description:
    "Toute la boutique : pommeaux de douche filtrants, filtres à visser et cartouches de rechange, avec la filtration et la durée annoncées par chaque fabricant.",
  h1: "Toute la boutique",
  intro:
    "Les pommeaux filtrants, les filtres à visser et leurs recharges : tout le catalogue est ici. Filtrez par critère, ou passez par nos rayons pour aller droit au but.",
  sections: [
    {
      h2: "Par où commencer ?",
      body: [
        "Vous voulez changer de pommeau : partez des pommeaux filtrants. Vous tenez au vôtre : un filtre à visser se place juste avant. Vous êtes déjà équipé : passez directement aux recharges.",
      ],
    },
  ],
  guides: [] as string[],
};

/** One page per filter value worth a search: /boutique/<slug>. */
export const FACETS: Facet[] = [];
