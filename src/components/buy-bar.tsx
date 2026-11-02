"use client";

import { useEffect, useState } from "react";
import { addAndOpen, type CartProduct } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { Icon } from "./icon";
import { Thumb } from "./thumb";

/**
 * Sticky bar at the bottom of the product page, shown once the main "Ajouter au panier" button has scrolled out of
 * sight: the purchase stays one tap away while reading the description.
 */
export function BuyBar({ product }: { product: CartProduct }) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const target = document.getElementById("buy-main");
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => setShown(!entry.isIntersecting && entry.boundingClientRect.top < 0));
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  if (!product.available) return null;
  return (
    <div className={`buy-bar${shown ? " is-shown" : ""}`} inert={!shown}>
      <div className="wrap buy-bar-row">
        <Thumb product={product} size={44} />
        <p className="buy-bar-info">
          <span>{product.name}</span>
          <strong>{formatPrice(product.price)}</strong>
        </p>
        <button type="button" className="btn btn-main" onClick={() => addAndOpen(product.slug)}>
          <Icon name="cart" size={18} />
          <span className="buy-bar-label">Ajouter au panier</span>
          <span className="buy-bar-short">Ajouter</span>
        </button>
      </div>
    </div>
  );
}
