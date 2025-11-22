import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

export async function getEmployees() {
  return prisma.user.findMany({
    where: { role: "EMPLOYEE" },
    orderBy: { name: "asc" },
    select: { id: true, name: true, email: true },
  });
}

export async function createUser(data: any) {
  const hashedPassword = await hash(data.password, 10);
  return prisma.user.create({
    data: {
      name: data.name,
      username: data.username,
      email: data.email || null,
      passwordHash: hashedPassword,
      role: data.role || "EMPLOYEE",
    },
  });
}

export async function deleteUser(userId: string) {
  // First delete related records if necessary (though cascade delete might handle it if configured, 
  // but explicit deletion is safer for logic)
  // For now, we rely on Prisma relations or just delete the user.
  // Note: Deleting a user might fail if there are foreign key constraints (like created modules).
  // Ideally we should handle this, but for now basic deletion.

  // We need to delete accesses and progress first if cascade isn't set up in DB
  await prisma.moduleAccess.deleteMany({ where: { userId } });
  await prisma.videoProgress.deleteMany({ where: { userId } });
  await prisma.certificate.deleteMany({ where: { userId } });

  return prisma.user.delete({
    where: { id: userId },
  });
}

export async function getUsersWithAccess() {
  return prisma.user.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      accesses: {
        select: { moduleId: true },
      },
    },
  });
}
