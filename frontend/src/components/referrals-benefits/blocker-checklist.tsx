import { StatusTag } from "@/components/ui/status-tag";
import type { BlockerItem } from "@/lib/live-types";

const priorityTone: Record<BlockerItem["priority"], "danger" | "warning" | "neutral"> = {
  High:   "danger",
  Medium: "warning",
  Low:    "neutral",
};

export function BlockerChecklist({ blockers }: { blockers: BlockerItem[] }) {
  return (
    <div className="empowher-section-card p-6">
      <h3 className="text-base font-semibold tracking-tight text-[#0f172a]">Missing Documents & Blockers</h3>
      <p className="empowher-quiet-copy mt-1 text-sm">
        Resolve these items before provider handoff and appointment scheduling.
      </p>

      <ul className="mt-4 space-y-2.5">
        {blockers.map((blocker) => (
          <li key={blocker.id} className="empowher-surface-subtle rounded-[8px] p-3 transition-colors hover:bg-[#eff6ff]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium text-[#0f172a] text-sm">{blocker.item}</p>
              <div className="flex items-center gap-1.5">
                <StatusTag label={blocker.priority} tone={priorityTone[blocker.priority]} />
                <StatusTag
                  label={blocker.complete ? "Done" : "Open"}
                  tone={blocker.complete ? "success" : "neutral"}
                />
              </div>
            </div>
            <p className="mt-1.5 text-xs text-[#64748b]">
              <span className="font-medium">Owner:</span> {blocker.owner} · {blocker.id}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
