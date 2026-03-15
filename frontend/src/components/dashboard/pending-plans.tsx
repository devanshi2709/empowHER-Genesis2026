import Link from "next/link";
import type { CarePlanItem } from "@/lib/mock-dashboard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const priorityTone: Record<CarePlanItem["priority"], string> = {
  High: "bg-destructive/10 text-destructive",
  Medium: "bg-amber-100 text-amber-700",
  Low: "bg-slate-100 text-slate-700",
};

export function PendingPlans({ plans }: { plans: CarePlanItem[] }) {
  return (
    <section className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold tracking-tight">Care Plan Queue</h3>
          <p className="mt-1 text-sm text-muted-foreground">Prioritize plans that impact same-day coordination.</p>
        </div>
        <Link href="/care-plan">
          <Button size="sm">Open care plan workspace</Button>
        </Link>
      </div>

      <ul className="mt-4 space-y-3">
        {plans.map((plan) => (
          <li key={plan.id} className="rounded-lg border p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium">{plan.patient}</p>
              <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", priorityTone[plan.priority])}>
                {plan.priority} priority
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{plan.id} updated {plan.updatedAgo}</p>
            {plan.blocker ? <p className="mt-2 text-sm">Blocker: {plan.blocker}</p> : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
