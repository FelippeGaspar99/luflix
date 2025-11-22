import { prisma } from "@/lib/prisma";

export async function canAccessModule({
  moduleId,
  userId,
  role,
}: {
  moduleId: string;
  userId: string;
  role: "ADMIN" | "EMPLOYEE";
}) {
  if (role === "ADMIN") {
    return true;
  }

  const relationship = await prisma.moduleAccess.findFirst({
    where: { moduleId, userId },
  });

  return Boolean(relationship);
}
