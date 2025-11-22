'use server';

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/auth/guards";
import { createModule, updateModule, deleteModule } from "@/controllers/moduleController";
import { createVideo, deleteVideo } from "@/controllers/videoController";
import { grantAccess, revokeAccess } from "@/controllers/accessController";
import { prisma } from "@/lib/prisma";

const moduleFormSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  coverUrl: z.string().url(),
});

const moduleUpdateSchema = moduleFormSchema.extend({
  moduleId: z.string().cuid(),
});

const videoFormSchema = z.object({
  moduleId: z.string().cuid(),
  title: z.string().min(3),
  description: z.string().min(5),
  videoUrl: z.string().url(),
  thumbnailUrl: z.string().url().optional().or(z.literal("")),
  attachmentUrl: z.string().url().optional().or(z.literal("")),
  sortOrder: z.coerce.number().int().nonnegative().default(0),
});

const accessSchema = z.object({
  moduleId: z.string().cuid(),
  userId: z.string().cuid(),
});

const videoOrderSchema = z.object({
  moduleId: z.string(),
  videoId: z.string().cuid(),
  sortOrder: z.coerce.number().int().nonnegative(),
});

const membersVisibilitySchema = z.object({
  moduleId: z.string().cuid(),
  visible: z.string().transform((value) => value === "true"),
});

const handleError = (error: unknown) => ({
  success: false,
  error: error instanceof Error ? error.message : "Erro inesperado",
});

export async function createModuleAction(_: unknown, formData: FormData) {
  try {
    const session = await requireAdmin();
    const payload = moduleFormSchema.parse(Object.fromEntries(formData));
    await createModule(payload, session.user.id);
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error(error);
    return handleError(error);
  }
}

export async function updateModuleAction(_: unknown, formData: FormData) {
  try {
    const payload = moduleUpdateSchema.parse(Object.fromEntries(formData));
    await updateModule(payload);
    revalidatePath("/admin");
    revalidatePath(`/admin/modules/${payload.moduleId}`);
    return { success: true };
  } catch (error) {
    console.error(error);
    return handleError(error);
  }
}

export async function updateMembersVisibilityAction(formData: FormData) {
  try {
    await requireAdmin();
    const payload = membersVisibilitySchema.parse(Object.fromEntries(formData));

    await prisma.module.update({
      where: { id: payload.moduleId },
      data: { isMembersVisible: payload.visible },
    });

    revalidatePath(`/admin/modules/${payload.moduleId}`);
    revalidatePath('/members');
    return { success: true };
  } catch (error) {
    console.error(error);
    return handleError(error);
  }
}

export async function deleteModuleAction(moduleId: string) {
  try {
    await requireAdmin();
    await deleteModule(moduleId);
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error(error);
    return handleError(error);
  }
}

export async function createVideoAction(_: unknown, formData: FormData) {
  try {
    const payload = videoFormSchema.parse(Object.fromEntries(formData));
    const video = await createVideo(payload);
    revalidatePath(`/admin/modules/${video.moduleId}`);
    revalidatePath(`/modules/${video.moduleId}`);
    return { success: true };
  } catch (error) {
    console.error(error);
    return handleError(error);
  }
}

export async function deleteVideoAction(videoId: string, moduleId: string) {
  try {
    await requireAdmin();
    await deleteVideo(videoId);
    revalidatePath(`/admin/modules/${moduleId}`);
    revalidatePath(`/modules/${moduleId}`);
    return { success: true };
  } catch (error) {
    console.error(error);
    return handleError(error);
  }
}

export async function updateVideoAction(_: unknown, formData: FormData) {
  try {
    await requireAdmin();
    const payload = videoFormSchema.extend({ videoId: z.string().cuid() }).parse(Object.fromEntries(formData));

    await prisma.video.update({
      where: { id: payload.videoId },
      data: {
        title: payload.title,
        description: payload.description,
        videoUrl: payload.videoUrl,
        thumbnailUrl: payload.thumbnailUrl,
        sortOrder: payload.sortOrder,
      },
    });

    revalidatePath(`/admin/modules/${payload.moduleId}`);
    revalidatePath(`/modules/${payload.moduleId}`);
    return { success: true };
  } catch (error) {
    console.error(error);
    return handleError(error);
  }
}

export async function updateVideoOrderAction(_: unknown, formData: FormData) {
  try {
    await requireAdmin();
    const payload = videoOrderSchema.parse(Object.fromEntries(formData));

    await prisma.video.update({
      where: { id: payload.videoId },
      data: { sortOrder: payload.sortOrder },
    });

    revalidatePath(`/admin/modules/${payload.moduleId}`);
    revalidatePath(`/modules/${payload.moduleId}`);
    return { success: true };
  } catch (error) {
    console.error(error);
    return handleError(error);
  }
}

export async function assignModuleAction(_: unknown, formData: FormData) {
  try {
    const payload = accessSchema.parse(Object.fromEntries(formData));
    await grantAccess(payload);
    revalidatePath(`/admin/modules/${payload.moduleId}`);
    return { success: true };
  } catch (error) {
    console.error(error);
    return handleError(error);
  }
}

export async function revokeModuleAction(moduleId: string, userId: string) {
  try {
    await requireAdmin();
    await revokeAccess({ moduleId, userId });
    revalidatePath(`/admin/modules/${moduleId}`);
    return { success: true };
  } catch (error) {
    console.error(error);
    return handleError(error);
  }
}
