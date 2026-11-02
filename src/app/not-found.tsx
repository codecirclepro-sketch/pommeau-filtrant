import type { Metadata } from "next";
import Link from "next/link";
import { Footer, Header } from "@/components/site";

export const metadata: Metadata = { title: "Page introuvable", robots: { index: false, follow: false } };

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="contenu" className="wrap done">
        <p className="kicker">Erreur 404</p>
        <h1>Cette page n&apos;existe pas</h1>
        <p className="lead">L&apos;adresse a peut-être changé, ou le produit n&apos;est plus en ligne.</p>
        <Link href="/" className="btn btn-main">
          Retour à l&apos;accueil
        </Link>
      </main>
      <Footer />
    </>
  );
}
