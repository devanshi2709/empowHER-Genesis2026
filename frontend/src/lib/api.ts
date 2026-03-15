import type { LiveCarePlan, LiveHandoff } from "@/lib/live-handoff";
import type { DashboardPayload, ReferralPayload, TrackerPayload } from "@/lib/live-types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5050";

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
} & T;

async function postJson<TResponse>(path: string, body: unknown): Promise<TResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  let payload: ApiEnvelope<TResponse>;
  try {
    payload = (await response.json()) as ApiEnvelope<TResponse>;
  } catch {
    throw new Error(`Request failed (${response.status})`);
  }

  if (!response.ok || !payload.success) {
    throw new Error(payload.message || `Request failed (${response.status})`);
  }

  return payload;
}

export type AiInsightResponse = {
  insight: string;
};

export type CheckinResponse = {
  energy_level: "low" | "medium" | "high";
  symptom_tags: string[];
  extraction_source?: string;
};

export type ScribeHandoffResponse = CheckinResponse & {
  insight: string;
};

export type ExplainResponse = {
  scanId: string | null;
  explanation: string;
  next_step: string;
  benefit: string;
};

export async function generateInsight(prompt: string): Promise<AiInsightResponse> {
  return postJson<AiInsightResponse>("/api/ai-test", { prompt });
}

export async function parseCheckin(transcript: string): Promise<CheckinResponse> {
  return postJson<CheckinResponse>("/api/checkin", { transcript });
}

export async function generateScribeHandoff(transcript: string): Promise<ScribeHandoffResponse> {
  return postJson<ScribeHandoffResponse>("/api/workflow/scribe", { transcript });
}

export async function generateExplanation(data: Record<string, unknown>): Promise<ExplainResponse> {
  return postJson<ExplainResponse>("/api/explain", { data });
}

function requirePayload<T>(response: { payload?: T }, endpoint: string): T {
  if (!response.payload) {
    throw new Error(`Invalid ${endpoint} response: missing payload.`);
  }
  return response.payload;
}

export async function generateDashboard(data: {
  handoff?: LiveHandoff | null;
  carePlan?: LiveCarePlan | null;
}): Promise<DashboardPayload> {
  const response = await postJson<{ payload?: DashboardPayload }>("/api/workflow/dashboard", data);
  return requirePayload(response, "/api/workflow/dashboard");
}

export async function generateSymptomTracker(data: {
  handoff: LiveHandoff;
}): Promise<TrackerPayload> {
  const response = await postJson<{ payload?: TrackerPayload }>("/api/workflow/symptom-tracker", data);
  return requirePayload(response, "/api/workflow/symptom-tracker");
}

export async function generateReferralsBenefits(data: {
  handoff?: LiveHandoff | null;
  carePlan?: LiveCarePlan | null;
}): Promise<ReferralPayload> {
  const response = await postJson<{ payload?: ReferralPayload }>(
    "/api/workflow/referrals-benefits",
    data,
  );
  return requirePayload(response, "/api/workflow/referrals-benefits");
}
