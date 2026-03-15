"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/states/empty-state";
import { ErrorState } from "@/components/states/error-state";
import { LoadingState } from "@/components/states/loading-state";
import { DemoModeToggle } from "@/components/states/demo-mode-toggle";
import { SymptomHistory } from "@/components/symptom-tracker/symptom-history";
import { TrackerOverview } from "@/components/symptom-tracker/tracker-overview";
import { DemoFlow } from "@/components/shell/demo-flow";
import {
  symptomLog,
  trackerHeader,
  trendSeries,
  type TrackerState,
} from "@/lib/mock-symptom-tracker";

type TrackerViewState = "live" | "loading" | "empty" | "error" | "success";

const statePriority: TrackerState[] = [
  "Follow-up needed",
  "Worsening",
  "Active",
  "Improving",
];

const SeverityTrendChart = dynamic(
  () =>
    import("@/components/symptom-tracker/severity-trend-chart").then(
      (module) => module.SeverityTrendChart,
    ),
  { ssr: false },
);

export default function SymptomTrackerPage() {
  const [viewState, setViewState] = useState<TrackerViewState>("live");

  const avgSeverity = useMemo(
    () => trendSeries.reduce((sum, day) => sum + day.pelvicPain, 0) / trendSeries.length,
    [],
  );

  const highRiskCount = useMemo(
    () => symptomLog.filter((entry) => entry.severity >= 7).length,
    [],
  );

  const currentState = useMemo(() => {
    for (const state of statePriority) {
      if (symptomLog.some((entry) => entry.state === state)) return state;
    }
    return "Active";
  }, []);

  const showTracker = viewState === "live" || viewState === "success";

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <TrackerOverview
        patientName={trackerHeader.patientName}
        careContext={trackerHeader.careContext}
        clinician={trackerHeader.clinician}
        lastUpdated={trackerHeader.lastUpdated}
        currentState={currentState}
        avgSeverity={avgSeverity}
        highRiskCount={highRiskCount}
      />

      <DemoFlow current="symptom-tracker" />

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
          title="Refreshing symptom tracker"
          description="Loading latest pelvic pain, bleeding, and treatment-tolerance logs."
        />
      ) : null}

      {viewState === "error" ? (
        <ErrorState
          title="Symptom tracker unavailable"
          description="The tracker could not load. Retry to continue follow-up planning and risk review."
          action={<Button size="sm" onClick={() => setViewState("live")}>Retry symptom tracker</Button>}
        />
      ) : null}

      {viewState === "empty" ? (
        <EmptyState
          title="No symptom logs captured yet"
          description="Start by adding pelvic pain, bleeding, menopause, postpartum, or medication side-effect entries."
          action={<Button onClick={() => setViewState("live")}>Load demo symptom data</Button>}
        />
      ) : null}

      {showTracker ? (
        <>
          {viewState === "success" ? (
            <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
              <p className="text-sm font-semibold text-emerald-800">Symptom note saved</p>
              <h3 className="mt-1 text-lg font-semibold tracking-tight text-emerald-900">Tracker updated for follow-up review</h3>
              <p className="mt-2 text-sm text-emerald-900/90">
                The latest symptom update is now ready for clinician review during the next care-plan check.
              </p>
              <div className="mt-3">
                <Link href="/referrals-benefits">
                  <Button size="sm">Continue to Referrals and Benefits</Button>
                </Link>
              </div>
            </section>
          ) : null}

          <section className="grid gap-4 xl:grid-cols-[1.35fr_1fr]">
            <SeverityTrendChart trendSeries={trendSeries} />

            <article className="rounded-xl border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-semibold tracking-tight">Quick Log Actions</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Capture key updates for cycle pain, bleeding changes, postpartum recovery, and medication tolerance.
              </p>

              <div className="mt-4 space-y-3">
                <button
                  type="button"
                  className="w-full rounded-lg border px-3 py-2 text-left text-sm hover:bg-muted"
                  onClick={() => setViewState("success")}
                >
                  Log pelvic pain flare (severity 7)
                </button>
                <button
                  type="button"
                  className="w-full rounded-lg border px-3 py-2 text-left text-sm hover:bg-muted"
                  onClick={() => setViewState("success")}
                >
                  Log abnormal bleeding update
                </button>
                <button
                  type="button"
                  className="w-full rounded-lg border px-3 py-2 text-left text-sm hover:bg-muted"
                  onClick={() => setViewState("success")}
                >
                  Log medication side effect
                </button>
              </div>

              <p className="mt-4 text-xs text-muted-foreground">
                Demo flow: actions simulate successful symptom-entry capture.
              </p>
            </article>
          </section>

          <SymptomHistory entries={symptomLog} />
        </>
      ) : null}
    </div>
  );
}
