import { prisma } from "@/lib/prisma";
import { accessSchema } from "@/models/access";

export async function grantAccess(payload: unknown) {
  const parsed = accessSchema.parse(payload);

  return prisma.moduleAccess.upsert({
    where: { moduleId_userId: { moduleId: parsed.moduleId, userId: parsed.userId } },
    update: {},
    create: parsed,
  });
}

export async function revokeAccess(payload: unknown) {
  const parsed = accessSchema.parse(payload);

  return prisma.moduleAccess.delete({
    where: { moduleId_userId: { moduleId: parsed.moduleId, userId: parsed.userId } },
  });
}
