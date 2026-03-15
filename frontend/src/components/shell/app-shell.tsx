import type { ReactNode } from "react";
import Link from "next/link";
import { TopNav } from "@/components/shell/top-nav";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: "var(--eh-neutral-50)" }}>
      <a href="#main-content" className="eh-skip-link">Skip to main content</a>

      <header className="eh-header" role="banner">
        <div className="eh-header-inner">
          <Link href="/" className="eh-logo" aria-label="EmpowHER Clinic Copilot home">
            <span className="eh-logo-mark" aria-hidden="true">E</span>
            <span className="eh-logo-name">
              empowHER <span className="eh-logo-product">Clinic Copilot</span>
            </span>
          </Link>

          <TopNav />

          <div className="eh-header-badge" aria-label="Version: Genesis 2026">
            <span>Genesis 2026</span>
          </div>
        </div>
      </header>

      <main id="main-content" className="eh-main">
        <div className="eh-page-container">
          {children}
        </div>
      </main>
    </div>
  );
}
