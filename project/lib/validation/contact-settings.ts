import { z } from "zod";

const optionalPhone = z.string().trim().max(40);
const optionalEmail = z
  .string()
  .trim()
  .max(120)
  .refine((value) => value === "" || z.string().email().safeParse(value).success, {
    message: "Invalid email address",
  });

const optionalHttpsUrl = z
  .string()
  .trim()
  .max(500)
  .refine(
    (value) => {
      if (!value) return true;
      try {
        const parsed = new URL(value);
        return parsed.protocol === "https:";
      } catch {
        return false;
      }
    },
    { message: "Must be a valid https:// URL" },
  );

export const contactSettingsSchema = z.object({
  phones: z.array(optionalPhone).max(6).default([]),
  emails: z.array(optionalEmail).max(6).default([]),
  locationEn: z.string().trim().max(500).default(""),
  locationFa: z.string().trim().max(500).default(""),
  telegramUrl: optionalHttpsUrl.default(""),
  baleUrl: optionalHttpsUrl.default(""),
  youtubeUrl: optionalHttpsUrl.default(""),
  aparatUrl: optionalHttpsUrl.default(""),
  instagramUrl: optionalHttpsUrl.default(""),
});

export type ContactSettingsData = z.infer<typeof contactSettingsSchema>;
