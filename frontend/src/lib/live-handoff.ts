export const LIVE_HANDOFF_KEY = "empowher_live_handoff";
export const LIVE_CARE_PLAN_KEY = "empowher_live_care_plan";
export const LIVE_WORKFLOW_EVENT = "empowher_live_workflow_change";

function notifyLiveWorkflowChange(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(LIVE_WORKFLOW_EVENT));
}

export type LiveHandoff = {
  transcript: string;
  insight: string;
  energyLevel: "low" | "medium" | "high";
  symptomTags: string[];
  extractionSource?: string;
  savedAt: string;
};

export function saveLiveHandoff(data: LiveHandoff): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LIVE_HANDOFF_KEY, JSON.stringify(data));
  notifyLiveWorkflowChange();
}

export function readLiveHandoff(): LiveHandoff | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(LIVE_HANDOFF_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as LiveHandoff;
  } catch {
    return null;
  }
}

export type LiveCarePlan = {
  explanation: string;
  next_step: string;
  benefit: string;
  savedAt: string;
};

export function saveLiveCarePlan(data: LiveCarePlan): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LIVE_CARE_PLAN_KEY, JSON.stringify(data));
  notifyLiveWorkflowChange();
}

export function readLiveCarePlan(): LiveCarePlan | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(LIVE_CARE_PLAN_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as LiveCarePlan;
  } catch {
    return null;
  }
}
