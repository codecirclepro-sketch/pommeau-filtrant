import type { MenuGroup } from "./types";

/**
 * The guides of the menus, by theme, with a short name each. A new guide goes in one group here as well:
 * scripts/check-content.mjs lists the guides that no group links to. While it is empty, the header's panel is hidden.
 */
export const GUIDE_MENU: MenuGroup[] = [];
