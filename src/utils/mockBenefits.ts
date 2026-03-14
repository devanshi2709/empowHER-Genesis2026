/**
 * Mock insurance benefits data keyed by scan type and/or detected issue.
 * Used by the Advocacy "View covered benefits" modal.
 */

export interface MockBenefitEntry {
  provider: string;
  plan: string;
  coverage: string;
  copay: string;
  action: string;
  /** Optional short description for the modal. */
  description?: string;
}

export type MockBenefitsDB = Record<string, MockBenefitEntry>;

const DEFAULT_ENTRY: MockBenefitEntry = {
  provider: "EmpowHER Partner Health",
  plan: "Essential Wellness",
  coverage: "70%",
  copay: "$25",
  action: "Book General Consultation",
  description:
    "This issue qualifies for standard coverage under your Essential Wellness plan. A specialist visit may be recommended.",
};

/**
 * Mock benefits database keyed by scanType and selected detectedIssue values.
 * Lookup order: scanType first, then detectedIssue, then "default".
 */
export const MOCK_BENEFITS_DB: MockBenefitsDB = {
  default: DEFAULT_ENTRY,

  general: {
    provider: "Sun Life Financial",
    plan: "Standard Health",
    coverage: "80%",
    copay: "$20",
    action: "Book General Consultation",
    description:
      "This issue qualifies for 80% coverage under your Standard Health plan. You may schedule a general consultation with any in-network provider.",
  },

  oral: {
    provider: "Sun Life Financial",
    plan: "Dental + Vision Plus",
    coverage: "85%",
    copay: "$15",
    action: "Book Dental / Oral Consultation",
    description:
      "Oral and dental findings are covered at 85% under your Dental + Vision Plus plan. Diagnostic imaging may be covered in full when medically necessary.",
  },

  dermatology: {
    provider: "Sun Life Financial",
    plan: "Skin & Wellness",
    coverage: "90%",
    copay: "$30",
    action: "Book Dermatology Visit",
    description:
      "Dermatology visits are covered at 90% under your Skin & Wellness plan. Biopsies and follow-up care follow the same benefit level.",
  },

  gum_inflammation: {
    provider: "Sun Life Financial",
    plan: "Dental + Vision Plus",
    coverage: "85%",
    copay: "$15",
    action: "Book Periodontal Assessment",
    description:
      "Gum inflammation and periodontal concerns are covered at 85% under your Dental + Vision Plus plan.",
  },

  elevated_vascular_activity: {
    provider: "Sun Life Financial",
    plan: "Standard Health",
    coverage: "80%",
    copay: "$20",
    action: "Book Vascular / General Consultation",
    description:
      "Elevated vascular activity is covered under your Standard Health plan at 80%. Your provider may order additional tests to determine next steps.",
  },

  pigmentation_irregularity: {
    provider: "Sun Life Financial",
    plan: "Skin & Wellness",
    coverage: "90%",
    copay: "$30",
    action: "Book Dermatology Visit",
    description:
      "Pigmentation concerns are covered at 90% under your Skin & Wellness plan. A dermatologist can recommend a treatment plan.",
  },

  healthy_tissue: {
    provider: "Sun Life Financial",
    plan: "Standard Health",
    coverage: "N/A — No treatment needed",
    copay: "$0",
    action: "Continue routine care",
    description:
      "No significant findings. Your plan covers routine follow-ups; no prior authorization required for wellness visits.",
  },
};

/**
 * Resolve mock benefits for a given scan type and optional detected issue.
 * Tries detectedIssue first, then scanType (normalized to lowercase), then "default".
 */
export function getMockBenefits(
  scanType: string,
  detectedIssue?: string
): MockBenefitEntry {
  const key = (s: string) => s.trim().toLowerCase().replace(/\s+/g, "_");
  const issueKey = detectedIssue ? key(detectedIssue) : "";
  const typeKey = key(scanType);

  if (issueKey && MOCK_BENEFITS_DB[issueKey]) {
    return MOCK_BENEFITS_DB[issueKey];
  }
  if (MOCK_BENEFITS_DB[typeKey]) {
    return MOCK_BENEFITS_DB[typeKey];
  }
  return MOCK_BENEFITS_DB.default;
}
