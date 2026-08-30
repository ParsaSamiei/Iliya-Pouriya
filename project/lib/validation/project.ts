import { z } from "zod";

const externalLinksSchema = z
  .object({
    github: z.string().url().optional(),
    demo: z.string().url().optional(),
    publication: z.string().url().optional(),
  })
  .partial();

export const projectSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and hyphens only"),
  titleEn: z.string().min(1),
  titleFa: z.string().min(1),
  summaryEn: z.string().max(500).optional(),
  summaryFa: z.string().max(500).optional(),
  contentEn: z.string().optional(),
  contentFa: z.string().optional(),
  coverImageUrl: z.string().optional(),
  gallery: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  externalLinks: externalLinksSchema.optional(),
  isFeatured: z.boolean().default(false),
  publishedAt: z.date().nullable().optional(),
  contributorIds: z.array(z.string().uuid()).min(1).max(2),
});

export type ProjectInput = z.infer<typeof projectSchema>;

export const projectModelSchema = z.object({
  projectId: z.string().uuid(),
  nameEn: z.string().min(1),
  nameFa: z.string().min(1),
  fileUrl: z.string().min(1),
  fileSizeBytes: z
    .number()
    .int()
    .positive()
    .max(30 * 1024 * 1024, "STL models are capped at 30 MB"),
});

export type ProjectModelInput = z.infer<typeof projectModelSchema>;
