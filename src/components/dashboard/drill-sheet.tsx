"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";

export type DrillItem = { label: string; value: number; sub?: string };

export function DrillSheet({
  open,
  onOpenChange,
  title,
  subtitle,
  unit,
  loading,
  items,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  subtitle?: string;
  unit: string;
  loading: boolean;
  items: DrillItem[];
}) {
  const max = Math.max(1, ...items.map((i) => i.value));

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[92vw] gap-0 sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="truncate">{title}</SheetTitle>
          {subtitle ? <SheetDescription>{subtitle}</SheetDescription> : null}
        </SheetHeader>

        <div className="space-y-3 overflow-y-auto p-4">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))
          ) : items.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No {unit} for the selected filters.
            </p>
          ) : (
            items.map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="truncate font-medium">{item.label}</span>
                  <span className="shrink-0 tabular-nums">
                    {item.value.toLocaleString()}
                    {item.sub ? (
                      <span className="ml-2 text-xs text-muted-foreground">
                        {item.sub}
                      </span>
                    ) : null}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${(item.value / max) * 100}%` }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
