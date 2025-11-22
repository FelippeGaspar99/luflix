"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/layout/logo";
import { SignOutButton } from "@/components/layout/sign-out-button";
import { navLinks, footerNote } from "@/config/navigation";
import { cn } from "@/lib/cn";

interface DashboardShellProps {
  role: "ADMIN" | "EMPLOYEE" | "MEMBER";
  children: ReactNode;
}

export function DashboardShell({ role, children }: DashboardShellProps) {
  const items = navLinks[role === "ADMIN" ? "admin" : role === "MEMBER" ? "member" : "employee"];
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#05070e] to-[#050409] text-slate-100">
      <header className="sticky top-0 z-30 bg-gradient-to-b from-[#05070e]/90 to-transparent backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-6">
          <Logo />
          <nav className="flex flex-1 items-center justify-center gap-6 text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
            {items.map((item) => (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                className={cn(
                  "transition hover:text-white",
                  pathname === item.href && "text-white",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <SignOutButton />
        </div>
      </header>
      <main className="mx-auto max-w-7xl space-y-8 px-6 py-10">{children}</main>
      <footer className="mt-10 border-t border-slate-800/60 bg-slate-950/60 py-6 text-center text-xs text-slate-500">
        {footerNote}
      </footer>
    </div>
  );
}
