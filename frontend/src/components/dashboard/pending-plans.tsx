import Link from "next/link";
import type { CarePlanItem } from "@/lib/live-types";
import { Button } from "@/components/ui/button";
import { StatusTag } from "@/components/ui/status-tag";

const priorityTone: Record<CarePlanItem["priority"], "danger" | "warning" | "neutral"> = {
  High:   "danger",
  Medium: "warning",
  Low:    "neutral",
};

export function PendingPlans({ plans }: { plans: CarePlanItem[] }) {
  return (
    <div className="empowher-section-card p-5 md:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold tracking-tight text-[#0f172a]">Care Plan Queue</h3>
          <p className="empowher-quiet-copy mt-1 text-sm">
            Prioritize plans that impact same-day coordination.
          </p>
        </div>
        <Button as={Link} href="/care-plan" size="sm" variant="outline">
          Open workspace
        </Button>
      </div>

      <ul className="mt-4 space-y-2.5">
        {plans.map((plan) => (
          <li
            key={plan.id}
            className="empowher-surface-subtle rounded-[8px] p-3.5 transition-colors hover:bg-[#eff6ff]"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium text-[#0f172a] text-sm">{plan.patient}</p>
              <StatusTag label={`${plan.priority} priority`} tone={priorityTone[plan.priority]} />
            </div>
            <p className="mt-1 text-xs text-[#64748b]">
              {plan.id} · updated {plan.updatedAgo}
            </p>
            {plan.blocker ? (
              <p className="mt-1.5 text-xs text-[#475569]">
                <span className="font-medium">Blocker:</span> {plan.blocker}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
