"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/states/empty-state";
import { ErrorState } from "@/components/states/error-state";
import { LoadingState } from "@/components/states/loading-state";
import { DemoModeToggle } from "@/components/states/demo-mode-toggle";
import { BenefitsSummary } from "@/components/referrals-benefits/benefits-summary";
import { BlockerChecklist } from "@/components/referrals-benefits/blocker-checklist";
import { PacketPreview } from "@/components/referrals-benefits/packet-preview";
import { ReferralOverview } from "@/components/referrals-benefits/referral-overview";
import { ReferralQueue } from "@/components/referrals-benefits/referral-queue";
import { DemoFlow } from "@/components/shell/demo-flow";
import {
  blockerChecklist,
  coverageSnapshot,
  referralHeader,
  referralQueue,
  type CoordinationStatus,
  packetPreview,
} from "@/lib/mock-referrals-benefits";

type ReferralViewState = "live" | "loading" | "empty" | "error" | "success";

const statusPriority: CoordinationStatus[] = [
  "Needs documents",
  "Follow-up required",
  "Pending review",
  "Ready to send",
];

export default function ReferralsBenefitsPage() {
  const [viewState, setViewState] = useState<ReferralViewState>("live");

  const currentStatus = useMemo(() => {
    for (const status of statusPriority) {
      if (referralQueue.some((item) => item.status === status)) return status;
    }
    return "Ready to send";
  }, []);

  const readyCount = useMemo(
    () => referralQueue.filter((item) => item.status === "Ready to send").length,
    [],
  );

  const blockersCount = useMemo(
    () => blockerChecklist.filter((item) => !item.complete).length,
    [],
  );

  const showWorkspace = viewState === "live" || viewState === "success";

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <ReferralOverview
        patientName={referralHeader.patientName}
        caseId={referralHeader.caseId}
        clinician={referralHeader.clinician}
        updatedAt={referralHeader.updatedAt}
        context={referralHeader.context}
        currentStatus={currentStatus}
        readyCount={readyCount}
        blockersCount={blockersCount}
      />

      <DemoFlow current="referrals-benefits" />

      <DemoModeToggle
        active={viewState}
        onChange={setViewState}
        options={[
          { key: "live", label: "Live" },
          { key: "loading", label: "Loading" },
          { key: "empty", label: "Empty" },
          { key: "error", label: "Error" },
          { key: "success", label: "Success" },
        ]}
      />

      {viewState === "loading" ? (
        <LoadingState
          title="Refreshing referral coordination"
          description="Loading referral queue, benefits eligibility, and packet completeness checks."
        />
      ) : null}

      {viewState === "error" ? (
        <ErrorState
          title="Referral workspace unavailable"
          description="Referral coordination data could not be loaded. Retry to continue handoff preparation."
          action={<Button size="sm" onClick={() => setViewState("live")}>Retry referral workspace</Button>}
        />
      ) : null}

      {viewState === "empty" ? (
        <EmptyState
          title="No active referrals in queue"
          description="Create a specialist referral or imaging requisition to begin clinic handoff coordination."
          action={<Button onClick={() => setViewState("live")}>Load demo referrals</Button>}
        />
      ) : null}

      {showWorkspace ? (
        <>
          {viewState === "success" ? (
            <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
              <p className="text-sm font-semibold text-emerald-800">Packet handoff complete</p>
              <h3 className="mt-1 text-lg font-semibold tracking-tight text-emerald-900">Referral package marked ready for secure send</h3>
              <p className="mt-2 text-sm text-emerald-900/90">
                Clinic coordination notes and benefits snapshot are finalized for front-desk follow-through.
              </p>
              <div className="mt-3">
                <Link href="/">
                  <Button size="sm">Return to Dashboard</Button>
                </Link>
              </div>
            </section>
          ) : null}

          <section className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
            <ReferralQueue items={referralQueue} />
            <PacketPreview sections={packetPreview} />
          </section>

          <section className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
            <BenefitsSummary coverage={coverageSnapshot} />
            <BlockerChecklist blockers={blockerChecklist} />
          </section>
        </>
      ) : null}
    </div>
  );
}
