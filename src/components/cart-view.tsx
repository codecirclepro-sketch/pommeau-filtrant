"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { addAndOpen, MAX_QTY, pruneCart, removeFromCart, setQuantity, suggestions, useCart, type CartProduct } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { Icon } from "./icon";
import { Thumb } from "./thumb";

export function CartView({ products, paymentOpen, shippingNote }: { products: CartProduct[]; paymentOpen: boolean; shippingNote: string }) {
  const cart = useCart();
  const [accepted, setAccepted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => pruneCart(products.map((p) => p.slug)), [products]);

  const lines = cart.flatMap((l) => {
    const product = products.find((p) => p.slug === l.slug);
    return product ? [{ ...l, product }] : [];
  });
  const count = lines.reduce((n, l) => n + l.qty, 0);
  const total = lines.reduce((sum, l) => sum + l.qty * l.product.price, 0);
  const blocked = lines.some((l) => !l.product.available);
  const more = suggestions(lines, products, 3);

  if (!lines.length)
    return (
      <div className="cart-empty">
        <span className="cart-empty-icon">
          <Icon name="cart" size={36} />
        </span>
        <h2>Votre panier est vide</h2>
        <p>Parcourez la boutique pour trouver le pommeau ou la recharge qui vous convient.</p>
        <div className="cart-empty-cta">
          <Link href="/boutique" className="btn btn-main">
            Voir la boutique
          </Link>
        </div>
      </div>
    );

  async function checkout() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: lines.map((l) => ({ slug: l.slug, qty: l.qty })) }),
      });
      const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (res.ok && data.url) {
        window.location.assign(data.url);
        return;
      }
      setError(data.error ?? "Le paiement n'a pas pu démarrer. Réessayez dans un instant.");
    } catch {
      setError("Connexion impossible. Vérifiez votre réseau et réessayez.");
    }
    setBusy(false);
  }

  return (
    <div className="cart">
      <div className="cart-main">
        <ul className="cart-lines">
          {lines.map(({ slug, qty, product }) => (
            <li key={slug} className="cart-line">
              <Link href={product.path} className="cart-pic" tabIndex={-1} aria-hidden="true">
                <Thumb product={product} size={96} />
              </Link>
              <div className="cart-info">
                <Link href={product.path} className="cart-name">
                  {product.name}
                </Link>
                <p className="cart-unit">{formatPrice(product.price)} l&apos;unité</p>
                {!product.available && <p className="cart-off">Plus disponible : retirez-le pour commander.</p>}
                <div className="cart-actions">
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
              <p className="cart-sub">{formatPrice(qty * product.price)}</p>
            </li>
          ))}
        </ul>

        {more.length > 0 && (
          <section className="cart-more" aria-labelledby="cart-more-title">
            <h2 id="cart-more-title">Pour compléter votre commande</h2>
            <ul>
              {more.map((p) => (
                <li key={p.slug}>
                  <Thumb product={p} size={64} />
                  <Link href={p.path} className="cart-more-name">
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

      <aside className="cart-sum" id="recapitulatif" aria-labelledby="cart-sum-title">
        <h2 id="cart-sum-title">Récapitulatif</h2>
        <dl className="cart-rows">
          <div>
            <dt>
              Articles ({count})
            </dt>
            <dd>{formatPrice(total)}</dd>
          </div>
          <div>
            <dt>Livraison</dt>
            <dd className="muted">À l&apos;étape suivante</dd>
          </div>
          <div className="cart-total">
            <dt>Sous-total</dt>
            <dd>{formatPrice(total)}</dd>
          </div>
        </dl>
        <p className="cart-note">{shippingNote}</p>
        {paymentOpen ? (
          <>
            <label className="cart-cgv">
              <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} />
              <span>
                J&apos;ai lu et j&apos;accepte les{" "}
                <Link href="/cgv" target="_blank">
                  conditions générales de vente
                </Link>
                .
              </span>
            </label>
            <button type="button" className="btn btn-main btn-lg btn-block" disabled={!accepted || busy || blocked} onClick={checkout}>
              <Icon name="lock" size={18} />
              {busy ? "Redirection vers le paiement…" : "Passer au paiement"}
            </button>
          </>
        ) : (
          <p className="cart-closed">
            <Icon name="lock" size={18} />
            <span>
              <strong>Le paiement en ligne ouvre très bientôt.</strong> Votre panier reste enregistré sur cet appareil. Une
              question ? <Link href="/contact">Écrivez-nous</Link>.
            </span>
          </p>
        )}
        {error && (
          <p className="cart-error" role="alert">
            {error}
          </p>
        )}
        <ul className="cart-trust">
          <li>
            <Icon name="lock" size={18} /> Paiement sécurisé par Stripe : votre carte ne passe pas par notre site
          </li>
          <li>
            <Icon name="undo" size={18} /> Droit de rétractation de 14 jours après réception, comme pour tout achat à distance
          </li>
        </ul>
      </aside>

      <div className="cart-bar">
        <p>
          <span>Sous-total</span>
          <strong>{formatPrice(total)}</strong>
        </p>
        <a href="#recapitulatif" className="btn btn-main">
          {paymentOpen ? "Commander" : "Récapitulatif"}
        </a>
      </div>
    </div>
  );
}
