"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/states/empty-state";
import { ErrorState } from "@/components/states/error-state";
import { LoadingState } from "@/components/states/loading-state";
import { DemoModeToggle } from "@/components/states/demo-mode-toggle";
import { DemoFlow } from "@/components/shell/demo-flow";
import { demoCarePlan } from "@/lib/mock-care-plan";
import { cn } from "@/lib/utils";
import Link from "next/link";

type CarePlanViewState = "live" | "loading" | "empty" | "error" | "success";

export default function CarePlan() {
  const [viewState, setViewState] = useState<CarePlanViewState>("live");
  const [isApproved, setIsApproved] = useState(false);

  const completedTasks = useMemo(
    () => demoCarePlan.followUpTasks.filter((task) => task.completed).length,
    [],
  );

  const showWorkspace = viewState === "live" || viewState === "success";

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <section className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Care Planning</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight">Care Plan Workspace</h2>
            <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
              Finalize clinician-ready recommendations and coordinate clear next steps for the patient.
            </p>
          </div>
          <div className="rounded-lg border bg-muted/40 px-3 py-2 text-sm">
            <p className="font-medium">{demoCarePlan.patientName}</p>
            <p className="text-muted-foreground">{demoCarePlan.visitId}</p>
          </div>
        </div>
      </section>

      <DemoFlow current="care-plan" />

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
          title="Preparing care plan workspace"
          description="Compiling summary, task assignments, and follow-up recommendations."
        />
      ) : null}

      {viewState === "error" ? (
        <ErrorState
          title="Care plan details unavailable"
          description="The care plan workspace did not load correctly. Retry to continue clinician review."
          action={<Button size="sm" onClick={() => setViewState("live")}>Retry loading care plan</Button>}
        />
      ) : null}

      {viewState === "empty" ? (
        <EmptyState
          title="No care plan generated for this visit"
          description="Complete transcript extraction or create a manual draft to populate this workspace."
          action={<Button onClick={() => setViewState("live")}>Load demo care plan</Button>}
        />
      ) : null}

      {showWorkspace ? (
        <>
          {viewState === "success" ? (
            <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
              <p className="text-sm font-semibold text-emerald-800">Clinician review complete</p>
              <h3 className="mt-1 text-lg font-semibold tracking-tight text-emerald-900">Care plan approved and ready for handoff</h3>
              <p className="mt-2 text-sm text-emerald-900/90">
                This plan is confirmed for patient instructions and scheduling coordination.
              </p>
              <div className="mt-3">
                <Link href="/symptom-tracker">
                  <Button size="sm">Continue to Symptom Tracker</Button>
                </Link>
              </div>
            </section>
          ) : null}

          <section className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
            <article className="rounded-xl border bg-card p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h3 className="text-lg font-semibold tracking-tight">Care Plan Summary</h3>
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
                  Reviewed {demoCarePlan.updatedAt}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6">{demoCarePlan.summary}</p>

              <h4 className="mt-5 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Clinical notes</h4>
              <ul className="mt-2 space-y-2 text-sm">
                {demoCarePlan.diagnosisNotes.map((note) => (
                  <li key={note} className="rounded-md bg-muted/50 px-3 py-2">{note}</li>
                ))}
              </ul>
            </article>

            <article className="rounded-xl border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-semibold tracking-tight">Clinician Review</h3>
              <p className="mt-2 text-sm text-muted-foreground">Confirm this care plan before care-team handoff.</p>

              <div className="mt-4 space-y-3 rounded-lg border bg-muted/30 p-4 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Reviewer</span>
                  <span className="font-medium">{demoCarePlan.reviewedBy}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Task completion</span>
                  <span className="font-medium">{completedTasks}/{demoCarePlan.followUpTasks.length}</span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Button onClick={() => setIsApproved((value) => !value)}>
                  {isApproved ? "Marked approved" : "Mark as approved"}
                </Button>
                <Button variant="outline" onClick={() => setViewState("success")}>
                  Finalize plan
                </Button>
              </div>

              <p className={cn("mt-3 text-xs", isApproved ? "text-emerald-700" : "text-muted-foreground")}>
                {isApproved
                  ? "Approval recorded in this demo session."
                  : "Approval pending clinician confirmation."}
              </p>
            </article>
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <article className="rounded-xl border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-semibold tracking-tight">Patient Instructions</h3>
              <p className="mt-1 text-sm text-muted-foreground">Clear take-home guidance to reinforce adherence and safety.</p>
              <ol className="mt-4 space-y-3 text-sm">
                {demoCarePlan.patientInstructions.map((instruction, index) => (
                  <li key={instruction} className="flex gap-3 rounded-md bg-muted/40 p-3">
                    <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                      {index + 1}
                    </span>
                    <span>{instruction}</span>
                  </li>
                ))}
              </ol>
            </article>

            <article className="rounded-xl border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-semibold tracking-tight">Follow-up Checklist</h3>
              <p className="mt-1 text-sm text-muted-foreground">Shared tasks by role to ensure completion before follow-up.</p>
              <ul className="mt-4 space-y-3 text-sm">
                {demoCarePlan.followUpTasks.map((task) => (
                  <li key={task.id} className="rounded-md border p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-medium">{task.title}</p>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-xs font-semibold",
                          task.completed
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700",
                        )}
                      >
                        {task.completed ? "Completed" : "Pending"}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">Owner: {task.owner} | Due: {task.due}</p>
                  </li>
                ))}
              </ul>
            </article>
          </section>

          <section className="grid gap-4 lg:grid-cols-3">
            <article className="rounded-xl border bg-card p-6 shadow-sm">
              <h3 className="text-base font-semibold tracking-tight">Medications</h3>
              <ul className="mt-3 space-y-3 text-sm">
                {demoCarePlan.medications.map((medication) => (
                  <li key={medication.name} className="rounded-md bg-muted/40 p-3">
                    <p className="font-medium">{medication.name}</p>
                    <p className="text-muted-foreground">{medication.dose}</p>
                    <p className="mt-1">{medication.instructions}</p>
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-xl border bg-card p-6 shadow-sm">
              <h3 className="text-base font-semibold tracking-tight">Tests and Labs</h3>
              <ul className="mt-3 space-y-3 text-sm">
                {demoCarePlan.tests.map((test) => (
                  <li key={test.test} className="rounded-md bg-muted/40 p-3">
                    <p className="font-medium">{test.test}</p>
                    <p>{test.reason}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Timing: {test.timing}</p>
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-xl border bg-card p-6 shadow-sm">
              <h3 className="text-base font-semibold tracking-tight">Referrals</h3>
              <ul className="mt-3 space-y-3 text-sm">
                {demoCarePlan.referrals.map((referral) => (
                  <li key={referral.specialty} className="rounded-md bg-muted/40 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium">{referral.specialty}</p>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                        {referral.urgency}
                      </span>
                    </div>
                    <p className="mt-1">{referral.reason}</p>
                  </li>
                ))}
              </ul>
            </article>
          </section>
        </>
      ) : null}
    </div>
  );
}
