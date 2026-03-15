import type { PacketSection } from "@/lib/mock-referrals-benefits";
import { cn } from "@/lib/utils";

export function PacketPreview({ sections }: { sections: PacketSection[] }) {
  return (
    <section className="rounded-xl border bg-card p-6 shadow-sm">
      <h3 className="text-lg font-semibold tracking-tight">Referral Packet Preview</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Validate packet completeness before sending to imaging, physio, and counseling partners.
      </p>

      <ul className="mt-4 space-y-3">
        {sections.map((section) => (
          <li key={section.section} className="rounded-lg border p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium">{section.section}</p>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs font-semibold",
                  section.included
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700",
                )}
              >
                {section.included ? "Included" : "Missing"}
              </span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{section.note}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
