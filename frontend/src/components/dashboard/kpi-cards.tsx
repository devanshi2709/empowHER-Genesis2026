import type { KpiMetric } from "@/lib/live-types";

const toneSurface: Record<KpiMetric["tone"], string> = {
  good:    "bg-[#f0fdf4] border border-[#a7f3d0]",
  neutral: "bg-[#eff6ff] border border-[#bfdbfe]",
  warning: "bg-[#f5f3ff] border border-[#ddd6fe]",
};

const toneAccent: Record<KpiMetric["tone"], string> = {
  good:    "bg-[#059669]",
  neutral: "bg-[#1e40af]",
  warning: "bg-[#7c3aed]",
};

const toneValueColor: Record<KpiMetric["tone"], string> = {
  good:    "text-[#065f46]",
  neutral: "text-[#1e3a8a]",
  warning: "text-[#4c1d95]",
};

const toneTagStyle: Record<KpiMetric["tone"], string> = {
  good:    "bg-[#d1fae5] text-[#059669] border border-[#a7f3d0]",
  neutral: "bg-[#dbeafe] text-[#1d4ed8] border border-[#bfdbfe]",
  warning: "bg-[#ede9fe] text-[#6d28d9] border border-[#ddd6fe]",
};

export function KpiCards({ metrics }: { metrics: KpiMetric[] }) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className={`relative overflow-hidden rounded-[10px] p-5 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md ${toneSurface[metric.tone]}`}
          style={{ boxShadow: "0 1px 3px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04)" }}
        >
          <span
            className={`absolute left-0 top-0 h-full w-[3px] ${toneAccent[metric.tone]}`}
            aria-hidden="true"
          />
          <p className="text-xs font-medium tracking-wide text-[#64748b] uppercase">{metric.label}</p>
          <p className={`mt-2 text-[2rem] font-bold tracking-tight leading-none ${toneValueColor[metric.tone]}`}>
            {metric.value}
          </p>
          <div className="mt-3">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${toneTagStyle[metric.tone]}`}
            >
              {metric.change}
            </span>
          </div>
        </div>
      ))}
    </section>
  );
}
