"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HeaderMenuItem, HeaderNavigation } from "@carbon/react";

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
    <HeaderNavigation aria-label="Main navigation" className="max-w-full overflow-x-auto">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <HeaderMenuItem
            key={item.href}
            as={Link}
            href={item.href}
            isCurrentPage={isActive}
            aria-current={isActive ? "page" : undefined}
          >
            {item.label}
          </HeaderMenuItem>
        );
      })}
    </HeaderNavigation>
  );
}
