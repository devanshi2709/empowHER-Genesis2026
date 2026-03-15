"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/scribe", label: "Visit Scribe" },
  { href: "/care-plan", label: "Care Plan" },
  { href: "/symptom-tracker", label: "Symptom Tracker" },
  { href: "/referrals-benefits", label: "Referrals & Benefits" },
];

export function TopNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap items-center gap-2">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link key={item.href} href={item.href}>
            <Button
              variant={isActive ? "default" : "outline"}
              className={cn("min-w-[7.5rem]", isActive && "shadow-xs")}
              aria-current={isActive ? "page" : undefined}
            >
              {item.label}
            </Button>
          </Link>
        );
      })}
    </nav>
  );
}
