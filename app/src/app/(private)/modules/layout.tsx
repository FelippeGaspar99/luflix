import { ReactNode } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { requireEmployee } from "@/auth/guards";

export default async function ModulesLayout({ children }: { children: ReactNode }) {
  await requireEmployee();

  return <DashboardShell role="EMPLOYEE">{children}</DashboardShell>;
}
