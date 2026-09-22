import { z } from "zod";

export const recommendationSchema = z.object({
  quoteEn: z.string().trim().min(1).max(1200),
  quoteFa: z.string().trim().min(1).max(1200),
  authorNameEn: z.string().trim().min(1).max(120),
  authorNameFa: z.string().trim().min(1).max(120),
  authorRoleEn: z.string().trim().max(200).optional(),
  authorRoleFa: z.string().trim().max(200).optional(),
  authorPhotoUrl: z.string().trim().max(500).optional(),
  authorUrl: z
    .string()
    .trim()
    .max(500)
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined))
    .pipe(z.string().url().optional()),
  isPublished: z.boolean().default(true),
});

export type RecommendationInput = z.infer<typeof recommendationSchema>;
