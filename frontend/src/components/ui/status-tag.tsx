import { Tag } from "@carbon/react";

type StatusTone = "success" | "info" | "warning" | "danger" | "neutral";

const toneMap: Record<StatusTone, "green" | "blue" | "purple" | "red" | "cool-gray"> = {
  success: "green",
  info: "blue",
  warning: "purple",
  danger: "red",
  neutral: "cool-gray",
};

type StatusTagProps = {
  label: string;
  tone?: StatusTone;
};

export function StatusTag({ label, tone = "neutral" }: StatusTagProps) {
  return <Tag type={toneMap[tone]}>{label}</Tag>;
}
