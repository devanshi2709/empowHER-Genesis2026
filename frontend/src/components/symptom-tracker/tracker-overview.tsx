import type { TrackerState } from "@/lib/mock-symptom-tracker";
import { cn } from "@/lib/utils";

const stateTone: Record<TrackerState, string> = {
  Active: "bg-blue-100 text-blue-700",
  Improving: "bg-emerald-100 text-emerald-700",
  Worsening: "bg-amber-100 text-amber-700",
  "Follow-up needed": "bg-destructive/10 text-destructive",
};

type TrackerOverviewProps = {
  patientName: string;
  careContext: string;
  clinician: string;
  lastUpdated: string;
  currentState: TrackerState;
  avgSeverity: number;
  highRiskCount: number;
};

export function TrackerOverview({
  patientName,
  careContext,
  clinician,
  lastUpdated,
  currentState,
  avgSeverity,
  highRiskCount,
}: TrackerOverviewProps) {
  return (
    <section className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Symptom Tracking</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight">Gynecology Symptom Tracker</h2>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            Track pelvic pain, bleeding changes, menopause/postpartum symptoms, and medication tolerance over time.
          </p>
        </div>
        <div className="rounded-lg border bg-muted/40 px-3 py-2 text-sm">
          <p className="font-medium">{patientName}</p>
          <p className="text-muted-foreground">{careContext}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 border-t pt-4 sm:grid-cols-3">
        <article className="rounded-lg border p-3">
          <p className="text-xs text-muted-foreground">Current tracker state</p>
          <p className={cn("mt-2 inline-flex rounded-full px-2 py-0.5 text-xs font-semibold", stateTone[currentState])}>
            {currentState}
          </p>
        </article>
        <article className="rounded-lg border p-3">
          <p className="text-xs text-muted-foreground">7-day average severity</p>
          <p className="mt-2 text-xl font-semibold">{avgSeverity.toFixed(1)} / 10</p>
        </article>
        <article className="rounded-lg border p-3">
          <p className="text-xs text-muted-foreground">High-risk events (severity 7+)</p>
          <p className="mt-2 text-xl font-semibold">{highRiskCount}</p>
        </article>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">Reviewed by {clinician} • Updated {lastUpdated}</p>
    </section>
  );
}
