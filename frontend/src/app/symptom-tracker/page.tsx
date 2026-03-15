"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  InlineNotification,
  ProgressIndicator,
  ProgressStep,
  Select,
  SelectItem,
  TextArea,
  TextInput,
} from "@carbon/react";
import { ChartLine, WatsonHealth3DMprToggle, UserFollow } from "@carbon/icons-react";
import { PageLayout } from "@/components/layout/page-layout";
import { SectionCard } from "@/components/layout/section-card";
import { SummaryTile } from "@/components/layout/summary-tile";
import { EmptyState } from "@/components/states/empty-state";
import { ErrorState } from "@/components/states/error-state";
import { LoadingState } from "@/components/states/loading-state";
import { SymptomHistory } from "@/components/symptom-tracker/symptom-history";
import { TrackerOverview } from "@/components/symptom-tracker/tracker-overview";
import { Button } from "@/components/ui/button";
import { generateSymptomTracker } from "@/lib/api";
import { useLiveHandoff } from "@/lib/live-handoff-store";
import type { TrackerPayload, TrackerState } from "@/lib/live-types";

type TrackerViewState = "idle" | "loading" | "empty" | "error" | "live";

const statePriority: TrackerState[] = ["Follow-up needed", "Worsening", "Active", "Improving"];

const SeverityTrendChart = dynamic(
  () =>
    import("@/components/symptom-tracker/severity-trend-chart").then(
      (module) => module.SeverityTrendChart,
    ),
  { ssr: false },
);

export default function SymptomTrackerPage() {
  const handoff = useLiveHandoff();
  const [viewState, setViewState] = useState<TrackerViewState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [payload, setPayload] = useState<TrackerPayload | null>(null);
  const [followUpWindow, setFollowUpWindow] = useState("48-72h");
  const [medicationPlan, setMedicationPlan] = useState("");
  const [reviewNotes, setReviewNotes] = useState("");
  const [reviewSaved, setReviewSaved] = useState(false);
  const effectiveViewState: TrackerViewState = viewState === "idle" && !handoff ? "empty" : viewState;

  const avgSeverity = useMemo(
    () =>
      payload
        ? payload.trendSeries.reduce((sum, day) => sum + day.pelvicPain, 0) / payload.trendSeries.length
        : 0,
    [payload],
  );

  const highRiskCount = useMemo(
    () => (payload ? payload.symptomLog.filter((entry) => entry.severity >= 7).length : 0),
    [payload],
  );

  const currentState = useMemo(() => {
    if (!payload) return "Active" as TrackerState;
    for (const state of statePriority) {
      if (payload.symptomLog.some((entry) => entry.state === state)) return state;
    }
    return "Active";
  }, [payload]);

  const progressIndex = useMemo(() => {
    if (!payload) return 0;
    if (currentState === "Follow-up needed" || currentState === "Worsening") return 2;
    return 1;
  }, [payload, currentState]);

  async function loadTracker() {
    if (!handoff) {
      setViewState("empty");
      return;
    }

    const hadPayload = payload !== null;
    try {
      setViewState("loading");
      setErrorMessage("");
      const live = await generateSymptomTracker({ handoff });
      setPayload(live);
      setViewState("live");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to load symptom tracker");
      if (hadPayload) {
        setViewState("live");
      } else {
        setViewState("error");
      }
    }
  }

  function handleSaveReview(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setReviewSaved(true);
  }

  return (
    <PageLayout
      eyebrow="Symptom Monitoring"
      title="Symptom Tracker"
      description="Review live trend output, capture follow-up details, and prepare handoff-ready symptom notes."
      actions={
        <>
          <Button onClick={() => void loadTracker()}>Refresh live tracker</Button>
          <Link href="/referrals-benefits">
            <Button variant="outline">Open Referrals & Benefits</Button>
          </Link>
        </>
      }
      meta={
        <>
          <SummaryTile
            label="Tracker state"
            value={payload ? currentState : "Awaiting data"}
            helper="Highest-priority symptom state from live trend logs."
            icon={WatsonHealth3DMprToggle}
            tone="blue"
            statusLabel={payload ? currentState : "Pending"}
            statusTone={payload ? "info" : "warning"}
          />
          <SummaryTile
            label="Average severity"
            value={payload ? `${avgSeverity.toFixed(1)} / 10` : "Not available"}
            helper="7-day pelvic pain average from generated trend series."
            icon={ChartLine}
            tone="purple"
            tagLabel="Trend-based"
          />
          <SummaryTile
            label="High-risk events"
            value={payload ? `${highRiskCount} events` : "Not available"}
            helper="Entries with severity >= 7 that need attention."
            icon={UserFollow}
            tone="neutral"
            tagLabel="Escalation watch"
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
            title="Live handoff detected"
            subtitle="Generate symptom-tracker detail from the latest transcript context."
            className="!max-w-none"
          />
        </div>
      ) : null}

      {effectiveViewState === "loading" ? (
        <LoadingState
          title="Refreshing symptom tracker"
          description="Loading latest pelvic pain, bleeding, and treatment-tolerance logs."
        />
      ) : null}

      {effectiveViewState === "error" ? (
        <ErrorState
          title="Symptom tracker unavailable"
          description={errorMessage || "The tracker could not load."}
          action={
            <Button size="sm" onClick={() => void loadTracker()}>
              Retry symptom tracker
            </Button>
          }
        />
      ) : null}

      {effectiveViewState === "empty" ? (
        <EmptyState
          title="No live handoff found"
          description="Generate transcript intelligence in Visit Scribe first."
          action={
            <Link href="/scribe">
              <Button>Go to Visit Scribe</Button>
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
              title="Showing last successful tracker snapshot"
              subtitle={`Latest refresh failed: ${errorMessage}`}
              className="!max-w-none"
            />
          ) : null}

          <TrackerOverview
            patientName={payload.trackerHeader.patientName}
            careContext={payload.trackerHeader.careContext}
            clinician={payload.trackerHeader.clinician}
            lastUpdated={payload.trackerHeader.lastUpdated}
            currentState={currentState}
            avgSeverity={avgSeverity}
            highRiskCount={highRiskCount}
          />

          <SectionCard
            title="Guided Follow-up Flow"
            description="Intake complete, symptom trend generated, and follow-up actions prepared for clinician sign-off."
          >
            <div className="mt-4 overflow-x-auto">
              <ProgressIndicator currentIndex={progressIndex} spaceEqually>
                <ProgressStep label="Intake captured" />
                <ProgressStep label="Trend generated" />
                <ProgressStep label="Follow-up action" />
              </ProgressIndicator>
            </div>
          </SectionCard>

          <section className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
            <SeverityTrendChart trendSeries={payload.trendSeries} />

            <SectionCard
              title="Clinician Review Form"
              description="Capture follow-up logistics after reviewing AI-generated symptom trends."
            >

              <form className="mt-4 space-y-4" onSubmit={handleSaveReview}>
                <Select
                  id="follow-up-window"
                  labelText="Recommended follow-up window"
                  helperText="Choose the review interval communicated to the patient."
                  value={followUpWindow}
                  onChange={(event) => {
                    setFollowUpWindow(event.target.value);
                    setReviewSaved(false);
                  }}
                >
                  <SelectItem value="24h" text="Within 24 hours" />
                  <SelectItem value="48-72h" text="Within 48-72 hours" />
                  <SelectItem value="1 week" text="Within 1 week" />
                </Select>

                <TextInput
                  id="medication-plan"
                  labelText="Medication / intervention check"
                  helperText="Optional note about medication tolerance or intervention plan."
                  placeholder="Example: NSAID trial, heat therapy, hydration plan"
                  value={medicationPlan}
                  onChange={(event) => {
                    setMedicationPlan(event.target.value);
                    setReviewSaved(false);
                  }}
                />

                <TextArea
                  id="review-notes"
                  labelText="Clinician review notes"
                  helperText="Add key points for handoff and patient follow-up instructions."
                  rows={5}
                  value={reviewNotes}
                  onChange={(event) => {
                    setReviewNotes(event.target.value);
                    setReviewSaved(false);
                  }}
                />

                <Button type="submit" size="sm">
                  Save review note
                </Button>
              </form>

              {reviewSaved ? (
                <InlineNotification
                  kind="success"
                  lowContrast
                  hideCloseButton
                  title="Review note saved"
                  subtitle="Review notes are captured for the current session."
                  className="!mt-4 !max-w-none"
                />
              ) : null}
            </SectionCard>
          </section>

          <SectionCard
            title="Review Summary"
            description="Snapshot before forwarding this tracker context to referral coordination."
          >
            <div className="grid gap-3 text-sm md:grid-cols-3">
              <article className="empowher-surface-subtle px-3 py-3">
                Follow-up window: <span className="font-medium">{followUpWindow}</span>
              </article>
              <article className="empowher-surface-subtle px-3 py-3">
                Medication note: <span className="font-medium">{medicationPlan || "Not provided"}</span>
              </article>
              <article className="empowher-surface-subtle px-3 py-3">
                Review notes: <span className="font-medium">{reviewNotes ? "Captured" : "Not captured"}</span>
              </article>
            </div>
          </SectionCard>

          <SymptomHistory entries={payload.symptomLog} />
        </div>
      ) : null}
    </PageLayout>
  );
}
