import type { ComponentType } from "react";
import { Tag, Tile } from "@carbon/react";
import { StatusTag } from "@/components/ui/status-tag";
import { cn } from "@/lib/utils";

type SummaryTone = "blue" | "purple" | "neutral";

const toneClass: Record<SummaryTone, string> = {
  blue: "empowher-summary-tile--blue",
  purple: "empowher-summary-tile--purple",
  neutral: "empowher-summary-tile--neutral",
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
    <Tile className={cn("empowher-summary-tile p-4", toneClass[tone], className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium tracking-[0.02em] text-[#525252]">{label}</p>
          <p suppressHydrationWarning className="mt-2 text-sm font-semibold leading-5 text-[#161616]">
            {value}
          </p>
        </div>
        {Icon ? (
          <span className="empowher-summary-icon" aria-hidden>
            <Icon size={16} />
          </span>
        ) : null}
      </div>
      {helper ? <p className="mt-2 text-xs leading-5 text-[#697077]">{helper}</p> : null}
      {statusLabel ? (
        <div className="mt-3">
          <StatusTag label={statusLabel} tone={statusTone} />
        </div>
      ) : null}
      {tagLabel ? (
        <div className="mt-3">
          <Tag size="sm" type={tone === "purple" ? "purple" : tone === "blue" ? "blue" : "cool-gray"}>
            {tagLabel}
          </Tag>
        </div>
      ) : null}
    </Tile>
  );
}
