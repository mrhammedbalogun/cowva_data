"use client";

import * as React from "react";
import { useFilters } from "@/components/filters/filter-context";
import { getOverview } from "@/lib/api";
import type { OverviewData } from "@/lib/types";

export function useOverview() {
  const { filters } = useFilters();
  const [data, setData] = React.useState<OverviewData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    getOverview(filters)
      .then((res) => {
        if (active) setData(res);
      })
      .catch(() => {
        if (active) setError("Could not load data. Please try again.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [filters]);

  return { data, loading, error };
}
