import { z } from "zod";

export const progressSchema = z.object({
  videoId: z.string().cuid(),
  progress: z.number().min(0).max(1),
});

export type ProgressInput = z.infer<typeof progressSchema>;
