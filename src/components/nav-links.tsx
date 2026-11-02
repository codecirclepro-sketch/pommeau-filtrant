"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** The header's links to the categories and the guides, the current one marked. */
export function NavLinks({ links }: { links: { name: string; path: string }[] }) {
  const pathname = usePathname();
  return (
    <ul>
      {links.map((l) => {
        const current = pathname === l.path || pathname.startsWith(`${l.path}/`);
        return (
          <li key={l.path}>
            <Link href={l.path} aria-current={current ? "page" : undefined}>
              {l.name}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
