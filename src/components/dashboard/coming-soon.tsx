import { Construction } from "lucide-react";

export function ComingSoon({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed bg-muted/20 p-12 text-center">
        <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Construction className="size-5" />
        </div>
        <p className="text-sm font-medium">This view is on the way</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          The filters above already work across the platform. Detailed charts
          for this section arrive in the next build stage.
        </p>
      </div>
    </div>
  );
}
