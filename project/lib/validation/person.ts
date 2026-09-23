import { z } from "zod";

const socialLinksSchema = z
  .object({
    github: z.string().url().optional(),
    linkedin: z.string().url().optional(),
    email: z.string().email().optional(),
  })
  .partial();

export const personSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/),
  nameEn: z.string().min(1),
  nameFa: z.string().min(1),
  title: z.string().min(1),
  photoUrl: z.string().optional(),
  bioEn: z.string().optional(),
  bioFa: z.string().optional(),
  resumeUrlEn: z.string().optional(),
  resumeUrlFa: z.string().optional(),
  socialLinks: socialLinksSchema.optional(),
});

export type PersonInput = z.infer<typeof personSchema>;

export const experienceSchema = z.object({
  personId: z.string().uuid(),
  roleEn: z.string().min(1),
  roleFa: z.string().min(1),
  organization: z.string().min(1),
  startDate: z.date(),
  endDate: z.date().nullable().optional(),
  descriptionEn: z.string().optional(),
  descriptionFa: z.string().optional(),
});

export type ExperienceInput = z.infer<typeof experienceSchema>;

export const skillSchema = z.object({
  personId: z.string().uuid(),
  name: z.string().min(1),
  category: z.enum(["hardware", "software", "other"]),
});

export type SkillInput = z.infer<typeof skillSchema>;
