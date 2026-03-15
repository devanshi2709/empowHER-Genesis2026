import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@carbon/react";
import { StatusTag } from "@/components/ui/status-tag";
import type { CoverageItem } from "@/lib/live-types";

export function BenefitsSummary({ coverage }: { coverage: CoverageItem[] }) {
  return (
    <div className="empowher-section-card p-6">
      <h3 className="text-base font-semibold tracking-tight text-[#0f172a]">Benefits Snapshot</h3>
      <p className="empowher-quiet-copy mt-1 text-sm">
        Coverage view for follow-up services to support patient counseling and scheduling.
      </p>

      <div className="mt-4">
        <TableContainer title="Coverage details" description="Payer requirements by service type.">
          <Table size="lg" aria-label="Benefits coverage table">
            <TableHead>
              <TableRow>
                <TableHeader>Service</TableHeader>
                <TableHeader>Coverage</TableHeader>
                <TableHeader>Copay</TableHeader>
                <TableHeader>Authorization</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {coverage.map((item) => (
                <TableRow key={item.service}>
                  <TableCell>
                    <p className="font-medium text-[#0f172a] text-sm">{item.service}</p>
                    <p className="mt-0.5 text-xs text-[#64748b]">{item.notes}</p>
                  </TableCell>
                  <TableCell>{item.coverage}</TableCell>
                  <TableCell>{item.copay}</TableCell>
                  <TableCell>
                    <StatusTag
                      label={item.authRequired ? "Required" : "Not required"}
                      tone={item.authRequired ? "warning" : "success"}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}
