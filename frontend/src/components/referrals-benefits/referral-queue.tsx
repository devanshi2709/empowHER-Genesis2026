import { Tag, Tile } from "@carbon/react";
import type { CoordinationStatus, ReferralItem } from "@/lib/live-types";

const statusTone: Record<CoordinationStatus, "green" | "warm-gray" | "blue" | "red"> = {
  "Ready to send": "green",
  "Needs documents": "warm-gray",
  "Pending review": "blue",
  "Follow-up required": "red",
};

export function ReferralQueue({ items }: { items: ReferralItem[] }) {
  return (
    <Tile className="empowher-surface p-6">
      <h3 className="text-lg font-semibold tracking-tight text-[#161616]">Referral Queue</h3>
      <p className="empowher-quiet-copy mt-1 text-sm">
        Active gynecology referrals and requisitions awaiting handoff completion.
      </p>

      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item.id} className="empowher-surface-subtle p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-medium text-[#161616]">{item.service}</p>
                <p className="text-xs text-[#697077]">{item.id} • {item.provider}</p>
              </div>
              <Tag type={statusTone[item.status]}>{item.status}</Tag>
            </div>
            <p className="mt-3 text-sm text-[#393939]">{item.reason}</p>
            <p className="mt-2 text-xs text-[#697077]">Due: {item.dueBy}</p>
          </li>
        ))}
      </ul>
    </Tile>
  );
}
