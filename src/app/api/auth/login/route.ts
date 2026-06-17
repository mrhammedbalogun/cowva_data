import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  USER_COOKIE,
  encodeUser,
  verifyCredentials,
  type AdminUser,
} from "@/lib/auth";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
const MAX_AGE = 60 * 60 * 8; // 8 hours

function setSession(res: NextResponse, token: string, user: AdminUser) {
  const opts = {
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  };
  res.cookies.set(SESSION_COOKIE, token, { ...opts, httpOnly: true });
  res.cookies.set(USER_COOKIE, encodeUser(user), { ...opts, httpOnly: false });
}

export async function POST(req: Request) {
  let email = "";
  let password = "";
  try {
    const body = await req.json();
    email = String(body.email ?? "");
    password = String(body.password ?? "");
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Live mode: authenticate against the Django analytics API (superuser only).
  if (!USE_MOCK) {
    try {
      const r = await fetch(`${API_BASE}/api/v1/analytics/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) {
        return NextResponse.json(
          { error: data.error ?? "Invalid email or password." },
          { status: r.status === 401 ? 401 : 400 }
        );
      }
      const res = NextResponse.json({ user: data.user });
      setSession(res, data.token, data.user as AdminUser);
      return res;
    } catch {
      return NextResponse.json(
        { error: "Could not reach the server. Please try again." },
        { status: 502 }
      );
    }
  }

  // Mock mode (local/dev without a backend).
  const user = verifyCredentials(email, password);
  if (!user) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 }
    );
  }
  const token = Buffer.from(`${user.email}:${Date.now()}`).toString("base64url");
  const res = NextResponse.json({ user });
  setSession(res, token, user);
  return res;
}
