"use server";

import { saveUpload, type UploadCategory, UploadValidationError } from "@/lib/uploads";

export type UploadFileResult = { ok: true; url: string } | { ok: false; error: string };

const CLIENT_ALLOWED: UploadCategory[] = ["projects", "blog", "profiles", "resumes"];

/**
 * Shared upload action for cover images, profile photos, and resumes —
 * the STL model flow (lib/actions/projects.ts::uploadProjectModel) stays
 * separate since it also writes a ProjectModel row, not just a URL.
 */
export async function uploadFile(
  category: UploadCategory,
  formData: FormData,
): Promise<UploadFileResult> {
  if (!CLIENT_ALLOWED.includes(category)) {
    return { ok: false, error: "Invalid upload category." };
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Choose a file first." };
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const { url } = await saveUpload(category, { name: file.name, buffer });
    return { ok: true, url };
  } catch (error) {
    if (error instanceof UploadValidationError) {
      return { ok: false, error: error.message };
    }
    return { ok: false, error: "Upload failed. Please try again." };
  }
}
