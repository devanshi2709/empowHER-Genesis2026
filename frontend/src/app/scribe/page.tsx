"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function VisitScribe() {
  const [transcript, setTranscript] = useState("");

  return (
    <div className="min-h-screen bg-background p-6">
      <header className="mb-8 flex items-center justify-between border-b pb-4">
        <h1 className="text-2xl font-semibold">GynoFlow Copilot</h1>
        <nav className="flex gap-4">
          <Link href="/">
            <Button variant="outline">Dashboard</Button>
          </Link>
          <Link href="/scribe">
            <Button variant="default">Visit Scribe</Button>
          </Link>
          <Link href="/care-plan">
            <Button variant="outline">Care Plan</Button>
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-3xl space-y-6">
        <div>
          <h2 className="text-xl font-medium">Visit Scribe</h2>
          <p className="text-muted-foreground">
            Paste a doctor–patient visit transcript to extract clinical actions and generate a care plan.
          </p>
        </div>

        <section className="rounded-lg border bg-card p-6">
          <label htmlFor="transcript" className="mb-2 block text-sm font-medium">
            Doctor–patient visit transcript
          </label>
          <textarea
            id="transcript"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Paste the doctor–patient visit transcript here..."
            rows={14}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <div className="mt-4">
            <Button size="lg" disabled={!transcript.trim()}>
              Extract and generate care plan
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
