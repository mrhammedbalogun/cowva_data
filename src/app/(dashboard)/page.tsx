export default function OverviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground">
          Vaccination impact across states, facilities, and vaccines.
        </p>
      </div>

      <div className="rounded-lg border bg-card p-8 text-center text-sm text-muted-foreground">
        Dashboard shell ready. KPIs, filters, and charts arrive in the next
        stage.
      </div>
    </div>
  );
}
