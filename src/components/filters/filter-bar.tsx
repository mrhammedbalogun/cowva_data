"use client";

import * as React from "react";
import { RotateCcw, Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiSelect } from "./multi-select";
import { useFilters } from "./filter-context";
import { DATA_START, DATA_END } from "@/lib/reference";
import { getFilterOptions } from "@/lib/api";
import type { FilterOptions, Gender, Granularity } from "@/lib/types";
import { cn } from "@/lib/utils";

function shiftDays(iso: string, days: number): string {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

const Segmented = <T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { label: string; value: T }[];
  onChange: (v: T) => void;
}) => (
  <div className="inline-flex h-9 items-center rounded-md border bg-background p-0.5">
    {options.map((o) => (
      <button
        key={o.value}
        type="button"
        onClick={() => onChange(o.value)}
        className={cn(
          "rounded-[5px] px-2.5 py-1 text-sm font-medium transition-colors",
          value === o.value
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        {o.label}
      </button>
    ))}
  </div>
);

export function FilterBar() {
  const {
    filters,
    setStates,
    setFacilities,
    setBranches,
    setVaccines,
    setGender,
    setGranularity,
    setDateRange,
    reset,
  } = useFilters();

  const [datePreset, setDatePreset] = React.useState("all");
  const [options, setOptions] = React.useState<FilterOptions>({
    states: [],
    facilities: [],
    branches: [],
    vaccines: [],
  });

  React.useEffect(() => {
    let active = true;
    getFilterOptions()
      .then((o) => active && setOptions(o))
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  function applyPreset(preset: string | null) {
    if (!preset) return;
    setDatePreset(preset);
    switch (preset) {
      case "last7":
        return setDateRange(shiftDays(DATA_END, -7), DATA_END);
      case "last30":
        return setDateRange(shiftDays(DATA_END, -30), DATA_END);
      case "last12m":
        return setDateRange(shiftDays(DATA_END, -365), DATA_END);
      case "ytd":
        return setDateRange("2026-01-01", DATA_END);
      case "all":
        return setDateRange(DATA_START, DATA_END);
    }
  }

  return (
    <div className="rounded-lg border bg-muted/30 p-3 print:hidden">
      <div className="flex flex-wrap items-center gap-2">
        <MultiSelect
          label="State"
          options={options.states}
          selected={filters.states}
          onChange={setStates}
        />
        <MultiSelect
          label="Facility"
          options={options.facilities}
          selected={filters.facilities}
          onChange={setFacilities}
        />
        <MultiSelect
          label="Branch"
          options={options.branches}
          selected={filters.branches}
          onChange={setBranches}
        />
        <MultiSelect
          label="Vaccine"
          options={options.vaccines}
          selected={filters.vaccines}
          onChange={setVaccines}
        />

        <Segmented<Gender>
          value={filters.gender}
          onChange={setGender}
          options={[
            { label: "All", value: "all" },
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
          ]}
        />

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <Segmented<Granularity>
            value={filters.granularity}
            onChange={setGranularity}
            options={[
              { label: "Day", value: "day" },
              { label: "Week", value: "week" },
              { label: "Month", value: "month" },
              { label: "Year", value: "year" },
            ]}
          />
          <Select value={datePreset} onValueChange={applyPreset}>
            <SelectTrigger size="sm" className="h-9 w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last7">Last 7 days</SelectItem>
              <SelectItem value="last30">Last 30 days</SelectItem>
              <SelectItem value="last12m">Last 12 months</SelectItem>
              <SelectItem value="ytd">Year to date</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            size="sm"
            className="h-9"
            onClick={() => {
              reset();
              setDatePreset("all");
            }}
          >
            <RotateCcw className="size-3.5" />
            Reset
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-9"
            onClick={() => toast.info("Export will be available on the Reports page.")}
          >
            <Download className="size-3.5" />
            Export
          </Button>
        </div>
      </div>
    </div>
  );
}
