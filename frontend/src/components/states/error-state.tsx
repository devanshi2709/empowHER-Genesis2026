import type { ReactNode } from "react";
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
    <div
      className={cn(
        "rounded-[10px] border border-[#fecaca] bg-[#fef2f2] p-5",
        className,
      )}
      role="alert"
    >
      <div className="flex gap-3">
        <span
          className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#fee2e2] text-xs font-bold text-[#dc2626]"
          aria-hidden="true"
        >
          !
        </span>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-[#991b1b]">{title}</h3>
          <p className="mt-1 text-sm text-[#b91c1c]">{description}</p>
          {action ? <div className="mt-4">{action}</div> : null}
        </div>
      </div>
    </div>
  );
}
