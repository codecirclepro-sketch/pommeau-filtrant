import Link from "next/link";
import { Suspense } from "react";
import { Breadcrumb } from "@/components/site";
import { WithdrawalForm, WithdrawalFormFromLink } from "@/components/withdrawal-form";
import { SHOP } from "@/content/shop";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Renoncer au contrat : rétractation en ligne",
  description: "Exercez en ligne votre droit de rétractation sur une commande passée sur pommeau-filtrant.fr, et recevez un accusé de réception par e-mail.",
  path: "/retractation",
  index: false,
});

/** The online withdrawal function, linked as "Renoncer au contrat ici" from the footer and the order e-mails. */
export default function WithdrawalPage() {
  return (
    <>
      <Breadcrumb items={[{ name: "Rétractation", path: "/retractation" }]} />
      <article className="wrap legal">
        <p className="eyebrow">Droit de rétractation</p>
        <h1>Renoncer au contrat</h1>
        <div className="prose">
          <p>
            Comme pour tout achat à distance, vous disposez de quatorze jours à compter de la réception de votre commande pour
            vous rétracter, sans avoir à vous justifier. Remplissez ce formulaire : votre déclaration est enregistrée avec sa
            date et son heure, et un accusé de réception vous est envoyé par e-mail.
          </p>
          <p>
            Vous pouvez aussi nous écrire{SHOP.email ? ` à ${SHOP.email}` : ""}, ou utiliser le formulaire de rétractation des{" "}
            <Link href="/cgv">conditions générales de vente</Link>. Le retour des produits est expliqué sur la page{" "}
            <Link href="/livraison-retours">livraison et retours</Link>.
          </p>
        </div>
        <Suspense fallback={<WithdrawalForm shopEmail={SHOP.email} />}>
          <WithdrawalFormFromLink shopEmail={SHOP.email} />
        </Suspense>
      </article>
    </>
  );
}
