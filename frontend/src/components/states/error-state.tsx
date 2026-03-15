import type { ReactNode } from "react";
import { InlineNotification, Tile } from "@carbon/react";
import { cn } from "@/lib/utils";

type ErrorStateProps = {
  title?: string;
  description: string;
  action?: ReactNode;
  className?: string;
};

export function ErrorState({
  title = "Something needs attention",
  description,
  action,
  className,
}: ErrorStateProps) {
  return (
    <Tile
      className={cn(
        "empowher-surface border-[#f1c6cd] bg-[#fff5f6] p-5",
        className,
      )}
      role="alert"
    >
      <InlineNotification
        kind="error"
        lowContrast
        hideCloseButton
        title={title}
        subtitle={description}
        className="!max-w-none rounded-md border border-[#f2d3d7] bg-[#fff1f3]"
      />
      {action ? <div className="mt-4">{action}</div> : null}
    </Tile>
  );
}
