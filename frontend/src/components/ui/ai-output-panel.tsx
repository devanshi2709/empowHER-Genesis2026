import type { ReactNode } from "react";
import { AILabel, AILabelContent, InlineNotification, Tile } from "@carbon/react";
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
    <Tile className={cn("empowher-ai-panel p-5 md:p-6", className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-[#161616]">{title}</h3>
          {description ? <p className="empowher-quiet-copy mt-1 text-sm">{description}</p> : null}
        </div>
        <div className="flex items-center gap-2">
          <StatusTag
            label={reviewed ? "Clinician reviewed" : "Needs clinician review"}
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
            title="Review required"
            subtitle="This AI-generated content should be validated by a clinician before finalizing care actions."
            className="!max-w-none rounded-md border border-[#e2d1ff] bg-[#f5efff]"
          />
        ) : null}
      </div>
    </Tile>
  );
}
