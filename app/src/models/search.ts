import { z } from "zod";

export const searchSchema = z.object({
  query: z.string().trim().max(120).default(""),
});

export type SearchInput = z.infer<typeof searchSchema>;
