import { Tag, Tile } from "@carbon/react";
import type { SymptomLogEntry, TrackerState } from "@/lib/live-types";

const stateTone: Record<TrackerState, "blue" | "green" | "warm-gray" | "red"> = {
  Active: "blue",
  Improving: "green",
  Worsening: "warm-gray",
  "Follow-up needed": "red",
};

export function SymptomHistory({ entries }: { entries: SymptomLogEntry[] }) {
  return (
    <Tile className="empowher-surface p-6">
      <h3 className="text-lg font-semibold tracking-tight text-[#161616]">Symptom Log History</h3>
      <p className="empowher-quiet-copy mt-1 text-sm">
        Visit-ready symptom notes with severity, state assessment, and recommended next action.
      </p>

      <ul className="mt-4 space-y-3">
        {entries.map((entry) => (
          <li key={entry.id} className="empowher-surface-subtle p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-medium text-[#161616]">{entry.category}</p>
                <p className="text-xs text-[#697077]">{entry.id} • {entry.date}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Tag type="gray">Severity {entry.severity}/10</Tag>
                <Tag type={stateTone[entry.state]}>{entry.state}</Tag>
              </div>
            </div>
            <p className="mt-3 text-sm text-[#393939]">{entry.notes}</p>
            <p className="mt-2 text-xs text-[#697077]">Action: {entry.action}</p>
          </li>
        ))}
      </ul>
    </Tile>
  );
}
