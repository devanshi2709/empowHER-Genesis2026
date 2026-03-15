"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { InlineNotification, Tile } from "@carbon/react";
import { ChartLine, Document, Notebook } from "@carbon/icons-react";
import { KpiCards } from "@/components/dashboard/kpi-cards";
import { PendingPlans } from "@/components/dashboard/pending-plans";
import { TodayWorklist } from "@/components/dashboard/today-worklist";
import { PageLayout } from "@/components/layout/page-layout";
import { SectionCard } from "@/components/layout/section-card";
import { SummaryTile } from "@/components/layout/summary-tile";
import { EmptyState } from "@/components/states/empty-state";
import { ErrorState } from "@/components/states/error-state";
import { LoadingState } from "@/components/states/loading-state";
import { AIOutputPanel } from "@/components/ui/ai-output-panel";
import { Button } from "@/components/ui/button";
import { generateDashboard } from "@/lib/api";
import { useLiveCarePlan, useLiveHandoff } from "@/lib/live-handoff-store";
import type { DashboardPayload } from "@/lib/live-types";

type DashboardViewState = "idle" | "loading" | "live" | "empty" | "error";

export default function ClinicDashboard() {
  const handoff = useLiveHandoff();
  const carePlan = useLiveCarePlan();
  const [viewState, setViewState] = useState<DashboardViewState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [data, setData] = useState<DashboardPayload | null>(null);
  const effectiveViewState: DashboardViewState =
    viewState === "idle" && !handoff && !carePlan ? "empty" : viewState;
  const hasData = useMemo(
    () => effectiveViewState === "live" && data !== null,
    [effectiveViewState, data],
  );

  async function loadDashboard() {
    if (!handoff && !carePlan) {
      setViewState("empty");
      return;
    }

    try {
      setViewState("loading");
      setErrorMessage("");
      const payload = await generateDashboard({ handoff, carePlan });
      setData(payload);
      setViewState("live");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to load dashboard data");
      if (data) {
        setViewState("live");
      } else {
        setViewState("error");
      }
    }
  }

  return (
    <PageLayout
      eyebrow="Clinic Home"
      title="Operations Dashboard"
      description="Monitor visit flow, care plan readiness, and referral blockers in one coordinated workspace."
      actions={
        <>
          <Button onClick={() => void loadDashboard()}>Refresh dashboard</Button>
          <Button as={Link} href="/scribe" variant="outline">Open Visit Scribe</Button>
        </>
      }
      meta={
        <>
          <SummaryTile
            label="Latest handoff"
            value={handoff ? new Date(handoff.savedAt).toLocaleString() : "No transcript captured"}
            helper="Transcript-derived context available for care workflow."
            icon={Document}
            tone="blue"
            statusLabel={handoff ? "Ready" : "Pending"}
            statusTone={handoff ? "success" : "warning"}
          />
          <SummaryTile
            label="Care plan snapshot"
            value={carePlan ? new Date(carePlan.savedAt).toLocaleString() : "No care plan generated"}
            helper="Draft generation state for clinician review."
            icon={Notebook}
            tone="purple"
            statusLabel={carePlan ? "Draft available" : "Needs generation"}
            statusTone={carePlan ? "info" : "warning"}
          />
          <SummaryTile
            label="Runtime mode"
            value="Live backend integration"
            helper="Dashboard payload is generated server-side from current workflow context."
            icon={ChartLine}
            tone="neutral"
            tagLabel="Validated response contract"
          />
        </>
      }
    >
      {effectiveViewState === "idle" ? (
        <Tile className="empowher-surface p-5">
          <InlineNotification
            kind="info"
            lowContrast
            hideCloseButton
            title="Live dashboard ready"
            subtitle="Generate dashboard data from your latest handoff and care-plan context."
            className="!max-w-none"
          />
        </Tile>
      ) : null}

      {effectiveViewState === "loading" ? (
        <LoadingState
          title="Refreshing clinic dashboard"
          description="Syncing visits, care plan backlog, and high-priority alerts."
        />
      ) : null}

      {effectiveViewState === "error" ? (
        <ErrorState
          title="Dashboard sync interrupted"
          description={errorMessage || "The clinic dashboard could not refresh."}
          action={
            <Button size="sm" onClick={() => void loadDashboard()}>
              Retry dashboard refresh
            </Button>
          }
        />
      ) : null}

      {effectiveViewState === "empty" ? (
        <EmptyState
          title="No live workflow context found"
          description="Start from Visit Scribe to create transcript handoff data, then return here."
          action={
            <Button as={Link} href="/scribe">Start live workflow</Button>
          }
        />
      ) : null}

      {hasData && data ? (
        <div className="space-y-6 md:space-y-7">
          {errorMessage ? (
            <InlineNotification
              kind="warning"
              lowContrast
              hideCloseButton
              title="Showing last successful dashboard snapshot"
              subtitle={`Latest refresh failed: ${errorMessage}`}
              className="!max-w-none"
            />
          ) : null}

          <KpiCards metrics={data.clinicMetrics} />

          <section className="grid gap-4 xl:grid-cols-[1.85fr_1fr]">
            <section className="space-y-4">
              <TodayWorklist visits={data.todayVisits} />
              <SectionCard
                title="Next Best Actions"
                description="Focus items based on current visit status and referral readiness."
              >
                <ul className="space-y-2 text-sm text-[#393939]">
                  <li className="empowher-surface-subtle px-3 py-2">Review any visit in “Ready for plan” status and finalize next-step language.</li>
                  <li className="empowher-surface-subtle px-3 py-2">Confirm referral packet completeness before specialist handoff.</li>
                  <li className="empowher-surface-subtle px-3 py-2">Validate all AI-generated summaries with clinician oversight.</li>
                </ul>
              </SectionCard>
            </section>
            <PendingPlans plans={data.pendingCarePlans} />
          </section>

          <section className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
            <SectionCard
              title="Coordination Alerts"
              description="Same-day tasks that need care-team or referral coordination."
            >
              {data.urgentAlerts.length === 0 ? (
                <p className="empowher-quiet-copy mt-4 text-sm">No urgent coordination alerts.</p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {data.urgentAlerts.map((alert) => (
                    <li key={alert.id}>
                      <InlineNotification
                        kind="warning"
                        lowContrast
                        hideCloseButton
                        title={alert.title}
                        subtitle={alert.detail}
                        className="!max-w-none"
                      />
                    </li>
                  ))}
                </ul>
              )}
            </SectionCard>

            <AIOutputPanel
              title="Latest AI Handoff"
              description="Transcript summary used to inform downstream planning."
              reviewed={false}
            >
              <p className="empowher-surface-subtle p-3 text-sm leading-6 text-[#161616]">
                {handoff?.insight || "No live handoff summary available yet."}
              </p>
              <p className="text-xs text-[#697077]">
                Source: {handoff?.extractionSource || "unknown"} | Symptoms: {handoff?.symptomTags.join(", ") || "none tagged"}
              </p>
            </AIOutputPanel>
          </section>
        </div>
      ) : null}
    </PageLayout>
  );
}
