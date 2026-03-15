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
    <section
      className={cn(
        "rounded-xl border bg-card p-6 shadow-sm",
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <div className="space-y-4">
        <div className="h-2 w-40 animate-pulse rounded bg-muted" />
        <div className="h-7 w-72 animate-pulse rounded bg-muted" />
        <div className="h-4 w-full max-w-2xl animate-pulse rounded bg-muted" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
      </div>
      <h2 className="mt-6 text-lg font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </section>
  );
}
