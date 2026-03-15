import type { ReactNode } from "react";
import { Content, Header, HeaderName, SkipToContent, Theme } from "@carbon/react";
import { TopNav } from "@/components/shell/top-nav";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <Theme theme="g10">
      <div className="min-h-screen bg-[#f4f4f4]">
        <SkipToContent href="#main-content" />
        <Header aria-label="EmpowHER Clinic Copilot">
          <HeaderName href="/" prefix="EmpowHER">
            Clinic Copilot
          </HeaderName>
          <TopNav />
        </Header>

        <Content id="main-content" className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-7xl">
            <p className="mb-4 text-xs font-semibold tracking-[0.08em] text-[#6f6f6f] uppercase">
              Genesis 2026
            </p>
            {children}
          </div>
        </Content>
      </div>
    </Theme>
  );
}
