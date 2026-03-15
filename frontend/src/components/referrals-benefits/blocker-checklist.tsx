import type { BlockerItem } from "@/lib/mock-referrals-benefits";
import { cn } from "@/lib/utils";

const priorityTone: Record<BlockerItem["priority"], string> = {
  High: "bg-destructive/10 text-destructive",
  Medium: "bg-amber-100 text-amber-700",
  Low: "bg-slate-100 text-slate-700",
};

export function BlockerChecklist({ blockers }: { blockers: BlockerItem[] }) {
  return (
    <section className="rounded-xl border bg-card p-6 shadow-sm">
      <h3 className="text-lg font-semibold tracking-tight">Missing Documents and Blockers</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Resolve these items before provider handoff and appointment scheduling.
      </p>

      <ul className="mt-4 space-y-3">
        {blockers.map((blocker) => (
          <li key={blocker.id} className="rounded-lg border p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium">{blocker.item}</p>
              <div className="flex items-center gap-2">
                <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", priorityTone[blocker.priority])}>
                  {blocker.priority}
                </span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-semibold",
                    blocker.complete
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700",
                  )}
                >
                  {blocker.complete ? "Done" : "Open"}
                </span>
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Owner: {blocker.owner} • {blocker.id}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
