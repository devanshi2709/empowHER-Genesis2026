import type { KpiMetric } from "@/lib/mock-dashboard";
import { cn } from "@/lib/utils";

const toneStyles: Record<KpiMetric["tone"], string> = {
  good: "text-emerald-700 bg-emerald-50 border-emerald-200",
  neutral: "text-blue-700 bg-blue-50 border-blue-200",
  warning: "text-amber-700 bg-amber-50 border-amber-200",
};

export function KpiCards({ metrics }: { metrics: KpiMetric[] }) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <article key={metric.label} className="rounded-xl border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">{metric.label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight">{metric.value}</p>
          <p
            className={cn(
              "mt-3 inline-flex rounded-full border px-2 py-0.5 text-xs font-medium",
              toneStyles[metric.tone],
            )}
          >
            {metric.change}
          </p>
        </article>
      ))}
    </section>
  );
}
