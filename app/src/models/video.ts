import { z } from "zod";

export const videoSchema = z.object({
  moduleId: z.string().cuid(),
  title: z.string().min(3).max(120),
  description: z.string().min(5).max(600),
  videoUrl: z.string().url(),
  thumbnailUrl: z.string().url().optional().or(z.literal("")),
  attachmentUrl: z.string().url().optional().or(z.literal("")),
  sortOrder: z.number().int().nonnegative().default(0),
});

export const videoUpdateSchema = videoSchema.extend({
  videoId: z.string().cuid(),
});

export type VideoInput = z.infer<typeof videoSchema>;
