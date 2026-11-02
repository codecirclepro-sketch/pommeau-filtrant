const euros = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });

/** "12,90 €" from a price in cents. Shared by server and browser code, so it imports nothing. */
export const formatPrice = (cents: number) => euros.format(cents / 100);

/** "21 octobre 2026" from an ISO date. */
export const formatDate = (iso: string) =>
  new Date(`${iso.slice(0, 10)}T12:00:00Z`).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" });
