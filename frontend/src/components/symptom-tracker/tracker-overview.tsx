import { Tag, Tile } from "@carbon/react";
import type { TrackerState } from "@/lib/live-types";

const stateTone: Record<TrackerState, "blue" | "green" | "warm-gray" | "red"> = {
  Active: "blue",
  Improving: "green",
  Worsening: "warm-gray",
  "Follow-up needed": "red",
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
    <Tile className="empowher-surface p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[#525252]">Case Snapshot</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-[#161616]">
            Symptom Status Overview
          </h2>
          <p className="empowher-quiet-copy mt-2 max-w-3xl text-sm">
            Trend summary across pelvic pain, bleeding changes, menopause or postpartum symptoms, and treatment tolerance.
          </p>
        </div>
        <div className="empowher-surface-subtle px-3 py-2 text-sm">
          <p className="font-medium text-[#161616]">{patientName}</p>
          <p className="text-[#525252]">{careContext}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 border-t pt-4 sm:grid-cols-3">
        <article className="empowher-surface-subtle p-3">
          <p className="text-xs text-[#525252]">Current tracker state</p>
          <p className="mt-2"><Tag type={stateTone[currentState]}>{currentState}</Tag></p>
        </article>
        <article className="empowher-surface-subtle p-3">
          <p className="text-xs text-[#525252]">7-day average severity</p>
          <p className="mt-2 text-xl font-semibold text-[#161616]">{avgSeverity.toFixed(1)} / 10</p>
        </article>
        <article className="empowher-surface-subtle p-3">
          <p className="text-xs text-[#525252]">High-risk events (severity 7+)</p>
          <p className="mt-2 text-xl font-semibold text-[#161616]">{highRiskCount}</p>
        </article>
      </div>

      <p className="mt-3 text-xs text-[#525252]">Reviewed by {clinician} • Updated {lastUpdated}</p>
    </Tile>
  );
}
