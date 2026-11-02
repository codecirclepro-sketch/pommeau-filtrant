"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { addAndOpen, MAX_QTY, onCartOpen, removeFromCart, setQuantity, suggestions, useCart, type CartProduct } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { Icon } from "./icon";
import { Thumb } from "./thumb";

/**
 * The cart as a side panel, opened by every "Ajouter au panier" button and by the header's cart button. It shows what
 * was just added, the lines, compatible products, the subtotal and the way to the cart page (where the CGV are accepted).
 */
export function CartDrawer({ products, paymentOpen }: { products: CartProduct[]; paymentOpen: boolean }) {
  const cart = useCart();
  const [open, setOpen] = useState(false);
  const [added, setAdded] = useState<string | null>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(
    () =>
      onCartOpen((slug) => {
        setAdded(slug);
        setOpen(true);
      }),
    [],
  );

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
      previous?.focus?.();
    };
  }, [open]);

  const lines = cart.flatMap((l) => {
    const product = products.find((p) => p.slug === l.slug);
    return product ? [{ ...l, product }] : [];
  });
  const count = lines.reduce((n, l) => n + l.qty, 0);
  const total = lines.reduce((n, l) => n + l.qty * l.product.price, 0);
  const justAdded = added ? products.find((p) => p.slug === added) : undefined;
  const more = suggestions(lines, products, 1);
  const close = () => setOpen(false);

  return (
    <div className={`drawer${open ? " is-open" : ""}`} inert={!open}>
      <div className="drawer-overlay" onClick={close} aria-hidden="true" />
      <aside className="drawer-panel" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
        <header className="drawer-head">
          <h2 id="drawer-title">
            Votre panier {count > 0 && <span className="drawer-count">{count}</span>}
          </h2>
          <button ref={closeButton} type="button" className="icon-btn" onClick={close} aria-label="Fermer le panier">
            <Icon name="close" size={22} />
          </button>
        </header>

        {justAdded && lines.some((l) => l.slug === justAdded.slug) && (
          <p className="drawer-added" role="status">
            <Icon name="check" size={18} /> {justAdded.name} a été ajouté au panier.
          </p>
        )}

        <div className="drawer-body">
          {lines.length === 0 ? (
            <div className="drawer-empty">
              <Icon name="cart" size={40} />
              <p>Votre panier est vide.</p>
              <Link href="/boutique" className="btn btn-ghost" onClick={close}>
                Voir la boutique
              </Link>
            </div>
          ) : (
            <ul className="drawer-lines">
              {lines.map(({ slug, qty, product }) => (
                <li key={slug} className="drawer-line">
                  <Link href={product.path} onClick={close} tabIndex={-1} aria-hidden="true">
                    <Thumb product={product} size={72} />
                  </Link>
                  <div className="drawer-line-info">
                    <Link href={product.path} onClick={close} className="drawer-line-name">
                      {product.name}
                    </Link>
                    <span className="drawer-line-price">{formatPrice(product.price * qty)}</span>
                    <div className="drawer-line-actions">
                      <div className="qty qty-sm" role="group" aria-label={`Quantité de ${product.name}`}>
                        <button type="button" onClick={() => setQuantity(slug, qty - 1)} disabled={qty <= 1} aria-label="Retirer un">
                          <Icon name="minus" size={14} />
                        </button>
                        <span>{qty}</span>
                        <button type="button" onClick={() => setQuantity(slug, qty + 1)} disabled={qty >= MAX_QTY} aria-label="Ajouter un">
                          <Icon name="plus" size={14} />
                        </button>
                      </div>
                      <button type="button" className="link-btn" onClick={() => removeFromCart(slug)}>
                        Retirer
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {more.length > 0 && (
            <section className="drawer-more" aria-label="Pour compléter">
              <h3>Pour compléter</h3>
              <ul>
                {more.map((p) => (
                  <li key={p.slug}>
                    <Thumb product={p} size={52} />
                    <Link href={p.path} onClick={close} className="drawer-more-name">
                      {p.name}
                      <span>{formatPrice(p.price)}</span>
                    </Link>
                    <button type="button" className="btn btn-soft btn-sm" onClick={() => addAndOpen(p.slug)} aria-label={`Ajouter ${p.name}`}>
                      <Icon name="plus" size={16} /> Ajouter
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {lines.length > 0 && (
          <footer className="drawer-foot">
            <p className="drawer-total">
              <span>Sous-total</span>
              <strong>{formatPrice(total)}</strong>
            </p>
            <p className="drawer-note">
              {paymentOpen
                ? "Livraison choisie et calculée à l'étape suivante."
                : "Le paiement en ligne ouvre très bientôt : votre panier reste enregistré sur cet appareil."}
            </p>
            <Link href="/panier" className="btn btn-main btn-block" onClick={close}>
              {paymentOpen ? "Commander" : "Voir mon panier"}
              <Icon name="arrow" size={18} />
            </Link>
            <button type="button" className="btn btn-ghost btn-block" onClick={close}>
              Continuer mes achats
            </button>
          </footer>
        )}
      </aside>
    </div>
  );
}
