import type { CoordinationStatus } from "@/lib/mock-referrals-benefits";
import { cn } from "@/lib/utils";

const statusTone: Record<CoordinationStatus, string> = {
  "Ready to send": "bg-emerald-100 text-emerald-700",
  "Needs documents": "bg-amber-100 text-amber-700",
  "Pending review": "bg-blue-100 text-blue-700",
  "Follow-up required": "bg-destructive/10 text-destructive",
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
    <section className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Referral Coordination</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight">Referrals and Benefits Workspace</h2>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            Prepare provider handoff packets, verify benefits coverage, and close blockers before specialist routing.
          </p>
        </div>
        <div className="rounded-lg border bg-muted/40 px-3 py-2 text-sm">
          <p className="font-medium">{patientName}</p>
          <p className="text-muted-foreground">{caseId}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 border-t pt-4 sm:grid-cols-3">
        <article className="rounded-lg border p-3">
          <p className="text-xs text-muted-foreground">Current coordination state</p>
          <p className={cn("mt-2 inline-flex rounded-full px-2 py-0.5 text-xs font-semibold", statusTone[currentStatus])}>
            {currentStatus}
          </p>
        </article>
        <article className="rounded-lg border p-3">
          <p className="text-xs text-muted-foreground">Referrals ready to send</p>
          <p className="mt-2 text-xl font-semibold">{readyCount}</p>
        </article>
        <article className="rounded-lg border p-3">
          <p className="text-xs text-muted-foreground">Open blockers</p>
          <p className="mt-2 text-xl font-semibold">{blockersCount}</p>
        </article>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        Context: {context} • Reviewed by {clinician} • Updated {updatedAt}
      </p>
    </section>
  );
}
