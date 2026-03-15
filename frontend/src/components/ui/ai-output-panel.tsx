import type { ReactNode } from "react";
import { AILabel, AILabelContent, InlineNotification } from "@carbon/react";
import { StatusTag } from "@/components/ui/status-tag";
import { cn } from "@/lib/utils";

type AIOutputPanelProps = {
  title: string;
  description?: string;
  children: ReactNode;
  reviewed?: boolean;
  className?: string;
};

export function AIOutputPanel({
  title,
  description,
  children,
  reviewed = false,
  className,
}: AIOutputPanelProps) {
  return (
    <div className={cn("empowher-ai-panel p-5 md:p-6", className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span
              className="inline-flex h-6 w-6 items-center justify-center rounded-md text-xs"
              style={{
                background: "linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)",
                color: "white",
              }}
              aria-hidden="true"
            >
              ✦
            </span>
            <h3 className="text-base font-semibold tracking-tight text-[#0f172a]">{title}</h3>
          </div>
          {description ? (
            <p className="empowher-quiet-copy mt-1 text-sm">{description}</p>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <StatusTag
            label={reviewed ? "Clinician reviewed" : "Needs review"}
            tone={reviewed ? "success" : "warning"}
          />
          <AILabel kind="inline" textLabel="AI generated" size="sm">
            <AILabelContent>
              Generated from transcript and care context. Verify before acting.
            </AILabelContent>
          </AILabel>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {children}
        {!reviewed ? (
          <InlineNotification
            kind="warning"
            lowContrast
            hideCloseButton
            title="Clinician review required"
            subtitle="Validate this AI-generated content before finalizing care actions."
            className="!max-w-none"
          />
        ) : null}
      </div>
    </div>
  );
}
