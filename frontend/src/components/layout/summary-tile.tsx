import type { ComponentType } from "react";
import { StatusTag } from "@/components/ui/status-tag";
import { cn } from "@/lib/utils";

type SummaryTone = "blue" | "purple" | "neutral";

const toneClass: Record<SummaryTone, string> = {
  blue:    "empowher-summary-tile--blue",
  purple:  "empowher-summary-tile--purple",
  neutral: "empowher-summary-tile--neutral",
};

const tagToneClass: Record<SummaryTone, string> = {
  blue:    "bg-[#dbeafe] text-[#1d4ed8] border-[#bfdbfe]",
  purple:  "bg-[#ede9fe] text-[#6d28d9] border-[#ddd6fe]",
  neutral: "bg-[#f1f5f9] text-[#475569] border-[#e2e8f0]",
};

type SummaryTileProps = {
  label: string;
  value: string;
  helper?: string;
  tone?: SummaryTone;
  icon?: ComponentType<{ className?: string; size?: number }>;
  tagLabel?: string;
  statusLabel?: string;
  statusTone?: "success" | "info" | "warning" | "danger" | "neutral";
  className?: string;
};

export function SummaryTile({
  label,
  value,
  helper,
  tone = "neutral",
  icon: Icon,
  tagLabel,
  statusLabel,
  statusTone,
  className,
}: SummaryTileProps) {
  return (
    <div className={cn("empowher-summary-tile p-4", toneClass[tone], className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium tracking-[0.02em] text-[#64748b]">{label}</p>
          <p
            suppressHydrationWarning
            className="mt-1.5 text-sm font-semibold leading-5 text-[#0f172a]"
          >
            {value}
          </p>
        </div>
        {Icon ? (
          <span className="empowher-summary-icon" aria-hidden="true">
            <Icon size={16} />
          </span>
        ) : null}
      </div>
      {helper ? (
        <p className="mt-2 text-xs leading-5 text-[#64748b]">{helper}</p>
      ) : null}
      {statusLabel ? (
        <div className="mt-3">
          <StatusTag label={statusLabel} tone={statusTone} />
        </div>
      ) : null}
      {tagLabel ? (
        <div className="mt-3">
          <span
            className={cn(
              "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
              tagToneClass[tone],
            )}
          >
            {tagLabel}
          </span>
        </div>
      ) : null}
    </div>
  );
}
