export type KpiMetric = {
  label: string;
  value: string;
  change: string;
  tone: "good" | "neutral" | "warning";
};

export type VisitItem = {
  id: string;
  patient: string;
  reason: string;
  time: string;
  status: "Intake" | "In progress" | "Ready for plan";
};

export type CarePlanItem = {
  id: string;
  patient: string;
  updatedAgo: string;
  priority: "High" | "Medium" | "Low";
  blocker?: string;
};

export type DashboardPayload = {
  clinicMetrics: KpiMetric[];
  todayVisits: VisitItem[];
  pendingCarePlans: CarePlanItem[];
  urgentAlerts: Array<{ id: string; title: string; detail: string }>;
};

export type TrackerState = "Active" | "Improving" | "Worsening" | "Follow-up needed";

export type SymptomLogEntry = {
  id: string;
  date: string;
  category:
    | "Pelvic pain"
    | "Abnormal bleeding"
    | "Menopause symptoms"
    | "Postpartum recovery"
    | "Medication side effects";
  severity: number;
  state: TrackerState;
  notes: string;
  action: string;
};

export type SymptomTrendPoint = {
  date: string;
  pelvicPain: number;
  bleeding: number;
  hotFlashes: number;
};

export type TrackerPayload = {
  trackerHeader: {
    patientName: string;
    careContext: string;
    clinician: string;
    lastUpdated: string;
  };
  symptomLog: SymptomLogEntry[];
  trendSeries: SymptomTrendPoint[];
};

export type CoordinationStatus =
  | "Ready to send"
  | "Needs documents"
  | "Pending review"
  | "Follow-up required";

export type ReferralItem = {
  id: string;
  service: string;
  provider: string;
  status: CoordinationStatus;
  reason: string;
  dueBy: string;
};

export type CoverageItem = {
  service: string;
  coverage: string;
  copay: string;
  authRequired: boolean;
  notes: string;
};

export type BlockerItem = {
  id: string;
  item: string;
  owner: "Patient" | "Clinic" | "Referring provider";
  priority: "High" | "Medium" | "Low";
  complete: boolean;
};

export type PacketSection = {
  section: string;
  included: boolean;
  note: string;
};

export type ReferralPayload = {
  referralHeader: {
    patientName: string;
    caseId: string;
    clinician: string;
    updatedAt: string;
    context: string;
  };
  referralQueue: ReferralItem[];
  packetPreview: PacketSection[];
  coverageSnapshot: CoverageItem[];
  blockerChecklist: BlockerItem[];
};
