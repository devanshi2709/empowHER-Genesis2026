import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
  onDark?: boolean;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
  onDark = false,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex flex-wrap items-start justify-between gap-x-6 gap-y-4", className)}>
      <div className="space-y-2.5">
        {eyebrow ? (
          <p
            className={cn(
              "text-xs font-semibold tracking-[0.08em] uppercase",
              onDark ? "text-blue-200" : "text-[#2563eb]",
            )}
          >
            {eyebrow}
          </p>
        ) : null}
        <h1
          className={cn(
            "text-[1.75rem] font-semibold leading-tight tracking-tight md:text-[2rem]",
            onDark ? "text-white" : "text-[#0f172a]",
          )}
        >
          {title}
        </h1>
        {description ? (
          <p
            className={cn(
              "max-w-3xl text-[0.95rem] leading-6",
              onDark ? "text-white/75" : "empowher-quiet-copy",
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-3">{actions}</div>
      ) : null}
    </div>
  );
}
