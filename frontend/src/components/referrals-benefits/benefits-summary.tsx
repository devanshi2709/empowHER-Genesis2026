import type { CoverageItem } from "@/lib/mock-referrals-benefits";

export function BenefitsSummary({ coverage }: { coverage: CoverageItem[] }) {
  return (
    <section className="rounded-xl border bg-card p-6 shadow-sm">
      <h3 className="text-lg font-semibold tracking-tight">Benefits Snapshot</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Coverage view for follow-up services to support patient counseling and scheduling.
      </p>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[32rem] text-left text-sm">
          <thead>
            <tr className="border-b text-muted-foreground">
              <th className="px-2 py-2 font-medium">Service</th>
              <th className="px-2 py-2 font-medium">Coverage</th>
              <th className="px-2 py-2 font-medium">Copay</th>
              <th className="px-2 py-2 font-medium">Authorization</th>
            </tr>
          </thead>
          <tbody>
            {coverage.map((item) => (
              <tr key={item.service} className="border-b align-top last:border-0">
                <td className="px-2 py-3">
                  <p className="font-medium">{item.service}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.notes}</p>
                </td>
                <td className="px-2 py-3">{item.coverage}</td>
                <td className="px-2 py-3">{item.copay}</td>
                <td className="px-2 py-3">
                  {item.authRequired ? (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                      Required
                    </span>
                  ) : (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                      Not required
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
