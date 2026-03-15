export type DemoFlowStepKey =
  | "dashboard"
  | "scribe"
  | "care-plan"
  | "symptom-tracker"
  | "referrals-benefits";

export type DemoFlowStep = {
  key: DemoFlowStepKey;
  label: string;
  href: string;
};

export const demoFlowSteps: DemoFlowStep[] = [
  { key: "dashboard", label: "Dashboard", href: "/" },
  { key: "scribe", label: "Visit Scribe", href: "/scribe" },
  { key: "care-plan", label: "Care Plan", href: "/care-plan" },
  { key: "symptom-tracker", label: "Symptom Tracker", href: "/symptom-tracker" },
  { key: "referrals-benefits", label: "Referrals & Benefits", href: "/referrals-benefits" },
];

export function getFlowNeighbors(current: DemoFlowStepKey) {
  const index = demoFlowSteps.findIndex((step) => step.key === current);
  return {
    previous: index > 0 ? demoFlowSteps[index - 1] : null,
    next: index < demoFlowSteps.length - 1 ? demoFlowSteps[index + 1] : null,
  };
}
