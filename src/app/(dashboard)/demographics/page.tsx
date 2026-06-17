"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartCard } from "@/components/dashboard/chart-card";
import { DonutChart } from "@/components/dashboard/donut-chart";
import { useAnalytics } from "@/components/dashboard/use-analytics";
import { getDemographics } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

export default function DemographicsPage() {
  const { data, loading, error } = useAnalytics(getDemographics);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Demographics</h1>
        <p className="text-sm text-muted-foreground">
          Age distribution, gender, and pregnancy status of patients reached.
        </p>
      </div>

      {error ? (
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <ChartCard title="Age distribution (patients)">
        <div className="h-[280px] w-full">
          {loading || !data ? (
            <Skeleton className="h-full w-full" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.ageBands} margin={{ left: -16, right: 8, top: 8 }}>
                <XAxis dataKey="band" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                <YAxis tickLine={false} axisLine={false} fontSize={12} width={48} stroke="var(--muted-foreground)" />
                <Tooltip
                  cursor={{ fill: "var(--muted)" }}
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="value" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </ChartCard>

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
              colors={["var(--chart-3)", "var(--chart-5)"]}
            />
          )}
        </ChartCard>

        <ChartCard title="Pregnancy status (where recorded)">
          {loading || !data ? (
            <Skeleton className="h-[200px] w-full" />
          ) : (
            <DonutChart
              data={[
                { name: "Pregnant", value: data.pregnancy.pregnant },
                { name: "Not pregnant", value: data.pregnancy.nonPregnant },
              ]}
              colors={["var(--chart-4)", "var(--chart-1)"]}
            />
          )}
        </ChartCard>
      </div>
    </div>
  );
}
