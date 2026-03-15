import { StatusTag } from "@/components/ui/status-tag";
import type { CoordinationStatus, ReferralItem } from "@/lib/live-types";

const statusTone: Record<CoordinationStatus, "success" | "neutral" | "info" | "danger"> = {
  "Ready to send":      "success",
  "Needs documents":    "neutral",
  "Pending review":     "info",
  "Follow-up required": "danger",
};

export function ReferralQueue({ items }: { items: ReferralItem[] }) {
  return (
    <div className="empowher-section-card p-6">
      <h3 className="text-base font-semibold tracking-tight text-[#0f172a]">Referral Queue</h3>
      <p className="empowher-quiet-copy mt-1 text-sm">
        Active gynecology referrals and requisitions awaiting handoff completion.
      </p>

      <ul className="mt-4 space-y-2.5">
        {items.map((item) => (
          <li key={item.id} className="empowher-surface-subtle rounded-[8px] p-4 transition-colors hover:bg-[#eff6ff]">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-medium text-[#0f172a] text-sm">{item.service}</p>
                <p className="text-xs text-[#64748b]">{item.id} · {item.provider}</p>
              </div>
              <StatusTag label={item.status} tone={statusTone[item.status]} />
            </div>
            <p className="mt-2.5 text-sm text-[#334155]">{item.reason}</p>
            <p className="mt-1.5 text-xs text-[#64748b]">
              <span className="font-medium">Due:</span> {item.dueBy}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
