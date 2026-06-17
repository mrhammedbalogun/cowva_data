"use client";

import { ChartCard } from "@/components/dashboard/chart-card";
import { NigeriaMap } from "@/components/dashboard/nigeria-map";
import { useOverview } from "@/components/dashboard/use-overview";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function GeographyPage() {
  const { data, loading, error } = useOverview();

  const values = Object.fromEntries(
    (data?.byState ?? []).map((s) => [s.state, s.value])
  );
  const total = (data?.byState ?? []).reduce((s, x) => s + x.value, 0) || 1;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Geography</h1>
        <p className="text-sm text-muted-foreground">
          Vaccination volume by state across Nigeria.
        </p>
      </div>

      {error ? (
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-5">
        <ChartCard title="Vaccinations by state" className="lg:col-span-3">
          {loading || !data ? (
            <Skeleton className="h-[420px] w-full" />
          ) : (
            <NigeriaMap values={values} />
          )}
        </ChartCard>

        <ChartCard title="State ranking" className="lg:col-span-2">
          {loading || !data ? (
            <div className="space-y-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>State</TableHead>
                  <TableHead className="text-right">Vaccinations</TableHead>
                  <TableHead className="text-right">Share</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.byState.map((s) => (
                  <TableRow key={s.state}>
                    <TableCell className="font-medium">{s.state}</TableCell>
                    <TableCell className="text-right">
                      {s.value.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {Math.round((s.value / total) * 100)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </ChartCard>
      </div>
    </div>
  );
}
