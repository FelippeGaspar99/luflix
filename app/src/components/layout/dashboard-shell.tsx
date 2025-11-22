"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { SignOutButton } from "@/components/layout/sign-out-button";
import { navLinks, footerNote } from "@/config/navigation";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";

interface DashboardShellProps {
  role: "ADMIN" | "EMPLOYEE" | "MEMBER";
  children: ReactNode;
}

export function DashboardShell({ role, children }: DashboardShellProps) {
  const items = navLinks[role === "ADMIN" ? "admin" : role === "MEMBER" ? "member" : "employee"];
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#05070e] to-[#050409] text-slate-100">
      <header className="sticky top-0 z-30 bg-gradient-to-b from-[#05070e]/90 to-transparent backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-6">
          <Logo />

          {/* Desktop Nav */}
          <nav className="hidden flex-1 items-center justify-center gap-6 text-sm font-semibold uppercase tracking-[0.2em] text-slate-400 md:flex">
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

          <div className="hidden md:block">
            <SignOutButton />
          </div>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            className="h-10 w-10 p-0 md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Nav Overlay */}
        {isMobileMenuOpen && (
          <div className="absolute left-0 top-full w-full border-b border-slate-800 bg-[#05070e] px-6 py-4 shadow-2xl md:hidden">
            <nav className="flex flex-col gap-4 text-center text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              {items.map((item) => (
                <Link
                  key={`${item.href}-${item.label}`}
                  href={item.href}
                  className={cn(
                    "block py-2 transition hover:text-white",
                    pathname === item.href && "text-white",
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-4">
                <SignOutButton />
              </div>
            </nav>
          </div>
        )}
      </header>
      <main className="mx-auto max-w-7xl space-y-8 px-6 py-10">{children}</main>
      <footer className="mt-10 border-t border-slate-800/60 bg-slate-950/60 py-6 text-center text-xs text-slate-500">
        {footerNote}
      </footer>
    </div>
  );
}
