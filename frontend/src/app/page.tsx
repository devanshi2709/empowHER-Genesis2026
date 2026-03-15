"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/states/error-state";
import { EmptyState } from "@/components/states/empty-state";
import { LoadingState } from "@/components/states/loading-state";
import { DemoModeToggle } from "@/components/states/demo-mode-toggle";
import { KpiCards } from "@/components/dashboard/kpi-cards";
import { PendingPlans } from "@/components/dashboard/pending-plans";
import { TodayWorklist } from "@/components/dashboard/today-worklist";
import { DemoFlow } from "@/components/shell/demo-flow";
import {
  clinicMetrics,
  pendingCarePlans,
  todayVisits,
  urgentAlerts,
} from "@/lib/mock-dashboard";

type DashboardViewState = "live" | "loading" | "empty" | "error";

export default function ClinicDashboard() {
  const [viewState, setViewState] = useState<DashboardViewState>("live");

  const hasData = useMemo(() => viewState === "live", [viewState]);

  return (
    <div className="space-y-6">
      <section className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Clinic Home</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight">Clinic Operations Dashboard</h2>
            <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
              Monitor patient flow, prioritize care plans, and launch the end-to-end clinic coordination demo.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/scribe">
              <Button>Start demo at Visit Scribe</Button>
            </Link>
            <Link href="/care-plan">
              <Button variant="outline">Open care plan queue</Button>
            </Link>
          </div>
        </div>
      </section>

      <DemoFlow current="dashboard" />

      <DemoModeToggle
        active={viewState}
        onChange={setViewState}
        options={[
          { key: "live", label: "Live data" },
          { key: "loading", label: "Loading" },
          { key: "empty", label: "Empty" },
          { key: "error", label: "Error" },
        ]}
      />

      {viewState === "loading" ? (
        <LoadingState title="Refreshing clinic dashboard" description="Syncing visits, care plan backlog, and high-priority alerts." />
      ) : null}

      {viewState === "error" ? (
        <ErrorState
          title="Dashboard sync interrupted"
          description="The clinic dashboard could not refresh. Retry to resume care plan triage and patient flow monitoring."
          action={<Button size="sm" onClick={() => setViewState("live")}>Retry dashboard refresh</Button>}
        />
      ) : null}

      {viewState === "empty" ? (
        <EmptyState
          title="No visits queued right now"
          description="Your team is fully caught up. Start a new visit note or check back when the next patient is roomed."
          action={
            <Link href="/scribe">
              <Button>Start first visit</Button>
            </Link>
          }
        />
      ) : null}

      {hasData ? (
        <>
          <KpiCards metrics={clinicMetrics} />

          <section className="grid gap-4 xl:grid-cols-[2fr_1.1fr]">
            <TodayWorklist visits={todayVisits} />
            <PendingPlans plans={pendingCarePlans} />
          </section>

          <section className="rounded-xl border bg-card p-5 shadow-sm">
            <h3 className="text-base font-semibold tracking-tight">Urgent Coordination Alerts</h3>
            <p className="mt-1 text-sm text-muted-foreground">Tasks requiring same-day coordination with referrals or follow-up logistics.</p>
            <ul className="mt-4 space-y-3">
              {urgentAlerts.map((alert) => (
                <li key={alert.id} className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                  <p className="text-sm font-semibold text-amber-800">{alert.title}</p>
                  <p className="mt-1 text-sm text-amber-900/90">{alert.detail}</p>
                </li>
              ))}
            </ul>
          </section>
        </>
      ) : null}
    </div>
  );
}
