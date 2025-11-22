import { ReactNode } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { getSession } from "@/auth/session";
import { redirect } from "next/navigation";

export default async function MembersLayout({ children }: { children: ReactNode }) {
  const session = await getSession();

  if (!session?.user) {
    redirect("/login");
  }

  return <DashboardShell role="MEMBER">{children}</DashboardShell>;
}
