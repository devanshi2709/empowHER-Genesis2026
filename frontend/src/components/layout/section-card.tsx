import type { ReactNode } from "react";
import { Tile } from "@carbon/react";
import { cn } from "@/lib/utils";

type SectionCardProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

export function SectionCard({
  title,
  description,
  actions,
  children,
  className,
  contentClassName,
}: SectionCardProps) {
  return (
    <Tile className={cn("empowher-section-card p-5 md:p-6", className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-[#161616]">{title}</h3>
          {description ? <p className="empowher-quiet-copy mt-1 text-sm">{description}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
      <div className={cn("mt-4", contentClassName)}>{children}</div>
    </Tile>
  );
}
