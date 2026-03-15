import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex flex-wrap items-start justify-between gap-x-6 gap-y-4", className)}>
      <div className="space-y-2.5">
        {eyebrow ? (
          <p className="text-xs font-semibold tracking-[0.08em] text-[#0f62fe] uppercase">{eyebrow}</p>
        ) : null}
        <h1 className="text-[1.75rem] font-semibold leading-tight tracking-tight text-[#161616] md:text-[2rem]">
          {title}
        </h1>
        {description ? (
          <p className="empowher-quiet-copy max-w-3xl text-[0.95rem] leading-6">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
    </div>
  );
}
