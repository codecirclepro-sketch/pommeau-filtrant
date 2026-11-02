import { createHmac, timingSafeEqual } from "node:crypto";

// The dashboard (/admin) asks for ADMIN_PASSWORD in a form, then keeps a signed session cookie for 30 days.
// The cookie holds an expiry date and its HMAC keyed with the password: changing the password signs everyone out.
// Without a password of 12 characters or more, the dashboard answers 404 to everyone.

export const SESSION_COOKIE = "adm";
export const SESSION_DAYS = 30;

/** The password, or null when it is missing or too short: the dashboard is then closed to everyone. */
export function adminPassword() {
  const p = process.env.ADMIN_PASSWORD ?? "";
  return p.length >= 12 ? p : null;
}

const same = (a: string, b: string) => {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
};

const sign = (password: string, expires: number) =>
  createHmac("sha256", password).update(`admin-session:${expires}`).digest("base64url");

export function checkPassword(given: string) {
  const password = adminPassword();
  return Boolean(password) && same(given, password!);
}

/** A new session value, valid SESSION_DAYS days. */
export function newSession() {
  const expires = Date.now() + SESSION_DAYS * 86_400_000;
  return `${expires}.${sign(adminPassword()!, expires)}`;
}

export function isAdminSession(value: string | undefined) {
  const password = adminPassword();
  if (!password || !value) return false;
  const [expires, mac] = value.split(".");
  const when = Number(expires);
  if (!Number.isFinite(when) || when < Date.now() || !mac) return false;
  return same(mac, sign(password, when));
}
