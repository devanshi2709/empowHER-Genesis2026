"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Accordion, AccordionItem, InlineNotification } from "@carbon/react";
import { ChartLine, Notebook, UserFollow } from "@carbon/icons-react";
import { PageLayout } from "@/components/layout/page-layout";
import { SectionCard } from "@/components/layout/section-card";
import { SummaryTile } from "@/components/layout/summary-tile";
import { EmptyState } from "@/components/states/empty-state";
import { ErrorState } from "@/components/states/error-state";
import { LoadingState } from "@/components/states/loading-state";
import { BenefitsSummary } from "@/components/referrals-benefits/benefits-summary";
import { BlockerChecklist } from "@/components/referrals-benefits/blocker-checklist";
import { PacketPreview } from "@/components/referrals-benefits/packet-preview";
import { ReferralOverview } from "@/components/referrals-benefits/referral-overview";
import { ReferralQueue } from "@/components/referrals-benefits/referral-queue";
import { Button } from "@/components/ui/button";
import { generateReferralsBenefits } from "@/lib/api";
import { useLiveCarePlan, useLiveHandoff } from "@/lib/live-handoff-store";
import type { CoordinationStatus, ReferralPayload } from "@/lib/live-types";

type ReferralViewState = "idle" | "loading" | "empty" | "error" | "live";

const statusPriority: CoordinationStatus[] = [
  "Needs documents",
  "Follow-up required",
  "Pending review",
  "Ready to send",
];

export default function ReferralsBenefitsPage() {
  const handoff = useLiveHandoff();
  const carePlan = useLiveCarePlan();
  const [viewState, setViewState] = useState<ReferralViewState>("idle");
  const [payload, setPayload] = useState<ReferralPayload | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const effectiveViewState: ReferralViewState =
    viewState === "idle" && !handoff && !carePlan ? "empty" : viewState;

  const currentStatus = useMemo(() => {
    if (!payload) return "Ready to send" as CoordinationStatus;
    for (const status of statusPriority) {
      if (payload.referralQueue.some((item) => item.status === status)) return status;
    }
    return "Ready to send";
  }, [payload]);

  const readyCount = useMemo(
    () => (payload ? payload.referralQueue.filter((item) => item.status === "Ready to send").length : 0),
    [payload],
  );

  const blockersCount = useMemo(
    () => (payload ? payload.blockerChecklist.filter((item) => !item.complete).length : 0),
    [payload],
  );

  async function loadReferrals() {
    if (!handoff && !carePlan) {
      setViewState("empty");
      return;
    }

    const hadPayload = payload !== null;
    try {
      setViewState("loading");
      setErrorMessage("");
      const live = await generateReferralsBenefits({ handoff, carePlan });
      setPayload(live);
      setViewState("live");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to load referrals workspace");
      if (hadPayload) {
        setViewState("live");
      } else {
        setViewState("error");
      }
    }
  }

  return (
    <PageLayout
      eyebrow="Referral Coordination"
      title="Referrals & Benefits Workspace"
      description="Prepare specialist handoffs, confirm benefits, and resolve blockers before submission."
      actions={
        <>
          <Button onClick={() => void loadReferrals()}>Refresh live workspace</Button>
          <Link href="/care-plan">
            <Button variant="outline">Back to Care Plan</Button>
          </Link>
        </>
      }
      meta={
        <>
          <SummaryTile
            label="Workflow context"
            value={handoff && carePlan ? "Complete context" : "Partial context"}
            helper="Referrals are strongest when transcript + plan context is available."
            icon={UserFollow}
            tone="blue"
            statusLabel={handoff && carePlan ? "Complete context" : "Partial context"}
            statusTone={handoff && carePlan ? "success" : "warning"}
          />
          <SummaryTile
            label="Coordination state"
            value={payload ? currentStatus : "Awaiting load"}
            helper="Primary state detected from current referral queue."
            icon={ChartLine}
            tone="purple"
            tagLabel={payload ? `${readyCount} ready` : "Not loaded"}
          />
          <SummaryTile
            label="Open blockers"
            value={payload ? `${blockersCount}` : "Not available"}
            helper="Resolve blockers to move packets to send-ready."
            icon={Notebook}
            tone="neutral"
            tagLabel="Action required"
          />
        </>
      }
    >
      {effectiveViewState === "idle" ? (
        <div className="empowher-surface p-5 md:p-6">
          <InlineNotification
            kind="info"
            lowContrast
            hideCloseButton
            title="Live handoff context detected"
            subtitle="Generate referrals and benefits workspace data from backend context."
            className="!max-w-none"
          />
        </div>
      ) : null}

      {effectiveViewState === "loading" ? (
        <LoadingState
          title="Refreshing referral coordination"
          description="Loading referral queue, benefits eligibility, and packet completeness checks."
        />
      ) : null}

      {effectiveViewState === "error" ? (
        <ErrorState
          title="Referral workspace unavailable"
          description={errorMessage || "Referral coordination data could not be loaded."}
          action={
            <Button size="sm" onClick={() => void loadReferrals()}>
              Retry referral workspace
            </Button>
          }
        />
      ) : null}

      {effectiveViewState === "empty" ? (
        <EmptyState
          title="No live care context found"
          description="Run Visit Scribe and Care Plan first, then return here."
          action={
            <Link href="/scribe">
              <Button>Start at Visit Scribe</Button>
            </Link>
          }
        />
      ) : null}

      {effectiveViewState === "live" && payload ? (
        <div className="space-y-6">
          {errorMessage ? (
            <InlineNotification
              kind="warning"
              lowContrast
              hideCloseButton
              title="Showing last successful referrals snapshot"
              subtitle={`Latest refresh failed: ${errorMessage}`}
              className="!max-w-none"
            />
          ) : null}

          <ReferralOverview
            patientName={payload.referralHeader.patientName}
            caseId={payload.referralHeader.caseId}
            clinician={payload.referralHeader.clinician}
            updatedAt={payload.referralHeader.updatedAt}
            context={payload.referralHeader.context}
            currentStatus={currentStatus}
            readyCount={readyCount}
            blockersCount={blockersCount}
          />

          <SectionCard
            title="Action Center"
            description="Use these actions to move referrals from review to finalized submission."
          >
            <div className="grid gap-3 md:grid-cols-2">
              <div className="empowher-surface-subtle p-3">
                <p className="mb-2 text-xs font-medium tracking-[0.04em] text-[#5e6b80] uppercase">Review Stage</p>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm">Review packet</Button>
                  <Button size="sm" variant="secondary">
                    Prepare authorization
                  </Button>
                </div>
              </div>
              <div className="empowher-surface-subtle p-3">
                <p className="mb-2 text-xs font-medium tracking-[0.04em] text-[#5e6b80] uppercase">Dispatch Stage</p>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="ghost">
                    Send to specialist
                  </Button>
                  <Button size="sm" variant="ghost">
                    Confirm patient follow-up
                  </Button>
                </div>
              </div>
            </div>
          </SectionCard>

          <section className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
            <ReferralQueue items={payload.referralQueue} />
            <PacketPreview sections={payload.packetPreview} />
          </section>

          <section className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
            <BenefitsSummary coverage={payload.coverageSnapshot} />
            <BlockerChecklist blockers={payload.blockerChecklist} />
          </section>

          <SectionCard title="Referral Guidance">
            <Accordion>
              <AccordionItem title="Prepare documents">
                Ensure visit summary, care plan draft, and symptom trend export are attached.
              </AccordionItem>
              <AccordionItem title="Validate benefits">
                Confirm prior authorization requirements and out-of-pocket details with the payer.
              </AccordionItem>
              <AccordionItem title="Close blockers">
                Assign owners for remaining blockers and set due dates before specialist handoff.
              </AccordionItem>
            </Accordion>
          </SectionCard>
        </div>
      ) : null}
    </PageLayout>
  );
}
