import Link from "next/link";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Paiement annulé",
  description: "Le paiement a été annulé : votre panier est conservé.",
  path: "/commande/annulee",
  index: false,
});

export default function CancelledPage() {
  return (
    <div className="wrap done">
      <h1>Paiement annulé</h1>
      <p className="lead">Aucun montant n&apos;a été débité. Votre panier est conservé sur cet appareil.</p>
      <Link href="/panier" className="btn btn-main">
        Revenir au panier
      </Link>
    </div>
  );
}
