import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  Tag,
  Tile,
} from "@carbon/react";
import type { CoverageItem } from "@/lib/live-types";

export function BenefitsSummary({ coverage }: { coverage: CoverageItem[] }) {
  return (
    <Tile className="empowher-surface p-6">
      <h3 className="text-lg font-semibold tracking-tight text-[#161616]">Benefits Snapshot</h3>
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
                    <p className="font-medium text-[#161616]">{item.service}</p>
                    <p className="mt-1 text-xs text-[#697077]">{item.notes}</p>
                  </TableCell>
                  <TableCell>{item.coverage}</TableCell>
                  <TableCell>{item.copay}</TableCell>
                  <TableCell>
                    {item.authRequired ? (
                      <Tag type="warm-gray">Required</Tag>
                    ) : (
                      <Tag type="green">Not required</Tag>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </Tile>
  );
}
