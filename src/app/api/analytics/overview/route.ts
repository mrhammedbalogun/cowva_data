import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const qs = req.nextUrl.search;
  try {
    const r = await fetch(`${API_BASE}/api/v1/analytics/overview/${qs}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const data = await r.json().catch(() => ({}));
    return NextResponse.json(data, { status: r.status });
  } catch {
    return NextResponse.json(
      { error: "Could not reach the analytics server." },
      { status: 502 }
    );
  }
}
