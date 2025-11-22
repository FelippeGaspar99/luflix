'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { saveVideoConfig } from '@/lib/video-config';
import { requireAdmin } from '@/auth/guards';
import { defaultActionState } from '@/types/actions';

const videoConfigSchema = z.object({
  videoUrl: z.string().url({ message: 'Informe uma URL válida para o vídeo.' }),
  posterUrl: z
    .string()
    .url({ message: 'Informe uma URL válida para a capa.' })
    .optional()
    .or(z.literal('')),
});

export async function saveVideoConfigAction(_: unknown, formData: FormData) {
  await requireAdmin();

  const raw = {
    videoUrl: formData.get('video_url')?.toString() ?? '',
    posterUrl: formData.get('poster_url')?.toString() ?? undefined,
  };
  const redirectPath = formData.get('redirect_path')?.toString();

  const parsed = videoConfigSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ...defaultActionState,
      error: (parsed as any).error.errors[0]?.message ?? 'Dados inválidos.',
    };
  }

  const poster = parsed.data.posterUrl && parsed.data.posterUrl !== '' ? parsed.data.posterUrl : null;

  await saveVideoConfig(parsed.data.videoUrl, poster);

  revalidatePath('/admin/video');
  if (redirectPath) {
    revalidatePath(redirectPath);
  }
  revalidatePath('/video');

  return { success: true };
}
