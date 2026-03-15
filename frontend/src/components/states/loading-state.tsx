import { InlineLoading, SkeletonText, Tile } from "@carbon/react";
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
    <Tile
      className={cn(
        "empowher-surface border-[#c5d6f3] bg-[#f3f7ff] p-6",
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <div className="space-y-3">
        <InlineLoading status="active" description={title} />
        <SkeletonText heading width="40%" />
        <SkeletonText width="95%" />
        <SkeletonText width="80%" />
      </div>
      <p className="empowher-quiet-copy mt-3 text-sm">{description}</p>
    </Tile>
  );
}
