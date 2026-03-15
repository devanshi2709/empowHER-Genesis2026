"use client";

import Link from "next/link";
import { useState } from "react";
import { Accordion, AccordionItem, Checkbox, InlineNotification, Tile } from "@carbon/react";
import { ChartLine, Document, Notebook } from "@carbon/icons-react";
import { PageLayout } from "@/components/layout/page-layout";
import { SectionCard } from "@/components/layout/section-card";
import { SummaryTile } from "@/components/layout/summary-tile";
import { EmptyState } from "@/components/states/empty-state";
import { ErrorState } from "@/components/states/error-state";
import { LoadingState } from "@/components/states/loading-state";
import { AIOutputPanel } from "@/components/ui/ai-output-panel";
import { Button } from "@/components/ui/button";
import { generateExplanation, type ExplainResponse } from "@/lib/api";
import { saveLiveCarePlan, type LiveHandoff } from "@/lib/live-handoff";
import { useLiveHandoff } from "@/lib/live-handoff-store";

type CarePlanViewState = "idle" | "loading" | "empty" | "error" | "ready";

export default function CarePlan() {
  const handoff = useLiveHandoff();
  const [viewState, setViewState] = useState<CarePlanViewState>("idle");
  const [plan, setPlan] = useState<ExplainResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const effectiveViewState: CarePlanViewState = viewState === "idle" && !handoff ? "empty" : viewState;

  async function loadPlan(source: LiveHandoff) {
    const hadPlan = plan !== null;
    try {
      setViewState("loading");
      setErrorMessage("");
      const response = await generateExplanation({
        transcript: source.transcript,
        insight: source.insight,
        energy_level: source.energyLevel,
        symptom_tags: source.symptomTags,
      });
      setPlan(response);
      saveLiveCarePlan({
        explanation: response.explanation,
        next_step: response.next_step,
        benefit: response.benefit,
        savedAt: new Date().toISOString(),
      });
      setViewState("ready");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to generate care plan");
      if (hadPlan) {
        setViewState("ready");
      } else {
        setViewState("error");
      }
    }
  }

  return (
    <PageLayout
      eyebrow="Care Planning"
      title="Care Plan Workspace"
      description="Turn the transcript handoff into a clinician-reviewable plan with clear next actions and benefits guidance."
      actions={
        <>
          {handoff ? (
            <Button onClick={() => void loadPlan(handoff)} disabled={viewState === "loading"}>
              {viewState === "ready" ? "Regenerate care plan" : "Generate care plan"}
            </Button>
          ) : null}
          <Link href="/symptom-tracker">
            <Button variant="outline">Open Symptom Tracker</Button>
          </Link>
        </>
      }
      meta={
        <>
          <SummaryTile
            label="Handoff status"
            value={handoff ? `Captured ${new Date(handoff.savedAt).toLocaleString()}` : "No handoff data"}
            helper="Transcript payload required for generated care plan."
            icon={Document}
            tone="blue"
            statusLabel={handoff ? "Ready" : "Missing"}
            statusTone={handoff ? "success" : "danger"}
          />
          <SummaryTile
            label="Plan status"
            value={viewState === "ready" ? "AI draft generated" : "Awaiting generation"}
            helper="Draft should be clinically reviewed before downstream actions."
            icon={Notebook}
            tone="purple"
            statusLabel={viewState === "ready" ? "Draft available" : "Pending"}
            statusTone={viewState === "ready" ? "info" : "warning"}
          />
          <SummaryTile
            label="Clinical caution"
            value="AI suggestions need clinician validation"
            helper="Use as planning support, not diagnosis."
            icon={ChartLine}
            tone="neutral"
            tagLabel="Review-first policy"
          />
        </>
      }
    >
      {effectiveViewState === "idle" && handoff ? (
        <Tile className="empowher-surface p-5 md:p-6">
          <InlineNotification
            kind="info"
            lowContrast
            hideCloseButton
            title="Live handoff detected"
            subtitle={`Data captured at ${new Date(handoff.savedAt).toLocaleString()}. Generate the latest care plan from backend context.`}
            className="!max-w-none"
          />
        </Tile>
      ) : null}

      {effectiveViewState === "loading" ? (
        <LoadingState
          title="Generating care plan from live data"
          description="Calling backend advocacy service for explanation, next step, and benefit guidance."
        />
      ) : null}

      {effectiveViewState === "error" ? (
        <ErrorState
          title="Care plan generation failed"
          description={errorMessage || "The care plan workspace did not load correctly."}
          action={
            <Button size="sm" onClick={() => (handoff ? void loadPlan(handoff) : setViewState("idle"))}>
              Retry generation
            </Button>
          }
        />
      ) : null}

      {effectiveViewState === "empty" ? (
        <EmptyState
          title="No live handoff found"
          description="Generate a transcript handoff in Visit Scribe first, then return here for live plan generation."
          action={
            <Link href="/scribe">
              <Button>Go to Visit Scribe</Button>
            </Link>
          }
        />
      ) : null}

      {effectiveViewState === "ready" && handoff && plan ? (
        <div className="space-y-6">
          {errorMessage ? (
            <InlineNotification
              kind="warning"
              lowContrast
              hideCloseButton
              title="Showing last successful care plan draft"
              subtitle={`Latest generation failed: ${errorMessage}`}
              className="!max-w-none"
            />
          ) : null}

          <InlineNotification
            kind="success"
            lowContrast
            hideCloseButton
            title="Care plan draft ready"
            subtitle="Review AI-generated plan sections and confirm the final actions with the clinician."
            className="!max-w-none"
          />

          <section className="grid gap-4 xl:grid-cols-[1.45fr_1fr]">
            <AIOutputPanel
              title="AI Care Plan Draft"
              description="Structured recommendations based on transcript, check-in tags, and care context."
            >
              <Accordion align="start">
                <AccordionItem title="Plain-language explanation">
                  <p className="text-sm leading-6 text-[#161616]">{plan.explanation}</p>
                </AccordionItem>
                <AccordionItem title="Recommended next step">
                  <p className="text-sm leading-6 text-[#161616]">{plan.next_step}</p>
                </AccordionItem>
                <AccordionItem title="Benefits guidance">
                  <p className="text-sm leading-6 text-[#161616]">{plan.benefit}</p>
                </AccordionItem>
              </Accordion>
            </AIOutputPanel>

            <SectionCard
              title="Source Context"
              description="Latest handoff signals that informed the AI draft."
            >
              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="text-xs text-[#525252]">Energy level</dt>
                  <dd className="mt-1 font-medium uppercase text-[#161616]">{handoff.energyLevel}</dd>
                </div>
                <div>
                  <dt className="text-xs text-[#525252]">Symptom tags</dt>
                  <dd className="mt-1 text-[#161616]">
                    {handoff.symptomTags.length ? handoff.symptomTags.join(", ") : "None tagged"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-[#525252]">Extraction source</dt>
                  <dd className="mt-1 text-[#161616]">{handoff.extractionSource || "unknown"}</dd>
                </div>
              </dl>
              <p className="empowher-surface-subtle mt-4 p-3 text-xs leading-5 text-[#525252]">
                {handoff.insight}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href="/symptom-tracker">
                  <Button size="sm">Continue to Symptom Tracker</Button>
                </Link>
                <Link href="/referrals-benefits">
                  <Button variant="outline" size="sm">
                    Open Referrals & Benefits
                  </Button>
                </Link>
              </div>
            </SectionCard>
          </section>

          <SectionCard
            title="Clinician Approval Checklist"
            description="Fast safety checklist before publishing plan to the rest of the workflow."
          >
            <div className="grid gap-3 text-sm md:grid-cols-2">
              <div className="empowher-surface-subtle px-3 py-3">
                <Checkbox id="cp-check-1" labelText="Symptoms and timeline are correctly represented" />
              </div>
              <div className="empowher-surface-subtle px-3 py-3">
                <Checkbox id="cp-check-2" labelText="Proposed next step is clinically appropriate" />
              </div>
              <div className="empowher-surface-subtle px-3 py-3">
                <Checkbox id="cp-check-3" labelText="Benefits guidance aligns with patient context" />
              </div>
              <div className="empowher-surface-subtle px-3 py-3">
                <Checkbox id="cp-check-4" labelText="Patient-facing wording is safe and clear" />
              </div>
            </div>
          </SectionCard>
        </div>
      ) : null}
    </PageLayout>
  );
}
