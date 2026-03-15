import type { ReactNode } from "react";
import { SectionHeader } from "@/components/layout/section-header";
import { cn } from "@/lib/utils";

type PageLayoutProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  meta?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function PageLayout({
  eyebrow,
  title,
  description,
  actions,
  meta,
  children,
  className,
}: PageLayoutProps) {
  return (
    <div className={cn("space-y-7 md:space-y-8", className)}>
      <header className="empowher-page-header p-6 md:p-7">
        <SectionHeader
          eyebrow={eyebrow}
          title={title}
          description={description}
          actions={actions}
          className="relative z-[1]"
        />
      </header>
      {meta ? <section className="empowher-meta-grid md:grid-cols-3">{meta}</section> : null}
      <div className="space-y-5 md:space-y-6">{children}</div>
    </div>
  );
}
