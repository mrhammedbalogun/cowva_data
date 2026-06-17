"use client";

import * as React from "react";
import { ChartCard } from "@/components/dashboard/chart-card";
import { FacilitiesTable } from "@/components/dashboard/facilities-table";
import { DrillSheet } from "@/components/dashboard/drill-sheet";
import { useAnalytics } from "@/components/dashboard/use-analytics";
import { useFilters } from "@/components/filters/filter-context";
import { getFacilities, getFacilityBranches } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

export default function FacilitiesPage() {
  const { data, loading, error } = useAnalytics(getFacilities);
  const { filters } = useFilters();
  const rows = data?.facilities ?? [];

  const [drill, setDrill] = React.useState<{
    open: boolean;
    facility: string;
    loading: boolean;
    branches: { branch: string; value: number; completionRate: number }[];
  }>({ open: false, facility: "", loading: false, branches: [] });

  function openBranches(facility: string) {
    setDrill({ open: true, facility, loading: true, branches: [] });
    getFacilityBranches(facility, filters)
      .then((d) =>
        setDrill((s) => ({ ...s, loading: false, branches: d.branches }))
      )
      .catch(() => setDrill((s) => ({ ...s, loading: false, branches: [] })));
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Facilities</h1>
        <p className="text-sm text-muted-foreground">
          Health facility performance, ranked by vaccinations. Click a row to
          see its branches.
        </p>
      </div>

      {error ? (
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <ChartCard title={loading || !data ? "Facilities" : `Facilities (${rows.length})`}>
        {loading || !data ? (
          <div className="space-y-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-full" />
            ))}
          </div>
        ) : (
          <FacilitiesTable rows={rows} onRowClick={openBranches} />
        )}
      </ChartCard>

      <DrillSheet
        open={drill.open}
        onOpenChange={(open) => setDrill((s) => ({ ...s, open }))}
        title={drill.facility}
        subtitle="Vaccinations by branch"
        unit="branches"
        loading={drill.loading}
        items={drill.branches.map((b) => ({
          label: b.branch,
          value: b.value,
          sub: `${b.completionRate}% complete`,
        }))}
      />
    </div>
  );
}
