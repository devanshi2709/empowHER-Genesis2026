import { StatusTag } from "@/components/ui/status-tag";
import type { PacketSection } from "@/lib/live-types";

export function PacketPreview({ sections }: { sections: PacketSection[] }) {
  return (
    <div className="empowher-section-card p-6">
      <h3 className="text-base font-semibold tracking-tight text-[#0f172a]">Referral Packet Preview</h3>
      <p className="empowher-quiet-copy mt-1 text-sm">
        Validate packet completeness before sending to imaging, physio, and counseling partners.
      </p>

      <ul className="mt-4 space-y-2.5">
        {sections.map((section) => (
          <li key={section.section} className="empowher-surface-subtle rounded-[8px] p-3 transition-colors hover:bg-[#eff6ff]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium text-[#0f172a] text-sm">{section.section}</p>
              <StatusTag
                label={section.included ? "Included" : "Missing"}
                tone={section.included ? "success" : "warning"}
              />
            </div>
            <p className="mt-1.5 text-xs text-[#64748b]">{section.note}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
