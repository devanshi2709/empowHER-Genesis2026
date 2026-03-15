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
import type { VisitItem } from "@/lib/live-types";

const statusTone: Record<VisitItem["status"], "gray" | "blue" | "green"> = {
  Intake: "gray",
  "In progress": "blue",
  "Ready for plan": "green",
};

export function TodayWorklist({ visits }: { visits: VisitItem[] }) {
  return (
    <Tile className="empowher-surface p-5 md:p-6">
      <TableContainer
        title="Today's Visits"
        description="Keep each visit moving from intake to care-plan readiness."
      >
        <Table size="lg" aria-label="Today visits table">
          <TableHead>
            <TableRow>
              <TableHeader>Visit</TableHeader>
              <TableHeader>Patient</TableHeader>
              <TableHeader>Reason</TableHeader>
              <TableHeader>Time</TableHeader>
              <TableHeader>Status</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {visits.map((visit) => (
              <TableRow key={visit.id}>
                <TableCell className="font-medium">{visit.id}</TableCell>
                <TableCell>{visit.patient}</TableCell>
                <TableCell>{visit.reason}</TableCell>
                <TableCell>{visit.time}</TableCell>
                <TableCell>
                  <Tag type={statusTone[visit.status]}>{visit.status}</Tag>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <p className="empowher-quiet-copy mt-3 text-xs">Source: live dashboard payload from transcript workflow context.</p>
    </Tile>
  );
}
