import { Tag, Tile } from "@carbon/react";
import type { KpiMetric } from "@/lib/live-types";

const toneTag: Record<KpiMetric["tone"], "green" | "blue" | "purple"> = {
  good: "green",
  neutral: "blue",
  warning: "purple",
};

const toneSurface: Record<KpiMetric["tone"], string> = {
  good: "border-[#bee7cb] bg-[#f1fbf4]",
  neutral: "border-[#c2d7fb] bg-[#f2f7ff]",
  warning: "border-[#d9c5fb] bg-[#f7f2ff]",
};

const toneAccent: Record<KpiMetric["tone"], string> = {
  good: "bg-[#24a148]",
  neutral: "bg-[#0f62fe]",
  warning: "bg-[#8a3ffc]",
};

export function KpiCards({ metrics }: { metrics: KpiMetric[] }) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <Tile
          key={metric.label}
          className={`empowher-surface relative overflow-hidden p-5 transition-transform duration-150 hover:-translate-y-0.5 ${toneSurface[metric.tone]}`}
        >
          <span className={`absolute left-0 top-0 h-full w-1 ${toneAccent[metric.tone]}`} aria-hidden />
          <p className="text-sm text-[#525252]">{metric.label}</p>
          <p className="mt-2 text-[2rem] font-semibold tracking-tight text-[#161616]">{metric.value}</p>
          <p className="mt-3">
            <Tag type={toneTag[metric.tone]}>{metric.change}</Tag>
          </p>
        </Tile>
      ))}
    </section>
  );
}
