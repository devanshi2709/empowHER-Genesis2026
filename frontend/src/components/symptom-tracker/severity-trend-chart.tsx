"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { SymptomTrendPoint } from "@/lib/mock-symptom-tracker";

export function SeverityTrendChart({ trendSeries }: { trendSeries: SymptomTrendPoint[] }) {
  return (
    <section className="rounded-xl border bg-card p-6 shadow-sm">
      <h3 className="text-lg font-semibold tracking-tight">Symptom Severity Trend</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Daily severity trend for pelvic pain, abnormal bleeding, and menopause symptom burden.
      </p>

      <div className="mt-4 h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendSeries} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Line type="monotone" dataKey="pelvicPain" stroke="#0f766e" strokeWidth={2} name="Pelvic pain" />
            <Line type="monotone" dataKey="bleeding" stroke="#2563eb" strokeWidth={2} name="Bleeding" />
            <Line type="monotone" dataKey="hotFlashes" stroke="#c2410c" strokeWidth={2} name="Menopause symptoms" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
