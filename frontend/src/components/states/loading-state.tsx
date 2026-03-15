import { InlineLoading } from "@carbon/react";
import { cn } from "@/lib/utils";

type LoadingStateProps = {
  title?: string;
  description?: string;
  className?: string;
};

export function LoadingState({
  title = "Loading clinic workspace",
  description = "Preparing schedules, care plans, and patient context...",
  className,
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        "empowher-surface flex flex-col gap-4 p-6",
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-3">
        <InlineLoading status="active" description="" />
        <p className="text-sm font-medium text-[#0f172a]">{title}</p>
      </div>
      <div className="space-y-2.5">
        <div className="h-3 w-2/5 animate-pulse rounded-full bg-[#e2e8f0]" />
        <div className="h-2.5 w-full animate-pulse rounded-full bg-[#f1f5f9]" />
        <div className="h-2.5 w-4/5 animate-pulse rounded-full bg-[#f1f5f9]" />
        <div className="h-2.5 w-3/5 animate-pulse rounded-full bg-[#f1f5f9]" />
      </div>
      <p className="empowher-quiet-copy text-xs">{description}</p>
    </div>
  );
}
