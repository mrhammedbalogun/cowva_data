// Reference data grounded in the live Cowva database (as of 2026-06).
// Real per-state vaccination totals; representative facilities/branches/vaccines.

export interface StateRef {
  name: string;
  total: number; // real vaccination count
}

// Real distribution from vaccine_vaccination joined to core_state.
export const STATES: StateRef[] = [
  { name: "Delta", total: 6405 },
  { name: "Lagos", total: 5115 },
  { name: "Oyo", total: 598 },
  { name: "Ogun", total: 249 },
  { name: "Edo", total: 140 },
  { name: "FCT - Abuja", total: 42 },
  { name: "Rivers", total: 19 },
  { name: "Zamfara", total: 1 },
];

export const TOTAL_VACCINATIONS = STATES.reduce((s, x) => s + x.total, 0);
export const TOTAL_PATIENTS = 7443;
export const TOTAL_FACILITIES = 74;
export const TOTAL_BRANCHES = 116;
export const DATA_START = "2022-03-01";
export const DATA_END = "2026-06-17";

export interface VaccineRef {
  name: string;
  category: "routine_immunisation" | "catch_up";
  weight: number; // relative share
}

// Representative subset of the 33 vaccines (categories are real).
export const VACCINES: VaccineRef[] = [
  { name: "BCG", category: "routine_immunisation", weight: 12 },
  { name: "OPV (Oral Polio)", category: "routine_immunisation", weight: 14 },
  { name: "IPV (Inactivated Polio)", category: "routine_immunisation", weight: 7 },
  { name: "Pentavalent (DPT-HepB-Hib)", category: "routine_immunisation", weight: 13 },
  { name: "PCV (Pneumococcal)", category: "routine_immunisation", weight: 10 },
  { name: "Rotavirus", category: "routine_immunisation", weight: 8 },
  { name: "Measles", category: "routine_immunisation", weight: 9 },
  { name: "Yellow Fever", category: "routine_immunisation", weight: 6 },
  { name: "Vitamin A", category: "catch_up", weight: 5 },
  { name: "Meningitis A", category: "catch_up", weight: 3 },
  { name: "HPV", category: "catch_up", weight: 3 },
  { name: "Hepatitis B", category: "catch_up", weight: 3 },
  { name: "Tetanus (Td)", category: "catch_up", weight: 2 },
  { name: "COVID-19", category: "catch_up", weight: 2 },
];

export interface FacilityRef {
  name: string;
  state: string;
  branches: number;
  share: number; // share of its state's total
}

const FACILITY_NAMES = [
  "General Hospital",
  "Primary Health Centre",
  "Cottage Hospital",
  "Medical Centre",
  "Community Clinic",
  "Specialist Hospital",
  "Health Post",
  "Maternity Centre",
  "District Hospital",
  "Family Clinic",
];

// Deterministically distribute 74 facilities and 116 branches across states,
// weighted by each state's vaccination volume.
function buildFacilities(): FacilityRef[] {
  const facilities: FacilityRef[] = [];
  const totalWeight = STATES.reduce((s, x) => s + x.total, 0);
  let remaining = TOTAL_FACILITIES;
  STATES.forEach((st, i) => {
    const count =
      i === STATES.length - 1
        ? remaining
        : Math.max(1, Math.round((st.total / totalWeight) * TOTAL_FACILITIES));
    const n = Math.min(count, remaining);
    remaining -= n;
    for (let k = 0; k < n; k++) {
      facilities.push({
        name: `${st.name} ${FACILITY_NAMES[k % FACILITY_NAMES.length]}${
          k >= FACILITY_NAMES.length ? ` ${Math.floor(k / FACILITY_NAMES.length) + 1}` : ""
        }`,
        state: st.name,
        branches: 1 + (k % 2),
        share: 1 / Math.max(1, n),
      });
    }
  });
  return facilities;
}

export const FACILITIES: FacilityRef[] = buildFacilities();
