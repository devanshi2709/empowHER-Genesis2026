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
import type { VisitItem } from "@/lib/live-types";

const statusTone: Record<VisitItem["status"], "neutral" | "info" | "success"> = {
  Intake:           "neutral",
  "In progress":    "info",
  "Ready for plan": "success",
};

export function TodayWorklist({ visits }: { visits: VisitItem[] }) {
  return (
    <div className="empowher-section-card p-5 md:p-6">
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
                <TableCell className="font-medium text-[#0f172a]">{visit.id}</TableCell>
                <TableCell>{visit.patient}</TableCell>
                <TableCell>{visit.reason}</TableCell>
                <TableCell>{visit.time}</TableCell>
                <TableCell>
                  <StatusTag label={visit.status} tone={statusTone[visit.status]} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <p className="empowher-quiet-copy mt-3 text-xs">
        Source: live dashboard payload from transcript workflow context.
      </p>
    </div>
  );
}
