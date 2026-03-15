import type { VisitItem } from "@/lib/mock-dashboard";
import { cn } from "@/lib/utils";

const statusTone: Record<VisitItem["status"], string> = {
  Intake: "bg-slate-100 text-slate-700",
  "In progress": "bg-blue-100 text-blue-700",
  "Ready for plan": "bg-emerald-100 text-emerald-700",
};

export function TodayWorklist({ visits }: { visits: VisitItem[] }) {
  return (
    <section className="rounded-xl border bg-card p-5 shadow-sm">
      <h3 className="text-base font-semibold tracking-tight">Today&apos;s Visits</h3>
      <p className="mt-1 text-sm text-muted-foreground">Keep the clinic flow moving from intake to care plan.</p>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[34rem] text-left text-sm">
          <thead>
            <tr className="border-b text-muted-foreground">
              <th className="px-2 py-2 font-medium">Visit</th>
              <th className="px-2 py-2 font-medium">Patient</th>
              <th className="px-2 py-2 font-medium">Reason</th>
              <th className="px-2 py-2 font-medium">Time</th>
              <th className="px-2 py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {visits.map((visit) => (
              <tr key={visit.id} className="border-b last:border-0">
                <td className="px-2 py-3 font-medium">{visit.id}</td>
                <td className="px-2 py-3">{visit.patient}</td>
                <td className="px-2 py-3">{visit.reason}</td>
                <td className="px-2 py-3">{visit.time}</td>
                <td className="px-2 py-3">
                  <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", statusTone[visit.status])}>
                    {visit.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
