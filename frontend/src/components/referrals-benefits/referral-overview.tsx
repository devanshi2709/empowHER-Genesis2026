import { StatusTag } from "@/components/ui/status-tag";
import type { CoordinationStatus } from "@/lib/live-types";

const statusTone: Record<CoordinationStatus, "success" | "neutral" | "info" | "danger"> = {
  "Ready to send":      "success",
  "Needs documents":    "neutral",
  "Pending review":     "info",
  "Follow-up required": "danger",
};

type ReferralOverviewProps = {
  patientName: string;
  caseId: string;
  clinician: string;
  updatedAt: string;
  context: string;
  currentStatus: CoordinationStatus;
  readyCount: number;
  blockersCount: number;
};

export function ReferralOverview({
  patientName,
  caseId,
  clinician,
  updatedAt,
  context,
  currentStatus,
  readyCount,
  blockersCount,
}: ReferralOverviewProps) {
  return (
    <div className="empowher-section-card p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium tracking-wide text-[#64748b] uppercase">Case Snapshot</p>
          <h2 className="mt-1.5 text-xl font-semibold tracking-tight text-[#0f172a]">
            Referral Coordination Status
          </h2>
          <p className="empowher-quiet-copy mt-2 max-w-3xl text-sm">
            Track readiness, coverage checks, and unresolved blockers before specialist handoff.
          </p>
        </div>
        <div className="empowher-surface-subtle rounded-[8px] px-3 py-2 text-sm">
          <p className="font-semibold text-[#0f172a]">{patientName}</p>
          <p className="text-[#64748b]">{caseId}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 border-t border-[#e2e8f0] pt-4 sm:grid-cols-3">
        <article className="empowher-surface-subtle rounded-[8px] p-3">
          <p className="text-xs text-[#64748b]">Current coordination state</p>
          <div className="mt-2">
            <StatusTag label={currentStatus} tone={statusTone[currentStatus]} />
          </div>
        </article>
        <article className="empowher-surface-subtle rounded-[8px] p-3">
          <p className="text-xs text-[#64748b]">Referrals ready to send</p>
          <p className="mt-2 text-xl font-bold text-[#0f172a]">{readyCount}</p>
        </article>
        <article className="empowher-surface-subtle rounded-[8px] p-3">
          <p className="text-xs text-[#64748b]">Open blockers</p>
          <p className="mt-2 text-xl font-bold text-[#0f172a]">{blockersCount}</p>
        </article>
      </div>

      <p className="mt-3 text-xs text-[#94a3b8]">
        {context} · Reviewed by {clinician} · Updated {updatedAt}
      </p>
    </div>
  );
}
