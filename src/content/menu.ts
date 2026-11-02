import type { MenuGroup } from "./types";

/**
 * The guides of the menus, by theme, with a short name each. A new guide goes in one group here as well:
 * scripts/check-content.mjs lists the guides that no group links to.
 */
export const GUIDE_MENU: MenuGroup[] = [
  {
    title: "Choisir",
    links: [
      { name: "Est-ce efficace ?", path: "/guides/pommeau-de-douche-filtrant-efficace" },
      { name: "La vitamine C", path: "/guides/pommeau-douche-vitamine-c-comment-ca-marche" },
    ],
  },
  {
    title: "Installer et entretenir",
    links: [
      { name: "Installer un filtre", path: "/guides/installer-filtre-de-douche" },
      { name: "Changer la cartouche", path: "/guides/changer-cartouche-pommeau-filtrant" },
      { name: "Détartrer le pommeau", path: "/guides/detartrer-pommeau-de-douche" },
    ],
  },
];
