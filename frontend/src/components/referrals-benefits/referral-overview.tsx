import { Tag, Tile } from "@carbon/react";
import type { CoordinationStatus } from "@/lib/live-types";

const statusTone: Record<CoordinationStatus, "green" | "warm-gray" | "blue" | "red"> = {
  "Ready to send": "green",
  "Needs documents": "warm-gray",
  "Pending review": "blue",
  "Follow-up required": "red",
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
    <Tile className="empowher-surface p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[#525252]">Case Snapshot</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-[#161616]">
            Referral Coordination Status
          </h2>
          <p className="empowher-quiet-copy mt-2 max-w-3xl text-sm">
            Track readiness, coverage checks, and unresolved blockers before specialist handoff.
          </p>
        </div>
        <div className="empowher-surface-subtle px-3 py-2 text-sm">
          <p className="font-medium text-[#161616]">{patientName}</p>
          <p className="text-[#525252]">{caseId}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 border-t pt-4 sm:grid-cols-3">
        <article className="empowher-surface-subtle p-3">
          <p className="text-xs text-[#525252]">Current coordination state</p>
          <p className="mt-2"><Tag type={statusTone[currentStatus]}>{currentStatus}</Tag></p>
        </article>
        <article className="empowher-surface-subtle p-3">
          <p className="text-xs text-[#525252]">Referrals ready to send</p>
          <p className="mt-2 text-xl font-semibold text-[#161616]">{readyCount}</p>
        </article>
        <article className="empowher-surface-subtle p-3">
          <p className="text-xs text-[#525252]">Open blockers</p>
          <p className="mt-2 text-xl font-semibold text-[#161616]">{blockersCount}</p>
        </article>
      </div>

      <p className="mt-3 text-xs text-[#525252]">
        Context: {context} • Reviewed by {clinician} • Updated {updatedAt}
      </p>
    </Tile>
  );
}
