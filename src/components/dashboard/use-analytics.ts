"use client";

import * as React from "react";
import { useFilters } from "@/components/filters/filter-context";
import type { Filters } from "@/lib/types";

export function useAnalytics<T>(fetcher: (f: Filters) => Promise<T>) {
  const { filters } = useFilters();
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    fetcher(filters)
      .then((res) => active && setData(res))
      .catch(() => active && setError("Could not load data. Please try again."))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  return { data, loading, error };
}
