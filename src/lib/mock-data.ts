import {
  STATES,
  VACCINES,
  FACILITIES,
  TOTAL_VACCINATIONS,
  TOTAL_PATIENTS,
  DATA_START,
  DATA_END,
} from "./reference";
import type {
  Filters,
  OverviewData,
  TimePoint,
  StateCount,
  FacilityRow,
  Kpi,
} from "./types";

const GENDER_RATIO = { male: 0.46, female: 0.54 };
const PATIENT_RATIO = TOTAL_PATIENTS / TOTAL_VACCINATIONS;

function clampDate(d: string, lo: string, hi: string): string {
  if (d < lo) return lo;
  if (d > hi) return hi;
  return d;
}

function daysBetween(a: string, b: string): number {
  return Math.max(
    0,
    Math.round((Date.parse(b) - Date.parse(a)) / 86_400_000)
  );
}

// Deterministic wobble so values are stable between renders.
function wobble(i: number): number {
  return 0.88 + 0.24 * Math.abs(Math.sin(i * 1.7 + 0.5));
}

function selectedStates(f: Filters) {
  if (!f.states.length) return STATES;
  return STATES.filter((s) => f.states.includes(s.name));
}

function genderFraction(f: Filters): number {
  if (f.gender === "male") return GENDER_RATIO.male;
  if (f.gender === "female") return GENDER_RATIO.female;
  return 1;
}

function vaccineFraction(f: Filters): number {
  if (!f.vaccines.length) return 1;
  const totalW = VACCINES.reduce((s, v) => s + v.weight, 0);
  const selW = VACCINES.filter((v) => f.vaccines.includes(v.name)).reduce(
    (s, v) => s + v.weight,
    0
  );
  return selW / totalW;
}

function dateFraction(f: Filters): number {
  const from = clampDate(f.dateFrom, DATA_START, DATA_END);
  const to = clampDate(f.dateTo, DATA_START, DATA_END);
  const span = daysBetween(DATA_START, DATA_END);
  const sel = daysBetween(from, to);
  if (span === 0) return 1;
  return Math.min(1, Math.max(0.02, sel / span));
}

/** Total vaccinations for the current filter selection. */
function scaledTotal(f: Filters): number {
  const stateTotal = selectedStates(f).reduce((s, x) => s + x.total, 0);
  return stateTotal * genderFraction(f) * vaccineFraction(f) * dateFraction(f);
}

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

function buildTimeSeries(f: Filters): TimePoint[] {
  const total = scaledTotal(f);
  const fraction = total / TOTAL_VACCINATIONS;
  const monthlyAvg = (TOTAL_VACCINATIONS / 52) * fraction;
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  if (f.granularity === "year") {
    const startY = Number(DATA_START.slice(0, 4));
    const endY = Number(clampDate(f.dateTo, DATA_START, DATA_END).slice(0, 4));
    const points: TimePoint[] = [];
    for (let y = startY; y <= endY; y++) {
      const i = y - startY;
      const growth = 0.5 + (i / Math.max(1, endY - startY)) * 1.1;
      points.push({
        label: `${y}`,
        value: Math.round(monthlyAvg * 12 * growth * wobble(i)),
      });
    }
    return points;
  }

  if (f.granularity === "week") {
    const points: TimePoint[] = [];
    for (let i = 0; i < 12; i++) {
      const growth = 0.7 + (i / 11) * 0.7;
      points.push({
        label: `W${i + 1}`,
        value: Math.round((monthlyAvg / 4.3) * growth * wobble(i)),
      });
    }
    return points;
  }

  if (f.granularity === "day") {
    const points: TimePoint[] = [];
    for (let i = 0; i < 14; i++) {
      const growth = 0.8 + (i / 13) * 0.5;
      points.push({
        label: `D${i + 1}`,
        value: Math.round((monthlyAvg / 30) * growth * wobble(i)),
      });
    }
    return points;
  }

  // month — last 12 months
  const points: TimePoint[] = [];
  for (let i = 0; i < 12; i++) {
    const growth = 0.6 + (i / 11) * 0.9;
    points.push({
      label: months[i],
      value: Math.round(monthlyAvg * growth * wobble(i)),
    });
  }
  return points;
}

function buildByState(f: Filters): StateCount[] {
  const factor = genderFraction(f) * vaccineFraction(f) * dateFraction(f);
  return selectedStates(f)
    .map((s) => ({ state: s.name, value: Math.round(s.total * factor) }))
    .sort((a, b) => b.value - a.value);
}

function buildFacilities(f: Filters): FacilityRow[] {
  const states = selectedStates(f);
  const stateNames = new Set(states.map((s) => s.name));
  const factor = genderFraction(f) * vaccineFraction(f) * dateFraction(f);
  const stateTotalMap = new Map(states.map((s) => [s.name, s.total]));

  const rows = FACILITIES.filter((fac) => stateNames.has(fac.state)).map(
    (fac, i) => {
      const base = (stateTotalMap.get(fac.state) ?? 0) * fac.share * factor;
      const vaccinations = Math.max(1, Math.round(base * wobble(i)));
      const completionRate = Math.round((72 + (wobble(i) - 0.88) * 100) * 10) / 10;
      const day = 1 + (i % 27);
      return {
        facility: fac.name,
        state: fac.state,
        branches: fac.branches,
        vaccinations,
        completionRate: Math.min(99, Math.max(60, completionRate)),
        lastActivity: `2026-06-${pad(day)}`,
      } satisfies FacilityRow;
    }
  );
  return rows.sort((a, b) => b.vaccinations - a.vaccinations).slice(0, 8);
}

export function buildOverview(f: Filters): OverviewData {
  const total = scaledTotal(f);
  const states = selectedStates(f);
  const facilitiesInScope = FACILITIES.filter((x) =>
    states.some((s) => s.name === x.state)
  );

  const gf = genderFraction(f);
  const maleShare = f.gender === "female" ? 0 : GENDER_RATIO.male;
  const femaleShare = f.gender === "male" ? 0 : GENDER_RATIO.female;
  const genderBase = total / Math.max(gf, 0.0001);

  const routineW = VACCINES.filter(
    (v) => v.category === "routine_immunisation"
  ).reduce((s, v) => s + v.weight, 0);
  const totalW = VACCINES.reduce((s, v) => s + v.weight, 0);
  const routineFrac = routineW / totalW;

  const kpis: Kpi[] = [
    { label: "Total vaccinations", value: Math.round(total), delta: 8.4, format: "number" },
    {
      label: "Patients reached",
      value: Math.round(total * PATIENT_RATIO),
      delta: 6.1,
      format: "number",
    },
    {
      label: "Active facilities",
      value: facilitiesInScope.length,
      format: "number",
      note: `${states.length} state${states.length === 1 ? "" : "s"}`,
    },
    {
      label: "Branches",
      value: facilitiesInScope.reduce((s, x) => s + x.branches, 0),
      format: "number",
    },
    { label: "Completion rate", value: 78, delta: 2.3, format: "percent" },
    { label: "Cowva-verified", value: 64, delta: 4.7, format: "percent" },
  ];

  return {
    kpis,
    timeSeries: buildTimeSeries(f),
    byState: buildByState(f),
    byVaccineCategory: {
      routine: Math.round(total * routineFrac),
      catchUp: Math.round(total * (1 - routineFrac)),
    },
    genderSplit: {
      male: Math.round(genderBase * maleShare),
      female: Math.round(genderBase * femaleShare),
    },
    topFacilities: buildFacilities(f),
  };
}

export function buildVaccinations(f: Filters) {
  const series = buildTimeSeries(f);
  const total = scaledTotal(f);
  const complete = Math.round(total * 0.31);
  return {
    timeSeries: series,
    completionSeries: series.map((p, i) => ({
      label: p.label,
      value: Math.round(26 + (wobble(i) - 0.88) * 60),
    })),
    totals: { total: Math.round(total), complete, incomplete: Math.round(total) - complete },
  };
}

export function buildVaccines(f: Filters) {
  const total = scaledTotal(f);
  const totalW = VACCINES.reduce((s, v) => s + v.weight, 0);
  const byVaccine = VACCINES.map((v, i) => ({
    vaccine: v.name,
    category: v.category,
    value: Math.round((total * v.weight) / totalW * wobble(i)),
  })).sort((a, b) => b.value - a.value);
  const routine = byVaccine
    .filter((v) => v.category === "routine_immunisation")
    .reduce((s, v) => s + v.value, 0);
  const catchUp = byVaccine
    .filter((v) => v.category === "catch_up")
    .reduce((s, v) => s + v.value, 0);
  return { byVaccine, byVaccineCategory: { routine, catchUp } };
}

export function buildFacilitiesList(f: Filters) {
  const states = selectedStates(f);
  const stateNames = new Set(states.map((s) => s.name));
  const factor = genderFraction(f) * vaccineFraction(f) * dateFraction(f);
  const stateTotalMap = new Map(states.map((s) => [s.name, s.total]));
  const facilities = FACILITIES.filter((fac) => stateNames.has(fac.state))
    .map((fac, i) => {
      const base = (stateTotalMap.get(fac.state) ?? 0) * fac.share * factor;
      return {
        facility: fac.name,
        state: fac.state,
        branches: fac.branches,
        vaccinations: Math.max(1, Math.round(base * wobble(i))),
        completionRate: Math.min(99, Math.max(60, Math.round((72 + (wobble(i) - 0.88) * 100) * 10) / 10)),
        lastActivity: `2026-06-${pad(1 + (i % 27))}`,
      };
    })
    .sort((a, b) => b.vaccinations - a.vaccinations);
  return { facilities };
}

const AGE_PROPS: [string, number][] = [
  ["<1", 112],
  ["1-4", 998],
  ["5-14", 636],
  ["15-49", 4128],
  ["50+", 610],
];

export function buildDemographics(f: Filters) {
  const total = scaledTotal(f);
  const patients = total * PATIENT_RATIO;
  const gf = genderFraction(f);
  const base = patients / Math.max(gf, 0.0001);
  const ageTotal = AGE_PROPS.reduce((s, [, n]) => s + n, 0);
  return {
    genderSplit: {
      male: Math.round(base * (f.gender === "female" ? 0 : GENDER_RATIO.male)),
      female: Math.round(base * (f.gender === "male" ? 0 : GENDER_RATIO.female)),
    },
    ageBands: AGE_PROPS.map(([band, n]) => ({
      band,
      value: Math.round((n / ageTotal) * patients),
    })),
    pregnancy: {
      pregnant: Math.max(1, Math.round(patients * 0.0005)),
      nonPregnant: Math.round(patients * 0.07),
    },
  };
}
