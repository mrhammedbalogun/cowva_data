export type Granularity = "day" | "week" | "month" | "year";
export type Gender = "all" | "male" | "female";

export interface Filters {
  states: string[];
  facilities: string[];
  branches: string[];
  gender: Gender;
  vaccines: string[];
  granularity: Granularity;
  dateFrom: string; // ISO yyyy-mm-dd
  dateTo: string; // ISO yyyy-mm-dd
}

export interface Kpi {
  label: string;
  value: number;
  /** percent change vs previous period, e.g. 12.4 or -3.1 */
  delta?: number;
  format?: "number" | "percent";
  note?: string;
}

export interface TimePoint {
  label: string;
  value: number;
}

export interface StateCount {
  state: string;
  value: number;
}

export interface VaccineCount {
  vaccine: string;
  category: string;
  value: number;
}

export interface GenderSplit {
  male: number;
  female: number;
}

export interface CategorySplit {
  routine: number;
  catchUp: number;
}

export interface AgeBand {
  band: string;
  value: number;
}

export interface FacilityRow {
  facility: string;
  state: string;
  branches: number;
  vaccinations: number;
  completionRate: number;
  lastActivity: string;
}

export interface OverviewData {
  kpis: Kpi[];
  timeSeries: TimePoint[];
  byState: StateCount[];
  byVaccineCategory: CategorySplit;
  genderSplit: GenderSplit;
  topFacilities: FacilityRow[];
}
