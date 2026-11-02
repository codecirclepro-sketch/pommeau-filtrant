"use client";

import { useEffect, useState } from "react";
import { addAndOpen, MAX_QTY } from "@/lib/cart";
import { Icon } from "./icon";

/** True for a moment after `fire()`: the "Ajouté" state of an add button. */
function useDone(ms = 1800) {
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setDone(false), ms);
    return () => clearTimeout(t);
  }, [done, ms]);
  return [done, () => setDone(true)] as const;
}

/** The product page's main buying block: quantity and "Ajouter au panier" (watched by the sticky buy bar). */
export function AddToCart({ slug, available, paymentOpen }: { slug: string; available: boolean; paymentOpen: boolean }) {
  const [qty, setQty] = useState(1);
  const [done, fire] = useDone();
  if (!available) return <p className="buy-off">Ce produit n&apos;est pas disponible pour le moment.</p>;
  return (
    <div className="buy" id="buy-main">
      <div className="buy-row">
        <div className="qty" role="group" aria-label="Quantité">
          <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Retirer un" disabled={qty <= 1}>
            <Icon name="minus" size={16} />
          </button>
          <span aria-live="polite">{qty}</span>
          <button type="button" onClick={() => setQty((q) => Math.min(MAX_QTY, q + 1))} aria-label="Ajouter un" disabled={qty >= MAX_QTY}>
            <Icon name="plus" size={16} />
          </button>
        </div>
        <button
          type="button"
          className={`btn btn-main btn-lg buy-btn${done ? " is-done" : ""}`}
          onClick={() => {
            addAndOpen(slug, qty);
            fire();
          }}
        >
          <Icon name={done ? "check" : "cart"} size={20} />
          {done ? "Ajouté au panier" : "Ajouter au panier"}
        </button>
      </div>
      {!paymentOpen && <p className="buy-note">Le paiement en ligne ouvre très bientôt : ajoutez au panier pour retrouver votre sélection.</p>}
    </div>
  );
}

/** Compact button of the product cards. */
export function QuickAdd({ slug, name, available }: { slug: string; name: string; available: boolean }) {
  const [done, fire] = useDone();
  if (!available) return null;
  return (
    <button
      type="button"
      className={`quick-add${done ? " is-done" : ""}`}
      onClick={() => {
        addAndOpen(slug);
        fire();
      }}
      aria-label={`Ajouter ${name} au panier`}
    >
      <Icon name={done ? "check" : "cart"} size={20} />
      <span className="sr-only">{done ? "Ajouté" : "Ajouter"}</span>
    </button>
  );
}
