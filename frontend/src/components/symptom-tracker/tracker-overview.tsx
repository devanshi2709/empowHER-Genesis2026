import { StatusTag } from "@/components/ui/status-tag";
import type { TrackerState } from "@/lib/live-types";

const stateTone: Record<TrackerState, "info" | "success" | "neutral" | "danger"> = {
  Active:            "info",
  Improving:         "success",
  Worsening:         "neutral",
  "Follow-up needed": "danger",
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
    <div className="empowher-section-card p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium tracking-wide text-[#64748b] uppercase">Case Snapshot</p>
          <h2 className="mt-1.5 text-xl font-semibold tracking-tight text-[#0f172a]">
            Symptom Status Overview
          </h2>
          <p className="empowher-quiet-copy mt-2 max-w-3xl text-sm">
            Trend summary across pelvic pain, bleeding changes, menopause or postpartum symptoms, and treatment tolerance.
          </p>
        </div>
        <div className="empowher-surface-subtle rounded-[8px] px-3 py-2 text-sm">
          <p className="font-semibold text-[#0f172a]">{patientName}</p>
          <p className="text-[#64748b]">{careContext}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 border-t border-[#e2e8f0] pt-4 sm:grid-cols-3">
        <article className="empowher-surface-subtle rounded-[8px] p-3">
          <p className="text-xs text-[#64748b]">Current tracker state</p>
          <div className="mt-2">
            <StatusTag label={currentState} tone={stateTone[currentState]} />
          </div>
        </article>
        <article className="empowher-surface-subtle rounded-[8px] p-3">
          <p className="text-xs text-[#64748b]">7-day average severity</p>
          <p className="mt-2 text-xl font-bold text-[#0f172a]">{avgSeverity.toFixed(1)}<span className="text-sm font-normal text-[#64748b]"> / 10</span></p>
        </article>
        <article className="empowher-surface-subtle rounded-[8px] p-3">
          <p className="text-xs text-[#64748b]">High-risk events (severity 7+)</p>
          <p className="mt-2 text-xl font-bold text-[#0f172a]">{highRiskCount}</p>
        </article>
      </div>

      <p className="mt-3 text-xs text-[#94a3b8]">Reviewed by {clinician} · Updated {lastUpdated}</p>
    </div>
  );
}
