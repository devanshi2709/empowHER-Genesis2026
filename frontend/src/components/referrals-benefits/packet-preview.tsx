import { Tag, Tile } from "@carbon/react";
import type { PacketSection } from "@/lib/live-types";

export function PacketPreview({ sections }: { sections: PacketSection[] }) {
  return (
    <Tile className="empowher-surface p-6">
      <h3 className="text-lg font-semibold tracking-tight text-[#161616]">Referral Packet Preview</h3>
      <p className="empowher-quiet-copy mt-1 text-sm">
        Validate packet completeness before sending to imaging, physio, and counseling partners.
      </p>

      <ul className="mt-4 space-y-3">
        {sections.map((section) => (
          <li key={section.section} className="empowher-surface-subtle p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium text-[#161616]">{section.section}</p>
              <Tag type={section.included ? "green" : "warm-gray"}>
                {section.included ? "Included" : "Missing"}
              </Tag>
            </div>
            <p className="mt-2 text-xs text-[#697077]">{section.note}</p>
          </li>
        ))}
      </ul>
    </Tile>
  );
}
