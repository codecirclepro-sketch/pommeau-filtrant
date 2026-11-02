"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Icon } from "./icon";

type Done = { id: string; at: string; acknowledged: boolean; name: string; order: string; email: string; items: string };

const when = (iso: string) =>
  new Date(iso).toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short", timeZone: "Europe/Paris" });

/** The form, with the order number of the link in the order e-mail (?commande=…) filled in. Needs a Suspense boundary. */
export function WithdrawalFormFromLink({ shopEmail }: { shopEmail: string | null }) {
  const order = useSearchParams().get("commande")?.slice(0, 80) ?? "";
  return <WithdrawalForm key={order} shopEmail={shopEmail} initialOrder={order} />;
}

/** The withdrawal form: name, contract, e-mail for the acknowledgment, then "Confirmer la rétractation". */
export function WithdrawalForm({ shopEmail, initialOrder = "" }: { shopEmail: string | null; initialOrder?: string }) {
  const [form, setForm] = useState({ name: "", order: initialOrder, email: "", items: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<Done | null>(null);
  const doneBox = useRef<HTMLDivElement>(null);

  // Bring the confirmation into view once the declaration is recorded.
  useEffect(() => {
    if (done) doneBox.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [done]);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/retractation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await res.json().catch(() => ({}))) as { id?: string; at?: string; acknowledged?: boolean; error?: string };
      if (res.ok && data.id && data.at) {
        setDone({ id: data.id, at: data.at, acknowledged: Boolean(data.acknowledged), ...form });
      } else setError(data.error ?? "L'envoi n'a pas abouti. Réessayez dans un instant.");
    } catch {
      setError("Connexion impossible. Vérifiez votre réseau et réessayez.");
    }
    setBusy(false);
  }

  if (done)
    return (
      <div className="wdone" role="status" ref={doneBox}>
        <Icon name="check" size={28} className="wdone-icon" />
        <h2>Votre rétractation est enregistrée</h2>
        <p>
          Déclaration reçue le <strong>{when(done.at)}</strong>, référence <strong>{done.id}</strong>.
        </p>
        <p>
          {done.acknowledged
            ? `Un accusé de réception vient de vous être envoyé à ${done.email}.`
            : `L'accusé de réception n'a pas pu partir par e-mail : gardez cette page${shopEmail ? ` et écrivez-nous à ${shopEmail}` : ""}.`}
        </p>
        <dl className="wdone-rows">
          <div>
            <dt>Nom</dt>
            <dd>{done.name}</dd>
          </div>
          <div>
            <dt>Commande</dt>
            <dd>{done.order}</dd>
          </div>
          <div>
            <dt>Produits concernés</dt>
            <dd>{done.items || "Toute la commande"}</dd>
          </div>
        </dl>
        <p>
          Nous vous écrivons avec l&apos;adresse de retour. Le remboursement intervient au plus tard quatorze jours après votre
          déclaration, par le moyen de paiement de la commande ; il peut attendre la réception des produits ou la preuve de leur
          envoi.
        </p>
      </div>
    );

  return (
    <form className="wform" onSubmit={submit}>
      <label className="field">
        <span className="field-label">Nom et prénom</span>
        <input value={form.name} onChange={set("name")} autoComplete="name" required maxLength={120} />
      </label>
      <label className="field">
        <span className="field-label">Commande concernée</span>
        <span className="field-hint">Son numéro (8 caractères), dans l&apos;e-mail de confirmation ; à défaut, sa date et ses produits.</span>
        <input value={form.order} onChange={set("order")} required maxLength={80} />
      </label>
      <label className="field">
        <span className="field-label">E-mail pour recevoir l&apos;accusé de réception</span>
        <input type="email" value={form.email} onChange={set("email")} autoComplete="email" required maxLength={200} />
      </label>
      <label className="field">
        <span className="field-label">Produits concernés (facultatif)</span>
        <span className="field-hint">Laissez vide si vous renoncez à toute la commande.</span>
        <textarea value={form.items} onChange={set("items")} rows={3} maxLength={600} />
      </label>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <button type="submit" className="btn btn-main btn-lg" disabled={busy}>
        {busy ? "Envoi…" : "Confirmer la rétractation"}
      </button>
    </form>
  );
}
