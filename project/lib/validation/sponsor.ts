import { z } from "zod";

export const sponsorSchema = z.object({
  name: z.string().trim().min(1).max(150),
  logoUrl: z.string().trim().max(500).optional(),
  url: z
    .string()
    .trim()
    .max(500)
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined))
    .pipe(z.string().url().optional()),
  isPublished: z.boolean().default(true),
});

export type SponsorInput = z.infer<typeof sponsorSchema>;
