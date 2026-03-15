"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
    <nav className="eh-nav" aria-label="Main navigation">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`eh-nav-item${isActive ? " eh-nav-item--active" : ""}`}
            aria-current={isActive ? "page" : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
