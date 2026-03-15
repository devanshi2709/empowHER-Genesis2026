import { Tag, Tile } from "@carbon/react";
import type { BlockerItem } from "@/lib/live-types";

const priorityTone: Record<BlockerItem["priority"], "red" | "warm-gray" | "gray"> = {
  High: "red",
  Medium: "warm-gray",
  Low: "gray",
};

export function BlockerChecklist({ blockers }: { blockers: BlockerItem[] }) {
  return (
    <Tile className="empowher-surface p-6">
      <h3 className="text-lg font-semibold tracking-tight text-[#161616]">Missing Documents and Blockers</h3>
      <p className="empowher-quiet-copy mt-1 text-sm">
        Resolve these items before provider handoff and appointment scheduling.
      </p>

      <ul className="mt-4 space-y-3">
        {blockers.map((blocker) => (
          <li key={blocker.id} className="empowher-surface-subtle p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium text-[#161616]">{blocker.item}</p>
              <div className="flex items-center gap-2">
                <Tag type={priorityTone[blocker.priority]}>{blocker.priority}</Tag>
                <Tag type={blocker.complete ? "green" : "warm-gray"}>
                  {blocker.complete ? "Done" : "Open"}
                </Tag>
              </div>
            </div>
            <p className="mt-2 text-xs text-[#697077]">Owner: {blocker.owner} • {blocker.id}</p>
          </li>
        ))}
      </ul>
    </Tile>
  );
}
