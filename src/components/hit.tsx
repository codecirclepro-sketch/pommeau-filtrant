"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { beacon } from "@/lib/beacon";

/**
 * Counts a page view. The first page of a visit also sends the referring site's host (never the full address),
 * which makes it a "visit" in the dashboard. Nothing is stored in the browser.
 */
export function Hit() {
  const path = usePathname();
  const first = useRef(true);
  useEffect(() => {
    let entry = false;
    let from = "";
    if (first.current) {
      first.current = false;
      try {
        from = document.referrer ? new URL(document.referrer).hostname : "";
      } catch {}
      entry = from !== location.hostname;
      if (!entry) from = "";
    }
    beacon({ p: path, r: from, n: entry });
  }, [path]);
  return null;
}
