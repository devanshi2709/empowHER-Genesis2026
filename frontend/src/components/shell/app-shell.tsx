import type { ReactNode } from "react";
import { TopNav } from "@/components/shell/top-nav";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <header className="sticky top-0 z-20 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
              EmpowHER Genesis 2026
            </p>
            <h1 className="text-xl font-semibold tracking-tight">EmpowHER Clinic Copilot</h1>
          </div>
          <TopNav />
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
    </div>
  );
}
