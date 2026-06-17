"use client";

import * as React from "react";
import { geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";

// Topojson state name -> Cowva DB state name (only mismatch is FCT).
const ALIAS: Record<string, string> = {
  "Federal Capital Territory": "FCT - Abuja",
  Nassarawa: "Nasarawa",
};

const WIDTH = 560;
const HEIGHT = 540;

type Shape = { d: string | null; name: string; value: number };

// Opacity tint of the Cowva blue so high-volume states stand out in BOTH
// light and dark mode (0-value states fall back to the neutral muted token).
function tintFor(value: number, max: number): { fill: string; opacity: number } {
  if (value <= 0) return { fill: "var(--muted)", opacity: 1 };
  const t = Math.sqrt(value / max);
  return { fill: "#1788c7", opacity: 0.2 + 0.8 * t };
}

export function NigeriaMap({ values }: { values: Record<string, number> }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [geo, setGeo] = React.useState<any>(null);
  const [hover, setHover] = React.useState<{
    name: string;
    value: number;
    x: number;
    y: number;
  } | null>(null);
  const wrapRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    let active = true;
    fetch("/nigeria-states.topo.json")
      .then((r) => r.json())
      .then((topo) => {
        if (active) setGeo(feature(topo, topo.objects.nga));
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const { shapes, max } = React.useMemo(() => {
    if (!geo) return { shapes: [] as Shape[], max: 0 };
    const projection = geoMercator().fitSize([WIDTH, HEIGHT], geo);
    const path = geoPath(projection);
    const max = Math.max(1, ...Object.values(values));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const shapes: Shape[] = geo.features.map((f: any) => {
      const raw = f.properties?.name as string;
      const name = ALIAS[raw] ?? raw;
      return { d: path(f), name, value: values[name] ?? 0 };
    });
    return { shapes, max };
  }, [geo, values]);

  return (
    <div ref={wrapRef} className="relative w-full">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="h-auto w-full"
        role="img"
        aria-label="Map of Nigeria shaded by vaccination volume per state"
        onMouseLeave={() => setHover(null)}
      >
        {shapes.map((s) => {
          const tint = tintFor(s.value, max);
          return (
          <path
            key={s.name}
            d={s.d ?? undefined}
            fill={tint.fill}
            fillOpacity={tint.opacity}
            stroke="var(--background)"
            strokeWidth={0.6}
            onMouseMove={(e) => {
              const rect = wrapRef.current?.getBoundingClientRect();
              setHover({
                name: s.name,
                value: s.value,
                x: e.clientX - (rect?.left ?? 0),
                y: e.clientY - (rect?.top ?? 0),
              });
            }}
          />
          );
        })}
      </svg>
      {hover ? (
        <div
          className="pointer-events-none absolute z-10 rounded-md border bg-popover px-2.5 py-1.5 text-xs shadow-md"
          style={{
            left: Math.min(hover.x + 12, WIDTH - 80),
            top: hover.y + 12,
          }}
        >
          <div className="font-medium">{hover.name}</div>
          <div className="text-muted-foreground">
            {hover.value.toLocaleString()} vaccinations
          </div>
        </div>
      ) : null}
    </div>
  );
}
