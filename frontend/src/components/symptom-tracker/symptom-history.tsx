import { StatusTag } from "@/components/ui/status-tag";
import type { SymptomLogEntry, TrackerState } from "@/lib/live-types";

const stateTone: Record<TrackerState, "info" | "success" | "neutral" | "danger"> = {
  Active:            "info",
  Improving:         "success",
  Worsening:         "neutral",
  "Follow-up needed": "danger",
};

export function SymptomHistory({ entries }: { entries: SymptomLogEntry[] }) {
  return (
    <div className="empowher-section-card p-6">
      <h3 className="text-base font-semibold tracking-tight text-[#0f172a]">Symptom Log History</h3>
      <p className="empowher-quiet-copy mt-1 text-sm">
        Visit-ready symptom notes with severity, state assessment, and recommended next action.
      </p>

      <ul className="mt-4 space-y-2.5">
        {entries.map((entry) => (
          <li key={entry.id} className="empowher-surface-subtle rounded-[8px] p-4 transition-colors hover:bg-[#eff6ff]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-medium text-[#0f172a] text-sm">{entry.category}</p>
                <p className="text-xs text-[#64748b]">{entry.id} · {entry.date}</p>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="inline-flex items-center rounded-full border border-[#e2e8f0] bg-[#f8fafc] px-2.5 py-0.5 text-xs font-medium text-[#475569]">
                  Severity {entry.severity}/10
                </span>
                <StatusTag label={entry.state} tone={stateTone[entry.state]} />
              </div>
            </div>
            <p className="mt-2.5 text-sm text-[#334155]">{entry.notes}</p>
            <p className="mt-1.5 text-xs text-[#64748b]">
              <span className="font-medium">Action:</span> {entry.action}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
