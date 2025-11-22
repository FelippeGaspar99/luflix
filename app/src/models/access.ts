import { z } from "zod";

export const accessSchema = z.object({
  moduleId: z.string().cuid(),
  userId: z.string().cuid(),
});

export type AccessInput = z.infer<typeof accessSchema>;
