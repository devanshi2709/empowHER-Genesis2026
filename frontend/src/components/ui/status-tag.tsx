import { cn } from "@/lib/utils";

type StatusTone = "success" | "info" | "warning" | "danger" | "neutral";

const toneStyles: Record<StatusTone, string> = {
  success: "bg-[#f0fdf4] text-[#059669] border-[#a7f3d0]",
  info:    "bg-[#eff6ff] text-[#1e40af] border-[#bfdbfe]",
  warning: "bg-[#fffbeb] text-[#d97706] border-[#fde68a]",
  danger:  "bg-[#fef2f2] text-[#dc2626] border-[#fecaca]",
  neutral: "bg-[#f8fafc] text-[#475569] border-[#e2e8f0]",
};

type StatusTagProps = {
  label: string;
  tone?: StatusTone;
  className?: string;
};

export function StatusTag({ label, tone = "neutral", className }: StatusTagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        toneStyles[tone],
        className,
      )}
    >
      {label}
    </span>
  );
}
