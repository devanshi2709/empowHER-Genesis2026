"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CarePlan() {
  return (
    <div className="min-h-screen bg-background p-6">
      <header className="mb-8 flex items-center justify-between border-b pb-4">
        <h1 className="text-2xl font-semibold">GynoFlow Copilot</h1>
        <nav className="flex gap-4">
          <Link href="/">
            <Button variant="outline">Dashboard</Button>
          </Link>
          <Link href="/scribe">
            <Button variant="outline">Visit Scribe</Button>
          </Link>
          <Link href="/care-plan">
            <Button variant="default">Care Plan</Button>
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-3xl space-y-6">
        <div>
          <h2 className="text-xl font-medium">Care Plan</h2>
          <p className="text-muted-foreground">
            Summary and next steps from your visit. Use this to coordinate follow-up and referrals.
          </p>
        </div>

        {/* Placeholder: Symptoms */}
        <section className="rounded-lg border bg-card p-6">
          <h3 className="mb-4 text-lg font-medium">Symptoms</h3>
          <p className="text-muted-foreground">Placeholder for symptoms list (populated from visit extraction).</p>
        </section>

        {/* Placeholder: Care plan summary */}
        <section className="rounded-lg border bg-card p-6">
          <h3 className="mb-4 text-lg font-medium">Care plan summary</h3>
          <p className="text-muted-foreground">Placeholder for care plan summary text.</p>
        </section>

        {/* Referral PDF button */}
        <section className="rounded-lg border bg-card p-6">
          <h3 className="mb-4 text-lg font-medium">Provider Referral & Benefits</h3>
          <Button variant="secondary">Generate Secure Referral Packet (PDF)</Button>
        </section>
      </main>
    </div>
  );
}
