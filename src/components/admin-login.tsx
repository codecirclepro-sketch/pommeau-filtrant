"use client";

import { useState } from "react";

/** The dashboard's sign-in form: one password field. */
export function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        window.location.reload();
        return;
      }
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setError(data.error ?? "Connexion impossible.");
    } catch {
      setError("Connexion impossible. Vérifie ton réseau.");
    }
    setBusy(false);
  }

  return (
    <form className="adm-login" onSubmit={submit}>
      <h1>Tableau de bord</h1>
      <label>
        Mot de passe
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoFocus
        />
      </label>
      <button type="submit" className="btn btn-main" disabled={busy || !password}>
        {busy ? "Connexion…" : "Se connecter"}
      </button>
      {error && (
        <p className="adm-login-error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}

/** Ends the session on this browser. */
export function AdminLogout() {
  return (
    <button
      type="button"
      className="adm-logout"
      onClick={async () => {
        await fetch("/api/admin/logout", { method: "POST" }).catch(() => {});
        window.location.reload();
      }}
    >
      Se déconnecter
    </button>
  );
}
