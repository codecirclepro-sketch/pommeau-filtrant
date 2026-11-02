import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/admin";
import { sameOrigin } from "@/lib/limits";

export async function POST(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ error: "Requête refusée." }, { status: 403 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { httpOnly: true, sameSite: "strict", path: "/", maxAge: 0 });
  return res;
}
