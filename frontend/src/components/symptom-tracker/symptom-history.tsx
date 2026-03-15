import type { SymptomLogEntry, TrackerState } from "@/lib/mock-symptom-tracker";
import { cn } from "@/lib/utils";

const stateTone: Record<TrackerState, string> = {
  Active: "bg-blue-100 text-blue-700",
  Improving: "bg-emerald-100 text-emerald-700",
  Worsening: "bg-amber-100 text-amber-700",
  "Follow-up needed": "bg-destructive/10 text-destructive",
};

export function SymptomHistory({ entries }: { entries: SymptomLogEntry[] }) {
  return (
    <section className="rounded-xl border bg-card p-6 shadow-sm">
      <h3 className="text-lg font-semibold tracking-tight">Symptom Log History</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Visit-ready symptom notes with severity, state assessment, and recommended next action.
      </p>

      <ul className="mt-4 space-y-3">
        {entries.map((entry) => (
          <li key={entry.id} className="rounded-lg border p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-medium">{entry.category}</p>
                <p className="text-xs text-muted-foreground">{entry.id} • {entry.date}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold">
                  Severity {entry.severity}/10
                </span>
                <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", stateTone[entry.state])}>
                  {entry.state}
                </span>
              </div>
            </div>
            <p className="mt-3 text-sm">{entry.notes}</p>
            <p className="mt-2 text-xs text-muted-foreground">Action: {entry.action}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
