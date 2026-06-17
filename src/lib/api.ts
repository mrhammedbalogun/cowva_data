// Central data access layer.
//
// Mock mode (default) returns data derived from the real Cowva distribution
// (see reference.ts). Live mode (NEXT_PUBLIC_USE_MOCK="false") fetches from
// same-origin Next route handlers that proxy to the Django analytics API with
// the httpOnly session token — the browser never sees the token or hits CORS.

import {
  buildOverview,
  buildVaccinations,
  buildVaccines,
  buildFacilitiesList,
  buildDemographics,
  buildVaccineBrands,
  buildFacilityBranches,
} from "./mock-data";
import { mockFilterOptions } from "./reference";
import type {
  Filters,
  OverviewData,
  FilterOptions,
  VaccinationsData,
  VaccinesData,
  FacilitiesData,
  DemographicsData,
  VaccineBrandsData,
  FacilityBranchesData,
} from "./types";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

async function delay<T>(value: T, ms = 300): Promise<T> {
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
  const res = await fetch(`/api/analytics/overview?${toQuery(filters)}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Failed to load overview (${res.status})`);
  return res.json();
}

type RawFilterOptions = {
  states?: string[];
  facilities?: string[];
  branches?: string[];
  vaccines?: ({ name: string } | string)[];
};

export async function getVaccinations(filters: Filters): Promise<VaccinationsData> {
  if (USE_MOCK) return delay(buildVaccinations(filters));
  const res = await fetch(`/api/analytics/vaccinations?${toQuery(filters)}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Failed to load vaccinations (${res.status})`);
  return res.json();
}

export async function getVaccines(filters: Filters): Promise<VaccinesData> {
  if (USE_MOCK) return delay(buildVaccines(filters));
  const res = await fetch(`/api/analytics/vaccines?${toQuery(filters)}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Failed to load vaccines (${res.status})`);
  return res.json();
}

export async function getFacilities(filters: Filters): Promise<FacilitiesData> {
  if (USE_MOCK) return delay(buildFacilitiesList(filters));
  const res = await fetch(`/api/analytics/facilities?${toQuery(filters)}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Failed to load facilities (${res.status})`);
  return res.json();
}

export async function getDemographics(filters: Filters): Promise<DemographicsData> {
  if (USE_MOCK) return delay(buildDemographics(filters));
  const res = await fetch(`/api/analytics/demographics?${toQuery(filters)}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Failed to load demographics (${res.status})`);
  return res.json();
}

export async function getVaccineBrands(
  vaccine: string,
  filters: Filters
): Promise<VaccineBrandsData> {
  if (USE_MOCK) return delay(buildVaccineBrands(vaccine, filters));
  const qs = new URLSearchParams(toQuery(filters));
  qs.set("vaccine", vaccine);
  const res = await fetch(`/api/analytics/vaccine-brands?${qs.toString()}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Failed to load brands (${res.status})`);
  return res.json();
}

export async function getFacilityBranches(
  facility: string,
  filters: Filters
): Promise<FacilityBranchesData> {
  if (USE_MOCK) return delay(buildFacilityBranches(facility, filters));
  const qs = new URLSearchParams(toQuery(filters));
  qs.set("facility", facility);
  const res = await fetch(`/api/analytics/facility-branches?${qs.toString()}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Failed to load branches (${res.status})`);
  return res.json();
}

export async function getFilterOptions(): Promise<FilterOptions> {
  if (USE_MOCK) return delay(mockFilterOptions());
  const res = await fetch(`/api/analytics/filters`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load filters (${res.status})`);
  const raw: RawFilterOptions = await res.json();
  return {
    states: raw.states ?? [],
    facilities: raw.facilities ?? [],
    branches: raw.branches ?? [],
    vaccines: (raw.vaccines ?? []).map((v) =>
      typeof v === "string" ? v : v.name
    ),
  };
}
