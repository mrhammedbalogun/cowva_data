"use client";

import { Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard, StatCardSkeleton } from "@/components/dashboard/stat-card";
import { ChartCard } from "@/components/dashboard/chart-card";
import { useOverview } from "@/components/dashboard/use-overview";
import { useFilters } from "@/components/filters/filter-context";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function toCsv(rows: (string | number)[][]): string {
  return rows
    .map((r) =>
      r
        .map((cell) => {
          const s = String(cell);
          return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
        })
        .join(",")
    )
    .join("\n");
}

function download(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ReportsPage() {
  const { data, loading, error } = useOverview();
  const { filters } = useFilters();

  function exportCsv() {
    if (!data) return;
    const rows: (string | number)[][] = [];
    rows.push(["Cowva Impact Report"]);
    rows.push(["Date range", filters.dateFrom, "to", filters.dateTo]);
    rows.push(["Gender", filters.gender]);
    rows.push([]);
    rows.push(["Metric", "Value"]);
    data.kpis.forEach((k) =>
      rows.push([k.label, k.format === "percent" ? `${k.value}%` : k.value])
    );
    rows.push([]);
    rows.push(["State", "Vaccinations"]);
    data.byState.forEach((s) => rows.push([s.state, s.value]));
    rows.push([]);
    rows.push(["Gender", "Count"]);
    rows.push(["Male", data.genderSplit.male]);
    rows.push(["Female", data.genderSplit.female]);
    rows.push([]);
    rows.push(["Vaccine category", "Count"]);
    rows.push(["Routine immunisation", data.byVaccineCategory.routine]);
    rows.push(["Catch-up", data.byVaccineCategory.catchUp]);
    download(`cowva-impact-${filters.dateFrom}-to-${filters.dateTo}.csv`, toCsv(rows));
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Reports</h1>
          <p className="text-sm text-muted-foreground">
            Impact summary for {filters.dateFrom} → {filters.dateTo}
            {filters.gender !== "all" ? ` · ${filters.gender}` : ""}.
          </p>
        </div>
        <div className="flex gap-2 print:hidden">
          <Button variant="outline" size="sm" onClick={exportCsv} disabled={!data}>
            <Download className="size-3.5" />
            Download CSV
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.print()} disabled={!data}>
            <Printer className="size-3.5" />
            Print / Save as PDF
          </Button>
        </div>
      </div>

      {error ? (
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
        {loading || !data
          ? Array.from({ length: 6 }).map((_, i) => <StatCardSkeleton key={i} />)
          : data.kpis.map((kpi) => <StatCard key={kpi.label} kpi={kpi} />)}
      </div>

      <ChartCard title="Vaccinations by state">
        {loading || !data ? (
          <Skeleton className="h-48 w-full" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>State</TableHead>
                <TableHead className="text-right">Vaccinations</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.byState.map((s) => (
                <TableRow key={s.state}>
                  <TableCell className="font-medium">{s.state}</TableCell>
                  <TableCell className="text-right">
                    {s.value.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </ChartCard>
    </div>
  );
}
