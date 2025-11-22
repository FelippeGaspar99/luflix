import { prisma } from "@/lib/prisma";
import { videoSchema, videoUpdateSchema } from "@/models/video";

export async function createVideo(payload: unknown) {
  const parsed = videoSchema.parse(payload);

  return prisma.video.create({
    data: parsed,
  });
}

export async function updateVideo(payload: unknown) {
  const parsed = videoUpdateSchema.parse(payload);

  return prisma.video.update({
    where: { id: parsed.videoId },
    data: {
      title: parsed.title,
      description: parsed.description,
      videoUrl: parsed.videoUrl,
      thumbnailUrl: parsed.thumbnailUrl,
      attachmentUrl: parsed.attachmentUrl,
      sortOrder: parsed.sortOrder,
    },
  });
}

export async function deleteVideo(videoId: string) {
  return prisma.video.delete({ where: { id: videoId } });
}
