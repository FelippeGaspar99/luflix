import { ReactNode } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { requireAdmin } from "@/auth/guards";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireAdmin();

  return <DashboardShell role="ADMIN">{children}</DashboardShell>;
}
