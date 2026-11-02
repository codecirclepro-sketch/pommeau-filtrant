import { CartView } from "@/components/cart-view";
import { Breadcrumb } from "@/components/site";
import { SHOP } from "@/content/shop";
import { cartProducts } from "@/lib/cart-products";
import { formatPrice } from "@/lib/catalogue";
import { pageMeta } from "@/lib/seo";
import { paymentOpen } from "@/lib/stripe";

export const metadata = pageMeta({
  title: "Votre panier",
  description: "Les articles de votre panier avant le paiement sécurisé par Stripe.",
  path: "/panier",
  index: false,
});

function shippingNote() {
  if (!SHOP.shipping.length) return "Les frais de livraison s'affichent à l'étape du paiement, avant de payer.";
  const prices = SHOP.shipping.map((s) => (s.amount ? `${s.label} : ${formatPrice(s.amount)}` : `${s.label} : offerte`));
  return `Livraison en ${SHOP.countryNames}. ${prices.join(" ; ")}. Vous la choisissez à l'étape du paiement.`;
}

export default function CartPage() {
  // Read when the page is built: rebuild after changing the Stripe key or INDEXABLE.
  return (
    <>
      <Breadcrumb items={[{ name: "Panier", path: "/panier" }]} />
      <div className="wrap">
        <h1 className="cart-title">Votre panier</h1>
        <CartView products={cartProducts()} paymentOpen={paymentOpen()} shippingNote={shippingNote()} />
      </div>
    </>
  );
}
