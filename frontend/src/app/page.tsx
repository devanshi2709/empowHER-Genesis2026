import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ClinicDashboard() {
  return (
    <div className="min-h-screen bg-background p-6">
      <header className="mb-8 flex items-center justify-between border-b pb-4">
        <h1 className="text-2xl font-semibold">GynoFlow Copilot</h1>
        <nav className="flex gap-4">
          <Link href="/">
            <Button variant="default">Dashboard</Button>
          </Link>
          <Link href="/scribe">
            <Button variant="outline">Visit Scribe</Button>
          </Link>
          <Link href="/care-plan">
            <Button variant="outline">Care Plan</Button>
          </Link>
        </nav>
      </header>

      <main className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-medium">Clinic Dashboard</h2>
          <Link href="/scribe">
            <Button size="lg">New Patient Visit</Button>
          </Link>
        </div>

        {/* Placeholder: Patient load */}
        <section className="rounded-lg border bg-card p-6">
          <h3 className="mb-4 text-lg font-medium">Patient Load</h3>
          <p className="text-muted-foreground">Placeholder for patient load metrics and chart.</p>
        </section>

        {/* Placeholder: Charts */}
        <div className="grid gap-6 md:grid-cols-2">
          <section className="rounded-lg border bg-card p-6">
            <h3 className="mb-4 text-lg font-medium">Pending Care Plans</h3>
            <p className="text-muted-foreground">Placeholder for pending care plans chart (Recharts).</p>
          </section>
          <section className="rounded-lg border bg-card p-6">
            <h3 className="mb-4 text-lg font-medium">Recent Transcripts</h3>
            <p className="text-muted-foreground">Placeholder for recent transcripts chart (Recharts).</p>
          </section>
        </div>
      </main>
    </div>
  );
}
