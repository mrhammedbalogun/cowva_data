"use client";

import * as React from "react";
import type { Filters, Gender, Granularity } from "@/lib/types";
import { DATA_START, DATA_END } from "@/lib/reference";

const DEFAULT_FILTERS: Filters = {
  states: [],
  facilities: [],
  branches: [],
  gender: "all",
  vaccines: [],
  granularity: "month",
  dateFrom: DATA_START,
  dateTo: DATA_END,
};

type FilterContextValue = {
  filters: Filters;
  setStates: (v: string[]) => void;
  setFacilities: (v: string[]) => void;
  setBranches: (v: string[]) => void;
  setVaccines: (v: string[]) => void;
  setGender: (v: Gender) => void;
  setGranularity: (v: Granularity) => void;
  setDateRange: (from: string, to: string) => void;
  reset: () => void;
};

const FilterContext = React.createContext<FilterContextValue | null>(null);

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = React.useState<Filters>(DEFAULT_FILTERS);

  const value: FilterContextValue = React.useMemo(
    () => ({
      filters,
      setStates: (states) =>
        setFilters((f) => ({ ...f, states, facilities: [], branches: [] })),
      setFacilities: (facilities) =>
        setFilters((f) => ({ ...f, facilities, branches: [] })),
      setBranches: (branches) => setFilters((f) => ({ ...f, branches })),
      setVaccines: (vaccines) => setFilters((f) => ({ ...f, vaccines })),
      setGender: (gender) => setFilters((f) => ({ ...f, gender })),
      setGranularity: (granularity) =>
        setFilters((f) => ({ ...f, granularity })),
      setDateRange: (dateFrom, dateTo) =>
        setFilters((f) => ({ ...f, dateFrom, dateTo })),
      reset: () => setFilters(DEFAULT_FILTERS),
    }),
    [filters]
  );

  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  );
}

export function useFilters() {
  const ctx = React.useContext(FilterContext);
  if (!ctx) throw new Error("useFilters must be used within FilterProvider");
  return ctx;
}
