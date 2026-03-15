export type CarePlanTask = {
  id: string;
  title: string;
  owner: "Clinician" | "Nurse" | "Front Desk" | "Patient";
  due: string;
  completed: boolean;
};

export type MedicationPlan = {
  name: string;
  dose: string;
  instructions: string;
};

export type TestOrder = {
  test: string;
  reason: string;
  timing: string;
};

export type ReferralItem = {
  specialty: string;
  urgency: "Urgent" | "Routine";
  reason: string;
};

export type CarePlanRecord = {
  patientName: string;
  visitId: string;
  reviewedBy: string;
  updatedAt: string;
  summary: string;
  diagnosisNotes: string[];
  patientInstructions: string[];
  followUpTasks: CarePlanTask[];
  medications: MedicationPlan[];
  tests: TestOrder[];
  referrals: ReferralItem[];
};

export const demoCarePlan: CarePlanRecord = {
  patientName: "Maya Rivera",
  visitId: "VIS-242",
  reviewedBy: "Dr. S. Kline",
  updatedAt: "Today at 10:24 AM",
  summary:
    "Likely primary dysmenorrhea with increased pain burden this cycle. No acute red-flag symptoms today. Start symptom-focused treatment and reassess response in 4 weeks.",
  diagnosisNotes: [
    "Pain pattern worsens in first 48 hours of cycle.",
    "No fever, no acute GI symptoms, no hemodynamic instability.",
    "Patient prefers conservative first-line plan before imaging escalation.",
  ],
  patientInstructions: [
    "Start scheduled NSAID 24 hours before expected cycle start when possible.",
    "Track pain severity and bleeding pattern daily for the next cycle.",
    "Contact clinic sooner for severe breakthrough pain or new concerning symptoms.",
  ],
  followUpTasks: [
    {
      id: "task-1",
      title: "Confirm medication counseling completed",
      owner: "Nurse",
      due: "Today",
      completed: true,
    },
    {
      id: "task-2",
      title: "Schedule 4-week follow-up visit",
      owner: "Front Desk",
      due: "Today",
      completed: false,
    },
    {
      id: "task-3",
      title: "Send home-care instructions in patient portal",
      owner: "Clinician",
      due: "Within 2 hours",
      completed: false,
    },
    {
      id: "task-4",
      title: "Complete symptom log before follow-up",
      owner: "Patient",
      due: "Before next visit",
      completed: false,
    },
  ],
  medications: [
    {
      name: "Naproxen",
      dose: "500 mg PO BID",
      instructions: "Take with food during first 2-3 days of menstrual pain.",
    },
  ],
  tests: [
    {
      test: "CBC + ferritin",
      reason: "Assess fatigue and heavy bleeding risk.",
      timing: "Within 7 days",
    },
  ],
  referrals: [
    {
      specialty: "Pelvic pain specialist",
      urgency: "Routine",
      reason: "Escalate if no meaningful improvement after trial cycle.",
    },
  ],
};
