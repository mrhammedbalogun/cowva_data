// Central data access layer.
//
// Today these functions return mock data derived from the real Cowva
// distribution (see reference.ts). In Stage 7 each function is swapped to
// fetch from the Django REST analytics API — the component contract below
// does not change.

import { buildOverview } from "./mock-data";
import type { Filters, OverviewData } from "./types";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

async function delay<T>(value: T, ms = 350): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function toQuery(f: Filters): string {
  const p = new URLSearchParams();
  if (f.states.length) p.set("states", f.states.join(","));
  if (f.facilities.length) p.set("facilities", f.facilities.join(","));
  if (f.branches.length) p.set("branches", f.branches.join(","));
  if (f.gender !== "all") p.set("gender", f.gender);
  if (f.vaccines.length) p.set("vaccines", f.vaccines.join(","));
  p.set("granularity", f.granularity);
  p.set("from", f.dateFrom);
  p.set("to", f.dateTo);
  return p.toString();
}

export async function getOverview(filters: Filters): Promise<OverviewData> {
  if (USE_MOCK) return delay(buildOverview(filters));
  const res = await fetch(`${API_BASE}/api/analytics/overview?${toQuery(filters)}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error(`Failed to load overview (${res.status})`);
  return res.json();
}
