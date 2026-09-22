import { z } from "zod";

const name = z.string().trim().min(1).max(80);
const tagline = z.string().trim().min(1).max(280);

export const siteMetadataSchema = z.object({
  nameEn: name,
  nameFa: name,
  taglineEn: tagline,
  taglineFa: tagline,
});

export type SiteMetadataData = z.infer<typeof siteMetadataSchema>;
