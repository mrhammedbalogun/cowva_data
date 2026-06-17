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

export interface FilterOptions {
  states: string[];
  facilities: string[];
  branches: string[];
  vaccines: string[];
}

export interface VaccinationsData {
  timeSeries: TimePoint[];
  completionSeries: TimePoint[];
  totals: { total: number; complete: number; incomplete: number };
}

export interface VaccinesData {
  byVaccine: VaccineCount[];
  byVaccineCategory: CategorySplit;
}

export interface FacilitiesData {
  facilities: FacilityRow[];
}

export interface DemographicsData {
  genderSplit: GenderSplit;
  ageBands: AgeBand[];
  pregnancy: { pregnant: number; nonPregnant: number };
}

export interface BrandCount {
  brand: string;
  value: number;
}

export interface BranchCount {
  branch: string;
  value: number;
  completionRate: number;
}

export interface VaccineBrandsData {
  brands: BrandCount[];
}

export interface FacilityBranchesData {
  branches: BranchCount[];
}

export interface OverviewData {
  kpis: Kpi[];
  timeSeries: TimePoint[];
  byState: StateCount[];
  byVaccineCategory: CategorySplit;
  genderSplit: GenderSplit;
  topFacilities: FacilityRow[];
}
