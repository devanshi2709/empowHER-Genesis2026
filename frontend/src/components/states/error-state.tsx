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
    <section
      className={cn(
        "rounded-xl border border-destructive/30 bg-destructive/5 p-6 shadow-sm",
        className,
      )}
      role="alert"
    >
      <p className="text-sm font-semibold text-destructive">Issue detected</p>
      <h2 className="mt-1 text-lg font-semibold tracking-tight">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </section>
  );
}
