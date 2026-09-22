export type UploadFileResult = { ok: true; url: string } | { ok: false; error: string };

export type ClientUploadCategory =
  | "projects"
  | "blog"
  | "profiles"
  | "resumes"
  | "gallery"
  | "sponsors"
  | "clients";

/**
 * Upload a file through the admin API route (not a Server Action).
 * Large gallery/project videos were failing Server Action multipart parsing.
 */
export async function uploadAdminFile(
  category: ClientUploadCategory,
  file: File,
): Promise<UploadFileResult> {
  const formData = new FormData();
  formData.set("category", category);
  formData.set("file", file);

  try {
    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    const data = (await response.json().catch(() => null)) as UploadFileResult | null;
    if (!data || typeof data !== "object") {
      return { ok: false, error: "Upload failed. Please try again." };
    }
    if (!response.ok && data.ok === false) return data;
    if (data.ok) return data;
    return { ok: false, error: data.error || "Upload failed. Please try again." };
  } catch {
    return { ok: false, error: "Upload failed. Please try again." };
  }
}
