"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { StatCard, StatCardSkeleton } from "@/components/dashboard/stat-card";
import { ChartCard } from "@/components/dashboard/chart-card";
import { FacilitiesTable } from "@/components/dashboard/facilities-table";
import { useOverview } from "@/components/dashboard/use-overview";
import { Skeleton } from "@/components/ui/skeleton";

const STATE_COLOR = "var(--chart-2)";
const TREND_COLOR = "var(--chart-1)";
const GENDER_COLORS = ["var(--chart-3)", "var(--chart-5)"];
const CATEGORY_COLORS = ["var(--chart-1)", "var(--chart-4)"];

function nf(n: number) {
  return n.toLocaleString();
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; name?: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border bg-popover px-2.5 py-1.5 text-xs shadow-md">
      {label ? <p className="font-medium">{label}</p> : null}
      <p className="text-muted-foreground">{nf(payload[0].value)} vaccinations</p>
    </div>
  );
}

export default function OverviewPage() {
  const { data, loading, error } = useOverview();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground">
          Vaccination impact across states, facilities, and vaccines.
        </p>
      </div>

      {error ? (
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
        {loading || !data
          ? Array.from({ length: 6 }).map((_, i) => <StatCardSkeleton key={i} />)
          : data.kpis.map((kpi) => <StatCard key={kpi.label} kpi={kpi} />)}
      </div>

      {/* Trend */}
      <ChartCard title="Vaccinations over time">
        <div className="h-[260px] w-full">
          {loading || !data ? (
            <Skeleton className="h-full w-full" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.timeSeries} margin={{ left: -16, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={TREND_COLOR} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={TREND_COLOR} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  stroke="var(--muted-foreground)"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  width={48}
                  stroke="var(--muted-foreground)"
                />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={TREND_COLOR}
                  strokeWidth={2}
                  fill="url(#trendFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </ChartCard>

      {/* By state */}
      <ChartCard title="Vaccinations by state">
        <div className="h-[300px] w-full">
          {loading || !data ? (
            <Skeleton className="h-full w-full" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.byState}
                layout="vertical"
                margin={{ left: 24, right: 16 }}
              >
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="state"
                  tickLine={false}
                  axisLine={false}
                  width={90}
                  fontSize={12}
                  stroke="var(--muted-foreground)"
                />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--muted)" }} />
                <Bar dataKey="value" fill={STATE_COLOR} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </ChartCard>

      {/* Donuts */}
      <div className="grid gap-4 md:grid-cols-2">
        <ChartCard title="Gender split">
          {loading || !data ? (
            <Skeleton className="h-[200px] w-full" />
          ) : (
            <DonutChart
              data={[
                { name: "Male", value: data.genderSplit.male },
                { name: "Female", value: data.genderSplit.female },
              ]}
              colors={GENDER_COLORS}
            />
          )}
        </ChartCard>

        <ChartCard title="Vaccine category">
          {loading || !data ? (
            <Skeleton className="h-[200px] w-full" />
          ) : (
            <DonutChart
              data={[
                { name: "Routine", value: data.byVaccineCategory.routine },
                { name: "Catch-up", value: data.byVaccineCategory.catchUp },
              ]}
              colors={CATEGORY_COLORS}
            />
          )}
        </ChartCard>
      </div>

      {/* Facilities */}
      <ChartCard title="Top health facilities">
        {loading || !data ? (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-full" />
            ))}
          </div>
        ) : (
          <FacilitiesTable rows={data.topFacilities} />
        )}
      </ChartCard>
    </div>
  );
}

function DonutChart({
  data,
  colors,
}: {
  data: { name: string; value: number }[];
  colors: string[];
}) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  return (
    <div className="flex items-center gap-4">
      <div className="h-[180px] w-[180px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={52}
              outerRadius={80}
              paddingAngle={2}
              strokeWidth={0}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={colors[i % colors.length]} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="space-y-2 text-sm">
        {data.map((d, i) => (
          <li key={d.name} className="flex items-center gap-2">
            <span
              className="size-2.5 rounded-[3px]"
              style={{ background: colors[i % colors.length] }}
            />
            <span className="text-muted-foreground">{d.name}</span>
            <span className="font-medium">
              {Math.round((d.value / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
