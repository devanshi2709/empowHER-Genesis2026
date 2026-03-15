import Link from "next/link";
import { Button } from "@/components/ui/button";
import { demoFlowSteps, getFlowNeighbors, type DemoFlowStepKey } from "@/lib/demo-flow";
import { cn } from "@/lib/utils";

export function DemoFlow({ current }: { current: DemoFlowStepKey }) {
  const { previous, next } = getFlowNeighbors(current);

  return (
    <section className="rounded-xl border bg-card p-4 shadow-sm">
      <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">End-to-end demo path</p>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
        {demoFlowSteps.map((step) => (
          <span
            key={step.key}
            className={cn(
              "rounded-full border px-2 py-0.5",
              step.key === current
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground",
            )}
          >
            {step.label}
          </span>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {previous ? (
          <Link href={previous.href}>
            <Button variant="outline" size="sm">Back: {previous.label}</Button>
          </Link>
        ) : null}
        {next ? (
          <Link href={next.href}>
            <Button size="sm">Next: {next.label}</Button>
          </Link>
        ) : null}
      </div>
    </section>
  );
}
