import { Syringe } from "lucide-react";

export function Brand({ subtitle }: { subtitle?: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Syringe className="size-4.5" />
      </div>
      <div className="leading-tight">
        <div className="text-sm font-semibold tracking-tight">Cowva Impact</div>
        {subtitle ? (
          <div className="text-xs text-muted-foreground">{subtitle}</div>
        ) : null}
      </div>
    </div>
  );
}
