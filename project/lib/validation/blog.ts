import { z } from "zod";

export const blogPostSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and hyphens only"),
  titleEn: z.string().min(1),
  titleFa: z.string().min(1),
  excerptEn: z.string().max(400).optional(),
  excerptFa: z.string().max(400).optional(),
  contentEn: z.string().optional(),
  contentFa: z.string().optional(),
  coverImageUrl: z.string().optional(),
  tags: z.array(z.string()).optional(),
  publishedAt: z.date().nullable().optional(),
  authorIds: z.array(z.string().uuid()).min(1).max(2),
});

export type BlogPostInput = z.infer<typeof blogPostSchema>;
