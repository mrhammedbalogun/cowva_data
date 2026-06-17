import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

const ALLOWED = new Set([
  "overview",
  "filters",
  "vaccinations",
  "vaccines",
  "facilities",
  "demographics",
]);

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ resource: string }> }
) {
  const { resource } = await params;
  if (!ALLOWED.has(resource)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const r = await fetch(
      `${API_BASE}/api/v1/analytics/${resource}/${req.nextUrl.search}`,
      { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" }
    );
    const data = await r.json().catch(() => ({}));
    return NextResponse.json(data, { status: r.status });
  } catch {
    return NextResponse.json(
      { error: "Could not reach the analytics server." },
      { status: 502 }
    );
  }
}
