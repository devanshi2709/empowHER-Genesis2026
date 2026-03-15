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

export const clinicMetrics: KpiMetric[] = [
  { label: "Patients today", value: "18", change: "+3 vs avg", tone: "good" },
  { label: "Plans pending", value: "5", change: "2 due this hour", tone: "warning" },
  { label: "Avg. turnaround", value: "14m", change: "-4m this week", tone: "good" },
  { label: "Referrals flagged", value: "3", change: "1 urgent", tone: "neutral" },
];

export const todayVisits: VisitItem[] = [
  {
    id: "VIS-241",
    patient: "A. Thompson",
    reason: "Pelvic pain follow-up",
    time: "09:40",
    status: "In progress",
  },
  {
    id: "VIS-242",
    patient: "M. Rivera",
    reason: "Irregular cycle",
    time: "10:20",
    status: "Ready for plan",
  },
  {
    id: "VIS-243",
    patient: "J. Patel",
    reason: "Post-op check",
    time: "11:00",
    status: "Intake",
  },
  {
    id: "VIS-244",
    patient: "C. Nguyen",
    reason: "Endometriosis consult",
    time: "11:30",
    status: "Intake",
  },
];

export const pendingCarePlans: CarePlanItem[] = [
  {
    id: "PLAN-781",
    patient: "M. Rivera",
    updatedAgo: "6 min ago",
    priority: "High",
    blocker: "Awaiting medication preference",
  },
  {
    id: "PLAN-779",
    patient: "N. Collins",
    updatedAgo: "14 min ago",
    priority: "Medium",
  },
  {
    id: "PLAN-777",
    patient: "B. Chen",
    updatedAgo: "22 min ago",
    priority: "Low",
  },
];

export const urgentAlerts = [
  {
    id: "ALT-33",
    title: "Same-day referral review",
    detail: "A. Thompson requires specialist referral packet before 1:00 PM.",
  },
];
