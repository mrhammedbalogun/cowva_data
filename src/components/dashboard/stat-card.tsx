import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Kpi } from "@/lib/types";
import { cn } from "@/lib/utils";

function formatValue(kpi: Kpi): string {
  if (kpi.format === "percent") return `${kpi.value}%`;
  return kpi.value.toLocaleString();
}

export function StatCard({ kpi }: { kpi: Kpi }) {
  const positive = (kpi.delta ?? 0) >= 0;
  return (
    <Card className="gap-0 p-4">
      <p className="text-xs text-muted-foreground">{kpi.label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight">
        {formatValue(kpi)}
      </p>
      <div className="mt-1 flex items-center gap-1.5 text-xs">
        {kpi.delta !== undefined ? (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 font-medium",
              positive ? "text-primary" : "text-destructive"
            )}
          >
            {positive ? (
              <ArrowUpRight className="size-3" />
            ) : (
              <ArrowDownRight className="size-3" />
            )}
            {Math.abs(kpi.delta)}%
          </span>
        ) : null}
        <span className="text-muted-foreground">
          {kpi.note ?? (kpi.delta !== undefined ? "vs prev. period" : "")}
        </span>
      </div>
    </Card>
  );
}

export function StatCardSkeleton() {
  return (
    <Card className="gap-0 p-4">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="mt-2 h-7 w-24" />
      <Skeleton className="mt-2 h-3 w-28" />
    </Card>
  );
}
