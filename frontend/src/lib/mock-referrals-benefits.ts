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

export const referralHeader = {
  patientName: "Maya Rivera",
  caseId: "REF-204",
  clinician: "Dr. S. Kline",
  updatedAt: "Today, 11:08 AM",
  context: "Pelvic pain escalation and care coordination",
};

export const referralQueue: ReferralItem[] = [
  {
    id: "R-11",
    service: "Pelvic floor physiotherapy",
    provider: "Harbor Women\'s PT",
    status: "Ready to send",
    reason: "Persistent pelvic floor tension and pain with activity.",
    dueBy: "Send today",
  },
  {
    id: "R-12",
    service: "Transvaginal ultrasound requisition",
    provider: "Lakeside Imaging",
    status: "Needs documents",
    reason: "Rule out structural causes due to worsening cycle pain.",
    dueBy: "Within 48h",
  },
  {
    id: "R-13",
    service: "Counseling support referral",
    provider: "Women\'s Mental Health Network",
    status: "Pending review",
    reason: "Stress burden and sleep disruption tied to chronic pain.",
    dueBy: "Clinician sign-off",
  },
  {
    id: "R-14",
    service: "Gynecology follow-up consult",
    provider: "Internal specialist pool",
    status: "Follow-up required",
    reason: "Needs symptom log attached before scheduling.",
    dueBy: "Before booking",
  },
];

export const packetPreview: PacketSection[] = [
  {
    section: "Visit summary + care plan",
    included: true,
    note: "Signed and ready for specialist review.",
  },
  {
    section: "Medication and allergy list",
    included: true,
    note: "Updated during current visit.",
  },
  {
    section: "Symptom tracker export (last 14 days)",
    included: true,
    note: "Includes pain and bleeding trend graph.",
  },
  {
    section: "Imaging requisition form",
    included: false,
    note: "Missing ordering clinician signature.",
  },
];

export const coverageSnapshot: CoverageItem[] = [
  {
    service: "Pelvic floor physiotherapy",
    coverage: "80% after deductible",
    copay: "$25",
    authRequired: false,
    notes: "Up to 8 sessions/year covered.",
  },
  {
    service: "Diagnostic pelvic ultrasound",
    coverage: "100% in-network",
    copay: "$0",
    authRequired: true,
    notes: "Authorization needed before appointment confirmation.",
  },
  {
    service: "Counseling / mental health intake",
    coverage: "70% in-network",
    copay: "$35",
    authRequired: false,
    notes: "Virtual visits included.",
  },
];

export const blockerChecklist: BlockerItem[] = [
  {
    id: "B-1",
    item: "Signed imaging requisition",
    owner: "Referring provider",
    priority: "High",
    complete: false,
  },
  {
    id: "B-2",
    item: "Insurance authorization number for ultrasound",
    owner: "Clinic",
    priority: "High",
    complete: false,
  },
  {
    id: "B-3",
    item: "Preferred contact window confirmation",
    owner: "Patient",
    priority: "Medium",
    complete: true,
  },
  {
    id: "B-4",
    item: "Attach most recent symptom tracker PDF",
    owner: "Clinic",
    priority: "Medium",
    complete: true,
  },
];
