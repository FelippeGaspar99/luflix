import { prisma } from '@/lib/prisma';

export interface VideoConfig {
  id: number;
  videoUrl: string;
  posterUrl: string | null;
}

export async function getVideoConfig(): Promise<VideoConfig | null> {
  const rows = await prisma.$queryRaw<VideoConfig[]>`
    SELECT id, video_url AS "videoUrl", poster_url AS "posterUrl"
    FROM video_config
    ORDER BY id ASC
    LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function saveVideoConfig(videoUrl: string, posterUrl: string | null) {
  const existing = await getVideoConfig();

  if (existing) {
    await prisma.$executeRaw`
      UPDATE video_config
      SET video_url = ${videoUrl}, poster_url = ${posterUrl}
      WHERE id = ${existing.id}
    `;
  } else {
    await prisma.$executeRaw`
      INSERT INTO video_config (video_url, poster_url)
      VALUES (${videoUrl}, ${posterUrl})
    `;
  }
}
