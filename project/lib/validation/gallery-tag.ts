import { z } from "zod";

export const galleryTagSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug may only contain lowercase letters, numbers, and hyphens."),
  nameEn: z.string().trim().min(1).max(120),
  nameFa: z.string().trim().min(1).max(120),
  sortOrder: z.coerce.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export type GalleryTagInput = z.infer<typeof galleryTagSchema>;
