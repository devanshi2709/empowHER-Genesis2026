import Link from "next/link";
import { Tag, Tile } from "@carbon/react";
import type { CarePlanItem } from "@/lib/live-types";
import { Button } from "@/components/ui/button";

const priorityTone: Record<CarePlanItem["priority"], "red" | "warm-gray" | "gray"> = {
  High: "red",
  Medium: "warm-gray",
  Low: "gray",
};

export function PendingPlans({ plans }: { plans: CarePlanItem[] }) {
  return (
    <Tile className="empowher-surface p-5 md:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-[#161616]">Care Plan Queue</h3>
          <p className="empowher-quiet-copy mt-1 text-sm">Prioritize plans that impact same-day coordination.</p>
        </div>
        <Button as={Link} href="/care-plan" size="sm" variant="outline">
          Open care plan workspace
        </Button>
      </div>

      <ul className="mt-4 space-y-3">
        {plans.map((plan) => (
          <li key={plan.id} className="empowher-surface-subtle p-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium text-[#161616]">{plan.patient}</p>
              <Tag type={priorityTone[plan.priority]}>{plan.priority} priority</Tag>
            </div>
            <p className="mt-1 text-xs text-[#697077]">{plan.id} updated {plan.updatedAgo}</p>
            {plan.blocker ? <p className="mt-2 text-sm text-[#525252]">Blocker: {plan.blocker}</p> : null}
          </li>
        ))}
      </ul>
    </Tile>
  );
}
