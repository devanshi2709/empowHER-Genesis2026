import type { ReactNode } from "react";
import { InlineNotification, Tile } from "@carbon/react";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <Tile
      className={cn(
        "empowher-surface border-dashed border-[#bfd0ec] bg-[#f8fbff] p-6 text-center",
        className,
      )}
    >
      <InlineNotification
        kind="info"
        lowContrast
        hideCloseButton
        title={title}
        subtitle={description}
        className="!mx-auto !max-w-3xl rounded-md border border-[#d6e2f5] bg-[#eef4ff] text-left"
      />
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </Tile>
  );
}
