"use client";

import Link from "next/link";
import { openCart, useCart } from "@/lib/cart";
import { Icon } from "./icon";

/** The header's cart button: opens the drawer (a plain link to /panier without JavaScript or with a modifier key). */
export function CartButton() {
  const n = useCart().reduce((sum, l) => sum + l.qty, 0);
  return (
    <Link
      href="/panier"
      className="hd-cart"
      aria-label={n ? `Panier, ${n} article${n > 1 ? "s" : ""}` : "Panier"}
      onClick={(e) => {
        // Pages without the drawer (the 404 page) simply follow the link.
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0 || !document.querySelector(".drawer")) return;
        e.preventDefault();
        openCart();
      }}
    >
      <Icon name="cart" size={22} />
      <span className="hd-cart-label">Panier</span>
      {n > 0 && <span className="hd-cart-count">{n}</span>}
    </Link>
  );
}
