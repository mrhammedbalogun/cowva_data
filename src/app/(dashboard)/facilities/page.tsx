"use client";

import { ChartCard } from "@/components/dashboard/chart-card";
import { FacilitiesTable } from "@/components/dashboard/facilities-table";
import { useAnalytics } from "@/components/dashboard/use-analytics";
import { getFacilities } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

export default function FacilitiesPage() {
  const { data, loading, error } = useAnalytics(getFacilities);
  const rows = data?.facilities ?? [];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Facilities</h1>
        <p className="text-sm text-muted-foreground">
          Health facility performance, ranked by vaccinations.
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
          <FacilitiesTable rows={rows} />
        )}
      </ChartCard>
    </div>
  );
}
