import Link from "next/link";
import { Breadcrumb } from "@/components/site";
import { SHOP } from "@/content/shop";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Contact : une question sur un pommeau filtrant ?",
  description:
    "Contactez pommeau-filtrant.fr pour une question sur un produit, son installation, ses dimensions ou le suivi d'une commande.",
  path: "/contact",
});

const Todo = ({ label }: { label: string }) => <mark className="todo">[À compléter : {label}]</mark>;

export default function ContactPage() {
  return (
    <>
      <Breadcrumb items={[{ name: "Contact", path: "/contact" }]} />
      <article className="wrap legal">
        <h1>Contact</h1>
        <div className="prose">
          <p>
            Pour une question sur un produit, ses dimensions, son installation ou le suivi d&apos;une commande, écrivez-nous.
            Pour une commande, indiquez son numéro.
          </p>
          <ul>
            <li>E-mail : {SHOP.email ? <a href={`mailto:${SHOP.email}`}>{SHOP.email}</a> : <Todo label="adresse e-mail" />}</li>
            <li>Téléphone : {SHOP.phone ?? <Todo label="téléphone" />}</li>
            <li>Adresse : {SHOP.address ?? <Todo label="adresse postale" />}</li>
          </ul>
          <p>
            L&apos;identité complète du vendeur figure dans les <Link href="/mentions-legales">mentions légales</Link> ; la
            procédure de retour, sur la page <Link href="/livraison-retours">livraison et retours</Link>.
          </p>
        </div>
      </article>
    </>
  );
}
