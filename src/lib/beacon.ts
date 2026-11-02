// Sends a count to /api/hit (browser code). Nothing identifies the visitor: no cookie, no id.

/** Set from the dashboard on Nicolas's own browsers so that his visits are not counted. */
export const NO_COUNT_KEY = "no-count";

export function beacon(data: Record<string, unknown>) {
  try {
    if (localStorage.getItem(NO_COUNT_KEY) === "1") return;
  } catch {}
  const body = JSON.stringify(data);
  try {
    if (!navigator.sendBeacon?.("/api/hit", body)) fetch("/api/hit", { method: "POST", body, keepalive: true }).catch(() => {});
  } catch {}
}
