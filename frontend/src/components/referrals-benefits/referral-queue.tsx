import type { CoordinationStatus, ReferralItem } from "@/lib/mock-referrals-benefits";
import { cn } from "@/lib/utils";

const statusTone: Record<CoordinationStatus, string> = {
  "Ready to send": "bg-emerald-100 text-emerald-700",
  "Needs documents": "bg-amber-100 text-amber-700",
  "Pending review": "bg-blue-100 text-blue-700",
  "Follow-up required": "bg-destructive/10 text-destructive",
};

export function ReferralQueue({ items }: { items: ReferralItem[] }) {
  return (
    <section className="rounded-xl border bg-card p-6 shadow-sm">
      <h3 className="text-lg font-semibold tracking-tight">Referral Queue</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Active gynecology referrals and requisitions awaiting handoff completion.
      </p>

      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item.id} className="rounded-lg border p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-medium">{item.service}</p>
                <p className="text-xs text-muted-foreground">{item.id} • {item.provider}</p>
              </div>
              <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", statusTone[item.status])}>
                {item.status}
              </span>
            </div>
            <p className="mt-3 text-sm">{item.reason}</p>
            <p className="mt-2 text-xs text-muted-foreground">Due: {item.dueBy}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
