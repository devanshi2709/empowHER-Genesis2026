import { Router, Request, Response } from "express";
import { generateInsight } from "../services/watsonx.js";

type EnergyLevel = "low" | "medium" | "high";
type KpiTone = "good" | "neutral" | "warning";
type VisitStatus = "Intake" | "In progress" | "Ready for plan";
type PlanPriority = "High" | "Medium" | "Low";
type TrackerState = "Active" | "Improving" | "Worsening" | "Follow-up needed";
type SymptomCategory =
  | "Pelvic pain"
  | "Abnormal bleeding"
  | "Menopause symptoms"
  | "Postpartum recovery"
  | "Medication side effects";
type CoordinationStatus =
  | "Ready to send"
  | "Needs documents"
  | "Pending review"
  | "Follow-up required";
type BlockerOwner = "Patient" | "Clinic" | "Referring provider";
type BlockerPriority = "High" | "Medium" | "Low";

type LiveHandoff = {
  transcript: string;
  insight: string;
  energyLevel: EnergyLevel;
  symptomTags: string[];
  extractionSource?: string;
  savedAt: string;
};

type LiveCarePlan = {
  explanation: string;
  next_step: string;
  benefit: string;
  savedAt: string;
};

type DashboardPayload = {
  clinicMetrics: Array<{ label: string; value: string; change: string; tone: KpiTone }>;
  todayVisits: Array<{ id: string; patient: string; reason: string; time: string; status: VisitStatus }>;
  pendingCarePlans: Array<{
    id: string;
    patient: string;
    updatedAgo: string;
    priority: PlanPriority;
    blocker?: string;
  }>;
  urgentAlerts: Array<{ id: string; title: string; detail: string }>;
};

type TrackerPayload = {
  trackerHeader: {
    patientName: string;
    careContext: string;
    clinician: string;
    lastUpdated: string;
  };
  symptomLog: Array<{
    id: string;
    date: string;
    category: SymptomCategory;
    severity: number;
    state: TrackerState;
    notes: string;
    action: string;
  }>;
  trendSeries: Array<{
    date: string;
    pelvicPain: number;
    bleeding: number;
    hotFlashes: number;
  }>;
};

type ReferralPayload = {
  referralHeader: {
    patientName: string;
    caseId: string;
    clinician: string;
    updatedAt: string;
    context: string;
  };
  referralQueue: Array<{
    id: string;
    service: string;
    provider: string;
    status: CoordinationStatus;
    reason: string;
    dueBy: string;
  }>;
  packetPreview: Array<{ section: string; included: boolean; note: string }>;
  coverageSnapshot: Array<{
    service: string;
    coverage: string;
    copay: string;
    authRequired: boolean;
    notes: string;
  }>;
  blockerChecklist: Array<{
    id: string;
    item: string;
    owner: BlockerOwner;
    priority: BlockerPriority;
    complete: boolean;
  }>;
};

const router = Router();

const kpiTones = new Set<KpiTone>(["good", "neutral", "warning"]);
const visitStatuses = new Set<VisitStatus>(["Intake", "In progress", "Ready for plan"]);
const planPriorities = new Set<PlanPriority>(["High", "Medium", "Low"]);
const trackerStates = new Set<TrackerState>(["Active", "Improving", "Worsening", "Follow-up needed"]);
const symptomCategories = new Set<SymptomCategory>([
  "Pelvic pain",
  "Abnormal bleeding",
  "Menopause symptoms",
  "Postpartum recovery",
  "Medication side effects",
]);
const coordinationStatuses = new Set<CoordinationStatus>([
  "Ready to send",
  "Needs documents",
  "Pending review",
  "Follow-up required",
]);
const blockerOwners = new Set<BlockerOwner>(["Patient", "Clinic", "Referring provider"]);
const blockerPriorities = new Set<BlockerPriority>(["High", "Medium", "Low"]);
const energyLevels = new Set<EnergyLevel>(["low", "medium", "high"]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseInsightJson(insight: string): unknown {
  const cleaned = insight.replace(/```json|```/g, "").trim();
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  const candidate =
    firstBrace >= 0 && lastBrace >= firstBrace ? cleaned.slice(firstBrace, lastBrace + 1) : cleaned;
  return JSON.parse(candidate);
}

function expectString(
  source: Record<string, unknown>,
  key: string,
  context: string,
): string {
  const value = source[key];
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${context}.${key} must be a non-empty string.`);
  }
  return value.trim();
}

function expectDisplayString(
  source: Record<string, unknown>,
  key: string,
  context: string,
): string {
  const value = source[key];
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value === "boolean") return value ? "true" : "false";
  throw new Error(`${context}.${key} must be a non-empty display string.`);
}

function expectBoolean(
  source: Record<string, unknown>,
  key: string,
  context: string,
): boolean {
  const value = source[key];
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (
      normalized === "true" ||
      normalized === "yes" ||
      normalized === "y" ||
      normalized === "1" ||
      normalized === "included" ||
      normalized === "required" ||
      normalized === "complete" ||
      normalized === "done"
    ) {
      return true;
    }
    if (
      normalized === "false" ||
      normalized === "no" ||
      normalized === "n" ||
      normalized === "0" ||
      normalized === "missing" ||
      normalized === "not required" ||
      normalized === "incomplete" ||
      normalized === "open" ||
      normalized === "pending"
    ) {
      return false;
    }

    // Some model outputs encode inclusion/auth flags as descriptive text.
    if (normalized.length > 0) {
      return !/\b(false|no|missing|not required|incomplete|open|pending|absent|none)\b/i.test(
        normalized,
      );
    }
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  if (isRecord(value)) {
    if (typeof value.included === "boolean") return value.included;
    if (typeof value.complete === "boolean") return value.complete;
    if (typeof value.value === "boolean") return value.value;
    return Object.keys(value).length > 0;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return value !== 0;
  }

  throw new Error(`${context}.${key} must be a boolean.`);
}

function expectNumber(
  source: Record<string, unknown>,
  key: string,
  context: string,
): number {
  const value = source[key];
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value.trim());
    if (Number.isFinite(parsed)) return parsed;
  }

  throw new Error(`${context}.${key} must be a finite number.`);
}

function expectEnum<T extends string>(
  source: Record<string, unknown>,
  key: string,
  allowed: Set<T>,
  context: string,
): T {
  const value = source[key];
  if (typeof value !== "string" || !allowed.has(value as T)) {
    throw new Error(
      `${context}.${key} must be one of: ${Array.from(allowed).join(", ")}.`,
    );
  }
  return value as T;
}

function normalizeKpiTone(value: string): KpiTone | null {
  const normalized = value.trim().toLowerCase();
  if (normalized === "good" || normalized === "positive" || normalized === "success") return "good";
  if (normalized === "neutral") return "neutral";
  if (normalized === "warning" || normalized === "warn" || normalized === "risk") return "warning";
  return null;
}

function normalizeVisitStatus(value: string): VisitStatus | null {
  const normalized = value.trim().toLowerCase().replace(/[-_]/g, " ");
  if (normalized === "intake") return "Intake";
  if (normalized === "in progress" || normalized === "inprogress" || normalized === "progress")
    return "In progress";
  if (normalized === "ready for plan" || normalized === "ready") return "Ready for plan";
  return null;
}

function normalizePlanPriority(value: string): PlanPriority | null {
  const normalized = value.trim().toLowerCase();
  if (normalized === "high") return "High";
  if (normalized === "medium") return "Medium";
  if (normalized === "low") return "Low";
  return null;
}

function normalizeTrackerState(value: string): TrackerState | null {
  const normalized = value.trim().toLowerCase().replace(/[-_]/g, " ");
  if (normalized === "active") return "Active";
  if (normalized === "improving") return "Improving";
  if (normalized === "worsening") return "Worsening";
  if (
    normalized === "follow up needed" ||
    normalized === "follow-up needed" ||
    normalized === "follow up required" ||
    normalized === "follow-up required"
  ) {
    return "Follow-up needed";
  }
  return null;
}

function normalizeSymptomCategory(value: string): SymptomCategory | null {
  const normalized = value.trim().toLowerCase().replace(/[-_]/g, " ");
  if (normalized.includes("pelvic")) return "Pelvic pain";
  if (normalized.includes("abnormal bleeding") || normalized.includes("heavy bleeding") || normalized === "bleeding") {
    return "Abnormal bleeding";
  }
  if (normalized.includes("menopause") || normalized.includes("hot flash") || normalized.includes("hot flush")) {
    return "Menopause symptoms";
  }
  if (normalized.includes("postpartum")) return "Postpartum recovery";
  if (normalized.includes("medication") || normalized.includes("side effect") || normalized.includes("adverse effect")) {
    return "Medication side effects";
  }
  return null;
}

function expectArray(
  source: Record<string, unknown>,
  key: string,
  context: string,
): unknown[] {
  const value = source[key];
  if (!Array.isArray(value)) {
    throw new Error(`${context}.${key} must be an array.`);
  }
  return value;
}

function parseDashboardPayload(raw: unknown): DashboardPayload {
  if (!isRecord(raw)) throw new Error("Dashboard payload must be a JSON object.");

  const clinicMetrics = expectArray(raw, "clinicMetrics", "dashboard").map((item, index) => {
    if (!isRecord(item)) throw new Error(`dashboard.clinicMetrics[${index}] must be an object.`);
    const toneRaw = expectDisplayString(item, "tone", `dashboard.clinicMetrics[${index}]`);
    const tone = normalizeKpiTone(toneRaw);
    if (!tone) {
      throw new Error(`dashboard.clinicMetrics[${index}].tone must be one of: ${Array.from(kpiTones).join(", ")}.`);
    }
    return {
      label: expectDisplayString(item, "label", `dashboard.clinicMetrics[${index}]`),
      value: expectDisplayString(item, "value", `dashboard.clinicMetrics[${index}]`),
      change: expectDisplayString(item, "change", `dashboard.clinicMetrics[${index}]`),
      tone,
    };
  });

  const todayVisits = expectArray(raw, "todayVisits", "dashboard").map((item, index) => {
    if (!isRecord(item)) throw new Error(`dashboard.todayVisits[${index}] must be an object.`);
    const statusRaw = expectDisplayString(item, "status", `dashboard.todayVisits[${index}]`);
    const status = normalizeVisitStatus(statusRaw);
    if (!status) {
      throw new Error(`dashboard.todayVisits[${index}].status must be one of: ${Array.from(visitStatuses).join(", ")}.`);
    }
    return {
      id: expectDisplayString(item, "id", `dashboard.todayVisits[${index}]`),
      patient: expectDisplayString(item, "patient", `dashboard.todayVisits[${index}]`),
      reason: expectDisplayString(item, "reason", `dashboard.todayVisits[${index}]`),
      time: expectDisplayString(item, "time", `dashboard.todayVisits[${index}]`),
      status,
    };
  });

  const pendingCarePlans = expectArray(raw, "pendingCarePlans", "dashboard").map((item, index) => {
    if (!isRecord(item)) throw new Error(`dashboard.pendingCarePlans[${index}] must be an object.`);
    const blocker = item.blocker;
    if (typeof blocker !== "undefined" && typeof blocker !== "string") {
      throw new Error(`dashboard.pendingCarePlans[${index}].blocker must be a string when provided.`);
    }
    return {
      id: expectDisplayString(item, "id", `dashboard.pendingCarePlans[${index}]`),
      patient: expectDisplayString(item, "patient", `dashboard.pendingCarePlans[${index}]`),
      updatedAgo: expectDisplayString(item, "updatedAgo", `dashboard.pendingCarePlans[${index}]`),
      priority: (() => {
        const rawPriority = expectDisplayString(item, "priority", `dashboard.pendingCarePlans[${index}]`);
        const normalizedPriority = normalizePlanPriority(rawPriority);
        if (!normalizedPriority) {
          throw new Error(
            `dashboard.pendingCarePlans[${index}].priority must be one of: ${Array.from(planPriorities).join(", ")}.`,
          );
        }
        return normalizedPriority;
      })(),
      blocker,
    };
  });

  const urgentAlerts = expectArray(raw, "urgentAlerts", "dashboard").map((item, index) => {
    if (!isRecord(item)) throw new Error(`dashboard.urgentAlerts[${index}] must be an object.`);
    return {
      id: expectDisplayString(item, "id", `dashboard.urgentAlerts[${index}]`),
      title: expectDisplayString(item, "title", `dashboard.urgentAlerts[${index}]`),
      detail: expectDisplayString(item, "detail", `dashboard.urgentAlerts[${index}]`),
    };
  });

  return { clinicMetrics, todayVisits, pendingCarePlans, urgentAlerts };
}

function parseTrackerPayload(raw: unknown): TrackerPayload {
  if (!isRecord(raw)) throw new Error("Symptom tracker payload must be a JSON object.");
  if (!isRecord(raw.trackerHeader)) {
    throw new Error("trackerHeader must be an object.");
  }

  const trackerHeader = {
    patientName: expectString(raw.trackerHeader, "patientName", "trackerHeader"),
    careContext: expectString(raw.trackerHeader, "careContext", "trackerHeader"),
    clinician: expectString(raw.trackerHeader, "clinician", "trackerHeader"),
    lastUpdated: expectString(raw.trackerHeader, "lastUpdated", "trackerHeader"),
  };

  const symptomLog = expectArray(raw, "symptomLog", "tracker").map((item, index) => {
    if (!isRecord(item)) throw new Error(`symptomLog[${index}] must be an object.`);
    const categoryRaw = expectDisplayString(item, "category", `symptomLog[${index}]`);
    const category = normalizeSymptomCategory(categoryRaw);
    if (!category) {
      throw new Error(`symptomLog[${index}].category must be one of: ${Array.from(symptomCategories).join(", ")}.`);
    }
    const stateRaw = expectDisplayString(item, "state", `symptomLog[${index}]`);
    const state = normalizeTrackerState(stateRaw);
    if (!state) {
      throw new Error(`symptomLog[${index}].state must be one of: ${Array.from(trackerStates).join(", ")}.`);
    }
    return {
      id: expectDisplayString(item, "id", `symptomLog[${index}]`),
      date: expectDisplayString(item, "date", `symptomLog[${index}]`),
      category,
      severity: expectNumber(item, "severity", `symptomLog[${index}]`),
      state,
      notes: expectDisplayString(item, "notes", `symptomLog[${index}]`),
      action: expectDisplayString(item, "action", `symptomLog[${index}]`),
    };
  });

  const trendSeries = expectArray(raw, "trendSeries", "tracker").map((item, index) => {
    if (!isRecord(item)) throw new Error(`trendSeries[${index}] must be an object.`);
    return {
      date: expectString(item, "date", `trendSeries[${index}]`),
      pelvicPain: expectNumber(item, "pelvicPain", `trendSeries[${index}]`),
      bleeding: expectNumber(item, "bleeding", `trendSeries[${index}]`),
      hotFlashes: expectNumber(item, "hotFlashes", `trendSeries[${index}]`),
    };
  });

  return { trackerHeader, symptomLog, trendSeries };
}

function parseReferralPayload(raw: unknown): ReferralPayload {
  if (!isRecord(raw)) throw new Error("Referral payload must be a JSON object.");
  if (!isRecord(raw.referralHeader)) {
    throw new Error("referralHeader must be an object.");
  }

  const referralHeader = {
    patientName: expectString(raw.referralHeader, "patientName", "referralHeader"),
    caseId: expectString(raw.referralHeader, "caseId", "referralHeader"),
    clinician: expectString(raw.referralHeader, "clinician", "referralHeader"),
    updatedAt: expectString(raw.referralHeader, "updatedAt", "referralHeader"),
    context: expectString(raw.referralHeader, "context", "referralHeader"),
  };

  const referralQueue = expectArray(raw, "referralQueue", "referrals").map((item, index) => {
    if (!isRecord(item)) throw new Error(`referralQueue[${index}] must be an object.`);
    return {
      id: expectString(item, "id", `referralQueue[${index}]`),
      service: expectString(item, "service", `referralQueue[${index}]`),
      provider: expectString(item, "provider", `referralQueue[${index}]`),
      status: expectEnum(item, "status", coordinationStatuses, `referralQueue[${index}]`),
      reason: expectString(item, "reason", `referralQueue[${index}]`),
      dueBy: expectString(item, "dueBy", `referralQueue[${index}]`),
    };
  });

  const packetPreview = expectArray(raw, "packetPreview", "referrals").map((item, index) => {
    if (!isRecord(item)) throw new Error(`packetPreview[${index}] must be an object.`);
    const note = expectString(item, "note", `packetPreview[${index}]`);
    const includedRaw = item.included;
    const included =
      typeof includedRaw === "undefined" || includedRaw === null
        ? !/\b(missing|not included|pending|open|absent)\b/i.test(note)
        : expectBoolean(item, "included", `packetPreview[${index}]`);

    return {
      section: expectString(item, "section", `packetPreview[${index}]`),
      included,
      note,
    };
  });

  const coverageSnapshot = expectArray(raw, "coverageSnapshot", "referrals").map((item, index) => {
    if (!isRecord(item)) throw new Error(`coverageSnapshot[${index}] must be an object.`);
    return {
      service: expectString(item, "service", `coverageSnapshot[${index}]`),
      coverage: expectString(item, "coverage", `coverageSnapshot[${index}]`),
      copay: expectString(item, "copay", `coverageSnapshot[${index}]`),
      authRequired: expectBoolean(item, "authRequired", `coverageSnapshot[${index}]`),
      notes: expectString(item, "notes", `coverageSnapshot[${index}]`),
    };
  });

  const blockerChecklist = expectArray(raw, "blockerChecklist", "referrals").map((item, index) => {
    if (!isRecord(item)) throw new Error(`blockerChecklist[${index}] must be an object.`);
    return {
      id: expectString(item, "id", `blockerChecklist[${index}]`),
      item: expectString(item, "item", `blockerChecklist[${index}]`),
      owner: expectEnum(item, "owner", blockerOwners, `blockerChecklist[${index}]`),
      priority: expectEnum(item, "priority", blockerPriorities, `blockerChecklist[${index}]`),
      complete: expectBoolean(item, "complete", `blockerChecklist[${index}]`),
    };
  });

  return { referralHeader, referralQueue, packetPreview, coverageSnapshot, blockerChecklist };
}

function parseCheckinExtraction(raw: unknown): {
  energy_level: EnergyLevel;
  symptom_tags: string[];
} {
  if (!isRecord(raw)) throw new Error("checkin extraction payload must be an object.");
  const energy_level = expectEnum(raw, "energy_level", energyLevels, "checkin");
  const symptom_tags = expectArray(raw, "symptom_tags", "checkin")
    .filter((tag): tag is string => typeof tag === "string")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 5);
  return { energy_level, symptom_tags };
}

function validateHandoff(value: unknown): LiveHandoff | null {
  if (!isRecord(value)) return null;
  if (
    typeof value.transcript !== "string" ||
    typeof value.insight !== "string" ||
    typeof value.energyLevel !== "string" ||
    !["low", "medium", "high"].includes(value.energyLevel) ||
    !Array.isArray(value.symptomTags) ||
    !value.symptomTags.every((tag) => typeof tag === "string")
  ) {
    return null;
  }
  return {
    transcript: value.transcript,
    insight: value.insight,
    energyLevel: value.energyLevel as EnergyLevel,
    symptomTags: value.symptomTags as string[],
    extractionSource: typeof value.extractionSource === "string" ? value.extractionSource : undefined,
    savedAt: typeof value.savedAt === "string" ? value.savedAt : "",
  };
}

function validateCarePlan(value: unknown): LiveCarePlan | null {
  if (!isRecord(value)) return null;
  if (
    typeof value.explanation !== "string" ||
    typeof value.next_step !== "string" ||
    typeof value.benefit !== "string"
  ) {
    return null;
  }
  return {
    explanation: value.explanation,
    next_step: value.next_step,
    benefit: value.benefit,
    savedAt: typeof value.savedAt === "string" ? value.savedAt : "",
  };
}

router.get("/", (_req: Request, res: Response) => {
  res.json({ success: true, message: "Workflow endpoint initialized" });
});

router.post("/scribe", async (req: Request, res: Response) => {
  const { transcript } = req.body as { transcript?: unknown };
  if (typeof transcript !== "string" || !transcript.trim()) {
    return res.status(400).json({ success: false, message: "transcript is required" });
  }

  const trimmed = transcript.trim();

  const summaryPrompt =
    "Summarize the following visit transcript for a clinician handoff. " +
    "Keep it concise and structured with actionable bullets. " +
    `Transcript: ${trimmed}`;

  const extractionPrompt =
    "Analyse this daily health check-in transcript and respond ONLY with a JSON object " +
    "with two fields: " +
    "\"energy_level\" (one of: \"low\", \"medium\", \"high\") and " +
    "\"symptom_tags\" (array of short symptom strings, max 5, empty array if none). " +
    `Transcript: "${trimmed}"`;

  try {
    const [summary, extraction] = await Promise.all([
      generateInsight(summaryPrompt),
      generateInsight(extractionPrompt),
    ]);

    const parsedExtraction = parseCheckinExtraction(parseInsightJson(extraction.insight));
    return res.json({
      success: true,
      insight: summary.insight.trim(),
      ...parsedExtraction,
      extraction_source: "watsonx",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to process transcript.";
    return res.status(502).json({ success: false, message });
  }
});

router.post("/dashboard", async (req: Request, res: Response) => {
  const handoff = validateHandoff((req.body as { handoff?: unknown }).handoff);
  const carePlan = validateCarePlan((req.body as { carePlan?: unknown }).carePlan);

  if (!handoff && !carePlan) {
    return res.status(400).json({
      success: false,
      message: "handoff or carePlan context is required",
    });
  }

  const prompt =
    "Generate clinic dashboard JSON for a healthcare workflow app. " +
    "Return ONLY valid JSON with keys: clinicMetrics, todayVisits, pendingCarePlans, urgentAlerts. " +
    "clinicMetrics: array of 4 items with {label,value,change,tone} where tone is one of good|neutral|warning. " +
    "todayVisits: array of 1-6 items with {id,patient,reason,time,status} where status is one of Intake|In progress|Ready for plan. " +
    "pendingCarePlans: array of 1-6 items with {id,patient,updatedAgo,priority,blocker?} where priority is one of High|Medium|Low. " +
    "urgentAlerts: array of 0-4 items with {id,title,detail}. " +
    `Context: ${JSON.stringify({ handoff, carePlan })}.`;

  try {
    const { insight } = await generateInsight(prompt);
    const payload = parseDashboardPayload(parseInsightJson(insight));
    return res.json({ success: true, payload });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to build dashboard payload";
    return res.status(502).json({ success: false, message });
  }
});

router.post("/symptom-tracker", async (req: Request, res: Response) => {
  const handoff = validateHandoff((req.body as { handoff?: unknown }).handoff);
  if (!handoff) {
    return res.status(400).json({
      success: false,
      message: "valid handoff context is required",
    });
  }

  const prompt =
    "Generate symptom tracker JSON for a healthcare workflow app. " +
    "Return ONLY valid JSON with keys: trackerHeader, symptomLog, trendSeries. " +
    "trackerHeader fields: patientName, careContext, clinician, lastUpdated (all strings). " +
    "symptomLog: array of 4-8 items with {id,date,category,severity,state,notes,action}. " +
    "category must be one of Pelvic pain|Abnormal bleeding|Menopause symptoms|Postpartum recovery|Medication side effects. " +
    "severity must be a number from 0 to 10. state must be one of Active|Improving|Worsening|Follow-up needed. " +
    "trendSeries: array of 7 items with {date,pelvicPain,bleeding,hotFlashes}; all numeric fields are 0-10. " +
    `Context: ${JSON.stringify({ handoff })}.`;

  try {
    const { insight } = await generateInsight(prompt);
    const payload = parseTrackerPayload(parseInsightJson(insight));
    return res.json({ success: true, payload });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to build symptom tracker payload";
    return res.status(502).json({ success: false, message });
  }
});

router.post("/referrals-benefits", async (req: Request, res: Response) => {
  const handoff = validateHandoff((req.body as { handoff?: unknown }).handoff);
  const carePlan = validateCarePlan((req.body as { carePlan?: unknown }).carePlan);

  if (!handoff && !carePlan) {
    return res.status(400).json({
      success: false,
      message: "handoff or carePlan context is required",
    });
  }

  const prompt =
    "Generate referrals and benefits JSON for a healthcare workflow app. " +
    "Return ONLY valid JSON with keys: referralHeader, referralQueue, packetPreview, coverageSnapshot, blockerChecklist. " +
    "referralHeader fields: patientName, caseId, clinician, updatedAt, context (strings). " +
    "referralQueue: array of 2-6 items with {id,service,provider,status,reason,dueBy}; " +
    "status must be one of Ready to send|Needs documents|Pending review|Follow-up required. " +
    "packetPreview: array of 3-6 items with {section,included,note}. " +
    "coverageSnapshot: array of 2-5 items with {service,coverage,copay,authRequired,notes}. " +
    "blockerChecklist: array of 2-6 items with {id,item,owner,priority,complete}; " +
    "owner must be one of Patient|Clinic|Referring provider and priority one of High|Medium|Low. " +
    `Context: ${JSON.stringify({ handoff, carePlan })}.`;

  try {
    const { insight } = await generateInsight(prompt);
    let payload: ReferralPayload;
    try {
      payload = parseReferralPayload(parseInsightJson(insight));
    } catch (parseError: unknown) {
      const parseMessage =
        parseError instanceof Error ? parseError.message : "Failed to parse referrals payload";
      console.error("[/api/workflow/referrals-benefits] Parse error:", parseMessage);
      console.error("[/api/workflow/referrals-benefits] Raw insight:", insight);
      return res.status(502).json({ success: false, message: parseMessage });
    }
    return res.json({ success: true, payload });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to build referrals payload";
    return res.status(502).json({ success: false, message });
  }
});

export default router;
