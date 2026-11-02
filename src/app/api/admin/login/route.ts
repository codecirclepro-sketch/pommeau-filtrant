import { NextResponse } from "next/server";
import { adminPassword, checkPassword, newSession, SESSION_COOKIE, SESSION_DAYS } from "@/lib/admin";
import { allow, clientAddress, sameOrigin } from "@/lib/limits";

// Signs Nicolas in to the dashboard. Five attempts per address every 15 minutes.
export async function POST(req: Request) {
  if (!adminPassword()) return new NextResponse("Not found", { status: 404 });
  if (!sameOrigin(req)) return NextResponse.json({ error: "Requête refusée." }, { status: 403 });
  if (!allow(`login:${clientAddress(req)}`, 5, 15 * 60_000))
    return NextResponse.json({ error: "Trop de tentatives : réessaie dans 15 minutes." }, { status: 429 });

  let password = "";
  try {
    password = String((await req.json())?.password ?? "");
  } catch {}
  if (!checkPassword(password)) return NextResponse.json({ error: "Mot de passe incorrect." }, { status: 401 });

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, newSession(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_DAYS * 86_400,
  });
  return res;
}
