import { z } from "zod";

const optionalPhone = z.string().trim().max(40);
const optionalEmail = z
  .string()
  .trim()
  .max(120)
  .refine((value) => value === "" || z.string().email().safeParse(value).success, {
    message: "Invalid email address",
  });

export const contactSettingsSchema = z.object({
  phones: z.array(optionalPhone).max(6).default([]),
  emails: z.array(optionalEmail).max(6).default([]),
  locationEn: z.string().trim().max(200).default(""),
  locationFa: z.string().trim().max(200).default(""),
});

export type ContactSettingsData = z.infer<typeof contactSettingsSchema>;
