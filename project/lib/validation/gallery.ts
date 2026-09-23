import { z } from "zod";

const UPLOAD_PATH = /^\/uploads\/gallery\/[A-Za-z0-9._-]+$/;
const MEDIA_TYPES = ["IMAGE", "VIDEO"] as const;

function optionalText(max: number) {
  return z
    .string()
    .trim()
    .max(max)
    .transform((value) => value || null)
    .nullable()
    .default(null);
}

export const galleryItemSchema = z
  .object({
    mediaType: z.enum(MEDIA_TYPES).default("IMAGE"),
    imageUrl: z.string().trim().optional().or(z.literal("")),
    videoUrl: z.string().trim().optional().or(z.literal("")),
    altEn: optionalText(200),
    altFa: optionalText(200),
    captionEn: optionalText(300),
    captionFa: optionalText(300),
    sortOrder: z.coerce.number().int().min(0).default(0),
    tagIds: z
      .union([z.string(), z.array(z.string())])
      .optional()
      .transform((val) => (Array.isArray(val) ? val : val ? [val] : []))
      .pipe(z.array(z.string().min(1))),
  })
  .superRefine((data, ctx) => {
    if (data.mediaType === "IMAGE") {
      if (!data.imageUrl) {
        ctx.addIssue({
          code: "custom",
          path: ["imageUrl"],
          message: "An image is required.",
        });
      } else if (!UPLOAD_PATH.test(data.imageUrl)) {
        ctx.addIssue({
          code: "custom",
          path: ["imageUrl"],
          message: "Upload the image through this form.",
        });
      }
    }

    if (data.mediaType === "VIDEO") {
      if (!data.videoUrl) {
        ctx.addIssue({
          code: "custom",
          path: ["videoUrl"],
          message: "A video file is required.",
        });
      } else if (!UPLOAD_PATH.test(data.videoUrl)) {
        ctx.addIssue({
          code: "custom",
          path: ["videoUrl"],
          message: "Upload the video through this form.",
        });
      }

      if (data.imageUrl && !UPLOAD_PATH.test(data.imageUrl)) {
        ctx.addIssue({
          code: "custom",
          path: ["imageUrl"],
          message: "Upload the poster through this form.",
        });
      }
    }
  })
  .transform((data) => ({
    mediaType: data.mediaType,
    imageUrl:
      data.mediaType === "IMAGE"
        ? data.imageUrl || null
        : data.imageUrl?.trim()
          ? data.imageUrl.trim()
          : null,
    videoUrl: data.mediaType === "VIDEO" ? data.videoUrl || null : null,
    altEn: data.altEn,
    altFa: data.altFa,
    captionEn: data.captionEn,
    captionFa: data.captionFa,
    sortOrder: data.sortOrder,
    tagIds: data.tagIds,
  }));

export type GalleryItemInput = z.infer<typeof galleryItemSchema>;
