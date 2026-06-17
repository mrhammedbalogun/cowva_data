"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

function DonutTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { name?: string; value: number }[];
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border bg-popover px-2.5 py-1.5 text-xs shadow-md">
      <span className="font-medium">{payload[0].name}: </span>
      <span className="text-muted-foreground">
        {payload[0].value.toLocaleString()}
      </span>
    </div>
  );
}

export function DonutChart({
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
            <Tooltip content={<DonutTooltip />} />
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
