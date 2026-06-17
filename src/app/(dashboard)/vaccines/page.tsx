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
import { getVaccines } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const CATEGORY_LABEL: Record<string, string> = {
  routine_immunisation: "Routine",
  catch_up: "Catch-up",
};

export default function VaccinesPage() {
  const { data, loading, error } = useAnalytics(getVaccines);
  const top = (data?.byVaccine ?? []).slice(0, 10);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Vaccines</h1>
        <p className="text-sm text-muted-foreground">
          Breakdown by vaccine and category.
        </p>
      </div>

      {error ? (
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard title="Top vaccines" className="lg:col-span-2">
          <div className="h-[340px] w-full">
            {loading || !data ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={top} layout="vertical" margin={{ left: 40, right: 16 }}>
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="vaccine"
                    tickLine={false}
                    axisLine={false}
                    width={180}
                    fontSize={11}
                    stroke="var(--muted-foreground)"
                  />
                  <Tooltip
                    cursor={{ fill: "var(--muted)" }}
                    contentStyle={{
                      background: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="value" fill="var(--chart-2)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </ChartCard>

        <ChartCard title="Category mix">
          {loading || !data ? (
            <Skeleton className="h-[200px] w-full" />
          ) : (
            <DonutChart
              data={[
                { name: "Routine", value: data.byVaccineCategory.routine },
                { name: "Catch-up", value: data.byVaccineCategory.catchUp },
              ]}
              colors={["var(--chart-1)", "var(--chart-4)"]}
            />
          )}
        </ChartCard>
      </div>

      <ChartCard title="All vaccines">
        {loading || !data ? (
          <Skeleton className="h-48 w-full" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vaccine</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Vaccinations</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.byVaccine.map((v) => (
                <TableRow key={v.vaccine}>
                  <TableCell className="font-medium">{v.vaccine}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {CATEGORY_LABEL[v.category] ?? v.category}
                  </TableCell>
                  <TableCell className="text-right">
                    {v.value.toLocaleString()}
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
