import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  USER_COOKIE,
  encodeUser,
  verifyCredentials,
} from "@/lib/auth";

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

  const user = verifyCredentials(email, password);
  if (!user) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 }
    );
  }

  // Mock session token. Stage 7: replace with the JWT returned by Django.
  const token = Buffer.from(`${user.email}:${Date.now()}`).toString("base64url");
  const res = NextResponse.json({ user });
  const maxAge = 60 * 60 * 8; // 8 hours

  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  });
  res.cookies.set(USER_COOKIE, encodeUser(user), {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  });
  return res;
}
