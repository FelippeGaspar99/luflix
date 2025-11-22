import { prisma } from "@/lib/prisma";
import { moduleBaseSchema, moduleUpdateSchema } from "@/models/module";
import { searchSchema } from "@/models/search";

export async function getModulesForAdmin(search?: string) {
  const { query } = searchSchema.parse({ query: search ?? "" });

  return prisma.module.findMany({
    where: query
      ? {
        OR: [
          { title: { contains: query } },
          { description: { contains: query } },
          {
            videos: {
              some: {
                title: { contains: query }
              }
            }
          },
        ],
      }
      : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      videos: {
        orderBy: { sortOrder: "asc" },
      },
      accesses: { include: { user: true } },
      _count: { select: { videos: true, accesses: true } },
    },
  });
}

export async function getAllModules() {
  return prisma.module.findMany({
    orderBy: { title: "asc" },
    select: { id: true, title: true },
  });
}

export async function getModulesForEmployee(
  userId: string,
  search?: string,
) {
  const { query } = searchSchema.parse({ query: search ?? "" });

  return prisma.module.findMany({
    where: {
      accesses: {
        some: {
          userId,
        },
      },
      ...(query
        ? {
          OR: [
            { title: { contains: query } },
            { description: { contains: query } },
          ],
        }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    include: {
      videos: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });
}

export async function getModulesForMembers(search?: string) {
  const { query } = searchSchema.parse({ query: search ?? "" });

  return prisma.module.findMany({
    where: {
      isMembersVisible: true,
      ...(query
        ? {
          OR: [
            { title: { contains: query } },
            { description: { contains: query } },
          ],
        }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    include: {
      videos: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });
}

export async function getModuleWithVideos(moduleId: string) {
  return prisma.module.findUnique({
    where: { id: moduleId },
    include: {
      videos: {
        orderBy: { sortOrder: "asc" },
      },
      accesses: { include: { user: true } },
    },
  });
}

export async function createModule(payload: unknown, createdById: string) {
  const parsed = moduleBaseSchema.parse(payload);

  return prisma.module.create({
    data: {
      ...parsed,
      createdById,
    },
  });
}

export async function updateModule(payload: unknown) {
  const parsed = moduleUpdateSchema.parse(payload);

  return prisma.module.update({
    where: { id: parsed.moduleId },
    data: {
      title: parsed.title,
      description: parsed.description,
      coverUrl: parsed.coverUrl,
    },
  });
}

export async function deleteModule(moduleId: string) {
  return prisma.module.delete({ where: { id: moduleId } });
}
