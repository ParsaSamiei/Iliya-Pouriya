import { z } from "zod";

const optionalPhoneNumber = z.string().trim().max(40);
const optionalPhoneName = z.string().trim().max(80);

export const contactPhoneSchema = z.object({
  nameEn: optionalPhoneName.default(""),
  nameFa: optionalPhoneName.default(""),
  number: optionalPhoneNumber,
});

export type ContactPhone = z.infer<typeof contactPhoneSchema>;

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

/**
 * Coerce legacy phone entries:
 * - `"0912…"` → `{ nameEn, nameFa, number }`
 * - `{ name, number }` → `{ nameEn, nameFa, number }`
 */
function coercePhones(value: unknown): unknown {
  if (!Array.isArray(value)) return value;
  return value.map((item) => {
    if (typeof item === "string") {
      return { nameEn: "", nameFa: "", number: item };
    }
    if (item && typeof item === "object" && !Array.isArray(item)) {
      const record = item as Record<string, unknown>;
      if ("nameEn" in record || "nameFa" in record) return item;
      if (typeof record.name === "string") {
        return {
          nameEn: record.name,
          nameFa: record.name,
          number: typeof record.number === "string" ? record.number : "",
        };
      }
    }
    return item;
  });
}

export const contactSettingsSchema = z.object({
  phones: z.preprocess(coercePhones, z.array(contactPhoneSchema).max(6).default([])),
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
