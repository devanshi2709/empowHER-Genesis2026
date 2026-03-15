export type TrackerState = "Active" | "Improving" | "Worsening" | "Follow-up needed";

export type SymptomLogEntry = {
  id: string;
  date: string;
  category: "Pelvic pain" | "Abnormal bleeding" | "Menopause symptoms" | "Postpartum recovery" | "Medication side effects";
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

export const trackerHeader = {
  patientName: "Maya Rivera",
  careContext: "Cycle pain and irregular bleeding follow-up",
  clinician: "Dr. S. Kline",
  lastUpdated: "Today, 10:42 AM",
};

export const symptomLog: SymptomLogEntry[] = [
  {
    id: "SYM-119",
    date: "Mar 15",
    category: "Pelvic pain",
    severity: 7,
    state: "Active",
    notes: "Cramping returned overnight; pain improved after naproxen dose.",
    action: "Continue scheduled NSAID and monitor next 24h.",
  },
  {
    id: "SYM-118",
    date: "Mar 14",
    category: "Abnormal bleeding",
    severity: 5,
    state: "Improving",
    notes: "Flow decreased from prior cycle peak; no clots reported today.",
    action: "Keep cycle log and recheck ferritin results.",
  },
  {
    id: "SYM-117",
    date: "Mar 13",
    category: "Medication side effects",
    severity: 3,
    state: "Improving",
    notes: "Mild nausea after morning dose, resolved with food.",
    action: "Maintain with-food dosing instruction.",
  },
  {
    id: "SYM-116",
    date: "Mar 12",
    category: "Pelvic pain",
    severity: 8,
    state: "Follow-up needed",
    notes: "Pain spike interfered with work activities for several hours.",
    action: "Escalate follow-up if pain > 7 persists through next cycle day.",
  },
];

export const trendSeries: SymptomTrendPoint[] = [
  { date: "Mar 09", pelvicPain: 8, bleeding: 7, hotFlashes: 2 },
  { date: "Mar 10", pelvicPain: 7, bleeding: 6, hotFlashes: 2 },
  { date: "Mar 11", pelvicPain: 7, bleeding: 6, hotFlashes: 3 },
  { date: "Mar 12", pelvicPain: 8, bleeding: 5, hotFlashes: 2 },
  { date: "Mar 13", pelvicPain: 6, bleeding: 5, hotFlashes: 3 },
  { date: "Mar 14", pelvicPain: 6, bleeding: 4, hotFlashes: 2 },
  { date: "Mar 15", pelvicPain: 7, bleeding: 4, hotFlashes: 2 },
];
