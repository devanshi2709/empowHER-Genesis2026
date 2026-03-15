import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-[10px] border border-dashed border-[#bfdbfe] bg-[#f8fbff] p-8 text-center",
        className,
      )}
    >
      <div className="mx-auto max-w-md">
        <div
          className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full"
          style={{ background: "linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)", border: "1px solid #c7d2fe" }}
          aria-hidden="true"
        >
          <span className="text-lg text-[#1e40af]">◎</span>
        </div>
        <h3 className="text-base font-semibold text-[#0f172a]">{title}</h3>
        <p className="empowher-quiet-copy mt-2 text-sm leading-6">{description}</p>
        {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
      </div>
    </div>
  );
}
