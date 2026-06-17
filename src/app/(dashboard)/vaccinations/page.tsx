"use client";

import {
  Area,
  AreaChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartCard } from "@/components/dashboard/chart-card";
import { StatCard, StatCardSkeleton } from "@/components/dashboard/stat-card";
import { useAnalytics } from "@/components/dashboard/use-analytics";
import { getVaccinations } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

const tooltipStyle = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  fontSize: 12,
};

export default function VaccinationsPage() {
  const { data, loading, error } = useAnalytics(getVaccinations);

  const kpis = data
    ? [
        { label: "Total vaccinations", value: data.totals.total, format: "number" as const },
        { label: "Completed", value: data.totals.complete, format: "number" as const },
        { label: "In progress", value: data.totals.incomplete, format: "number" as const },
      ]
    : [];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Vaccinations</h1>
        <p className="text-sm text-muted-foreground">
          Trends and completion over time.
        </p>
      </div>

      {error ? (
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {loading || !data
          ? Array.from({ length: 3 }).map((_, i) => <StatCardSkeleton key={i} />)
          : kpis.map((k) => <StatCard key={k.label} kpi={k} />)}
      </div>

      <ChartCard title="Vaccinations over time">
        <div className="h-[260px] w-full">
          {loading || !data ? (
            <Skeleton className="h-full w-full" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.timeSeries} margin={{ left: -16, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="vaxFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                <YAxis tickLine={false} axisLine={false} fontSize={12} width={48} stroke="var(--muted-foreground)" />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="value" stroke="var(--chart-1)" strokeWidth={2} fill="url(#vaxFill)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </ChartCard>

      <ChartCard title="Completion rate over time (%)">
        <div className="h-[220px] w-full">
          {loading || !data ? (
            <Skeleton className="h-full w-full" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.completionSeries} margin={{ left: -16, right: 8, top: 8 }}>
                <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                <YAxis tickLine={false} axisLine={false} fontSize={12} width={48} domain={[0, 100]} stroke="var(--muted-foreground)" />
                <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${value}%`, "Completion"]} />
                <Line type="monotone" dataKey="value" stroke="var(--chart-2)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </ChartCard>
    </div>
  );
}
