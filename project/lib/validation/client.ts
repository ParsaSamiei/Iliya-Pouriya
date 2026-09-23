import { z } from "zod";

export const clientSchema = z.object({
  nameEn: z.string().trim().min(1).max(150),
  nameFa: z.string().trim().min(1).max(150),
  noteEn: z
    .string()
    .trim()
    .max(280)
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined)),
  noteFa: z
    .string()
    .trim()
    .max(280)
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined)),
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

export type ClientInput = z.infer<typeof clientSchema>;
