import { prisma } from "@/lib/prisma";
import { progressSchema } from "@/models/progress";

export async function getModuleProgress(userId: string, moduleId: string) {
  const videos = await prisma.video.findMany({
    where: { moduleId },
    select: { id: true },
  });

  if (videos.length === 0) {
    return { completedVideos: 0, totalVideos: 0, percentage: 0 };
  }

  const completed = await prisma.videoProgress.count({
    where: {
      userId,
      videoId: { in: videos.map((video) => video.id) },
      status: "COMPLETED",
    },
  });

  return {
    completedVideos: completed,
    totalVideos: videos.length,
    percentage: Math.round((completed / videos.length) * 100),
  };
}

export async function recordProgress(payload: unknown, userId: string) {
  const parsed = progressSchema.parse(payload);

  const video = await prisma.video.findUnique({
    where: { id: parsed.videoId },
    select: { moduleId: true },
  });

  if (!video) {
    throw new Error("Vídeo não encontrado");
  }

  const isCompleted = parsed.progress >= 0.95;

  await prisma.videoProgress.upsert({
    where: {
      userId_videoId: {
        userId,
        videoId: parsed.videoId,
      },
    },
    update: {
      progress: parsed.progress,
      status: isCompleted ? "COMPLETED" : "IN_PROGRESS",
      completedAt: isCompleted ? new Date() : null,
    },
    create: {
      userId,
      videoId: parsed.videoId,
      progress: parsed.progress,
      status: isCompleted ? "COMPLETED" : "IN_PROGRESS",
      completedAt: isCompleted ? new Date() : null,
    },
  });

  const videos = await prisma.video.count({ where: { moduleId: video.moduleId } });
  const completed = await prisma.videoProgress.count({
    where: {
      userId,
      status: "COMPLETED",
      video: { moduleId: video.moduleId },
    },
  });

  const moduleCompleted = videos > 0 && completed === videos;

  return { moduleCompleted, moduleId: video.moduleId };
}

export async function getVideoProgressMap(moduleId: string) {
  const rows = await prisma.videoProgress.findMany({
    where: { video: { moduleId } },
    select: {
      userId: true,
      videoId: true,
      progress: true,
      status: true,
    },
  });

  const map: Record<string, Record<string, number>> = {};
  rows.forEach((row) => {
    if (!map[row.userId]) {
      map[row.userId] = {};
    }
    map[row.userId][row.videoId] = row.status === "COMPLETED" ? 100 : Math.round(row.progress * 100);
  });

  return map;
}

export async function getModuleProgressSummary(moduleId: string) {
  const videos = await prisma.video.count({ where: { moduleId } });

  const grouped = await prisma.videoProgress.groupBy({
    by: ["userId"],
    where: {
      video: { moduleId },
      status: "COMPLETED",
    },
    _count: { _all: true },
  });

  const progressByUser = Object.fromEntries(
    grouped.map((item) => [item.userId, item._count._all]),
  );

  return { totalVideos: videos, progressByUser };
}

export async function getRecentVideos(userId: string, limit = 10) {
  const progress = await prisma.videoProgress.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    take: limit,
    include: {
      video: {
        include: {
          module: true,
        },
      },
    },
  });

  return progress.map((p) => ({
    id: p.video.id,
    title: p.video.title,
    description: p.video.description,
    videoUrl: p.video.videoUrl,
    thumbnailUrl: p.video.thumbnailUrl,
    moduleId: p.video.moduleId,
    moduleTitle: p.video.module.title,
    progress: p.status === "COMPLETED" ? 100 : Math.round(p.progress * 100),
    isCompleted: p.status === "COMPLETED",
    updatedAt: p.updatedAt,
  }));
}
