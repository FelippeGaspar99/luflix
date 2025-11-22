import { redirect } from "next/navigation";
import { getSession } from "@/auth/session";

export async function requireAuth() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/login");
  }

  return session;
}

export async function requireAdmin() {
  const session = await requireAuth();

  if (session.user.role !== "ADMIN") {
    redirect("/employee");
  }

  return session;
}

export async function requireEmployee() {
  const session = await requireAuth();

  if (session.user.role !== "EMPLOYEE") {
    redirect("/admin");
  }

  return session;
}
