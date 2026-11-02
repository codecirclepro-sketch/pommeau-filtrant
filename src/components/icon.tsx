// Line icons drawn for the site (24 × 24, stroke = currentColor).

const PATHS = {
  cart: "M3 4h2l2.2 10.2a1.5 1.5 0 0 0 1.5 1.2h8.6a1.5 1.5 0 0 0 1.5-1.1L21 8H6.2M9.5 20a1 1 0 1 0 0-.01M17.5 20a1 1 0 1 0 0-.01",
  // A shower head with its drops, a cartridge, a citrus slice, and two arrows that close a loop.
  shower: "M5 12a7 7 0 0 1 14 0zM12 5V3h5M8 16v2M12 16v3M16 16v2",
  filter: "M8 3h8v18H8zM8 8h8M8 12.5h8M8 17h8",
  citrus: "M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM12 4v16M4 12h16M6.3 6.3l11.4 11.4M17.7 6.3 6.3 17.7",
  refill: "M4.5 12a7.5 7.5 0 0 1 13-5.1M19.5 12a7.5 7.5 0 0 1-13 5.1M18 3.5v3.5h-3.5M6 20.5V17h3.5",
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  box: "M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5zM3.5 7.5 12 12l8.5-4.5M12 12v9",
  sparkle: "M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6",
  wifi: "M3.5 9.5a12 12 0 0 1 17 0M6.5 12.5a7.5 7.5 0 0 1 11 0M9.5 15.5a3.5 3.5 0 0 1 5 0M12 19h.01",
  shield: "M12 3 5 6v5.5c0 4.2 3 7.8 7 9.5 4-1.7 7-5.3 7-9.5V6zM9 12l2 2 4-4",
  search: "M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM15.5 15.5 20 20",
  book: "M4 5.5A1.5 1.5 0 0 1 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5zM13 4h5.5A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5H13zM7 8h2M7 11h2M16 8h1M16 11h1",
  lock: "M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3M12 14.5v2",
  undo: "M9 14 4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3",
  chat: "M4 5h16v11H9l-5 4zM8 9.5h8M8 12.5h5",
  arrow: "M5 12h14M13 6l6 6-6 6",
  check: "M5 12.5 10 17 19 7",
  minus: "M6 12h12",
  plus: "M12 6v12M6 12h12",
  close: "M6 6l12 12M18 6 6 18",
  truck: "M3 6h11v10H3zM14 9h4l3 3v4h-7M7 18.5a1.5 1.5 0 1 0 0-.01M17 18.5a1.5 1.5 0 1 0 0-.01",
  call: "M5 4h3.5L10 8 8 9.5a11 11 0 0 0 6.5 6.5l1.5-2 4 1.5V19a1.5 1.5 0 0 1-1.6 1.5A16 16 0 0 1 3.5 5.6 1.5 1.5 0 0 1 5 4z",
  mail: "M4 6h16v12H4zM4 7l8 6 8-6",
  chevron: "M9 6l6 6-6 6",
  menu: "M4 7h16M4 12h16M4 17h16",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2",
} as const;

export type IconName = keyof typeof PATHS;

export function Icon({ name, size = 20, className }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}

/** The mark of the shop: a shower head in a rounded square, and the name. */
export function Logo() {
  return (
    <span className="logo">
      <svg width="38" height="38" viewBox="0 0 38 38" aria-hidden="true">
        <rect className="logo-ground" width="38" height="38" rx="11" />
        <path className="logo-line" d="M10 18.5a9 9 0 0 1 18 0z" fill="none" strokeWidth="2.4" strokeLinejoin="round" />
        <path className="logo-line" d="M19 9.5V7h5.5" fill="none" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 23.5v2.5M19 23.5v4M24 23.5v2.5" fill="none" stroke="var(--accent)" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
      <span className="logo-text">
        <b>pommeau</b> filtrant<i>.fr</i>
      </span>
    </span>
  );
}
