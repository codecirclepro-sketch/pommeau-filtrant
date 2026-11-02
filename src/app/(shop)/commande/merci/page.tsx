import Link from "next/link";
import { ClearCart } from "@/components/clear-cart";
import { Icon } from "@/components/icon";
import { formatPrice } from "@/lib/catalogue";
import { pageMeta } from "@/lib/seo";
import { orderNumber } from "@/lib/store";
import { stripe } from "@/lib/stripe";

export const metadata = pageMeta({
  title: "Merci pour votre commande",
  description: "Confirmation de votre commande sur pommeau-filtrant.fr.",
  path: "/commande/merci",
  index: false,
});

/** Reads the Stripe session to confirm the payment. Shows nothing personal: number, amount and status only. */
async function session(id: string | undefined) {
  const client = stripe();
  if (!client || !id || !/^cs_(test|live)_[A-Za-z0-9]{10,200}$/.test(id)) return null;
  try {
    const s = await client.checkout.sessions.retrieve(id);
    return { number: orderNumber(s.id), total: s.amount_total ?? 0, paid: s.payment_status !== "unpaid" };
  } catch {
    return null;
  }
}

export default async function ThankYouPage({ searchParams }: PageProps<"/commande/merci">) {
  const raw = (await searchParams).session_id;
  const order = await session(typeof raw === "string" ? raw : undefined);
  return (
    <div className="wrap done">
      {order && <ClearCart />}
      <Icon name="check" size={44} className="done-icon" />
      <h1>{order?.paid === false ? "Commande enregistrée" : "Merci pour votre commande"}</h1>
      {order ? (
        <>
          <p className="lead">
            Commande n° <strong>{order.number}</strong> — {formatPrice(order.total)}.
          </p>
          <p>
            {order.paid
              ? "Votre paiement est confirmé et nous préparons votre colis. La confirmation de commande arrive par e-mail, avec nos conditions générales de vente."
              : "Votre paiement est en cours de traitement par votre banque : la commande sera préparée dès sa confirmation."}
          </p>
        </>
      ) : (
        <p className="lead">
          Si vous venez de payer, votre commande est bien transmise : sa confirmation arrive par e-mail.
        </p>
      )}
      <p>
        Une question sur votre commande ? Écrivez-nous depuis la page <Link href="/contact">contact</Link> en indiquant le numéro
        de commande.
      </p>
      <Link href="/" className="btn btn-ghost">
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
