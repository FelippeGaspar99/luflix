import { z } from "zod";

export const moduleBaseSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().min(10).max(800),
  coverUrl: z.string().url(),
});

export const moduleUpdateSchema = moduleBaseSchema.extend({
  moduleId: z.string().cuid(),
});

export type ModuleInput = z.infer<typeof moduleBaseSchema>;
