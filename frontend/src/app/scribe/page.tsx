"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/states/empty-state";
import { ErrorState } from "@/components/states/error-state";
import { LoadingState } from "@/components/states/loading-state";
import { DemoModeToggle } from "@/components/states/demo-mode-toggle";
import { DemoFlow } from "@/components/shell/demo-flow";

type ScribeViewState = "live" | "loading" | "empty" | "error" | "success";

export default function VisitScribe() {
  const [transcript, setTranscript] = useState("");
  const [viewState, setViewState] = useState<ScribeViewState>("live");

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <section className="rounded-xl border bg-card p-6 shadow-sm">
        <p className="text-sm font-medium text-muted-foreground">Visit Intake</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight">Visit Scribe Workspace</h2>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Capture the clinician-patient conversation and convert it into a structured handoff for care planning.
        </p>
      </section>

      <DemoFlow current="scribe" />

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
          title="Extracting visit actions"
          description="Preparing symptoms, follow-up tasks, and draft care-plan recommendations."
        />
      ) : null}

      {viewState === "error" ? (
        <ErrorState
          title="Visit extraction unavailable"
          description="The transcript could not be processed in this demo state. Retry to continue care-plan drafting."
          action={<Button size="sm" onClick={() => setViewState("live")}>Retry extraction</Button>}
        />
      ) : null}

      {viewState === "empty" ? (
        <EmptyState
          title="No transcript added yet"
          description="Paste a visit transcript to generate care-plan actions and continue the clinic demo flow."
          action={<Button onClick={() => setViewState("live")}>Open transcript editor</Button>}
        />
      ) : null}

      {(viewState === "live" || viewState === "success") ? (
        <>
          {viewState === "success" ? (
            <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
              <p className="text-sm font-semibold text-emerald-800">Visit extraction complete</p>
              <h3 className="mt-1 text-lg font-semibold tracking-tight text-emerald-900">
                Draft care-plan actions are ready for review
              </h3>
              <p className="mt-2 text-sm text-emerald-900/90">
                Continue to the Care Plan workspace to confirm instructions, tasks, and next-step coordination.
              </p>
              <div className="mt-3">
                <Link href="/care-plan">
                  <Button size="sm">Continue to Care Plan</Button>
                </Link>
              </div>
            </section>
          ) : null}

          <section className="rounded-xl border bg-card p-6 shadow-sm">
            <label htmlFor="transcript" className="mb-2 block text-sm font-medium">
              Visit transcript
            </label>
            <textarea
              id="transcript"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Paste the clinician-patient conversation here..."
              rows={14}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Button
                size="lg"
                disabled={!transcript.trim()}
                onClick={() => setViewState("success")}
              >
                Generate care-plan draft
              </Button>
              <p className="text-xs text-muted-foreground">
                Demo mode: actions are generated from local mock state.
              </p>
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}
