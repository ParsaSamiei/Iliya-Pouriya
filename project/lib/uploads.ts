import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Local-disk upload handling — see docs/05_DATABASE.md ("File uploads") and
 * docs/07_ADMIN_PANEL.md. Media is written to a persisted volume on the VPS,
 * referenced by URL path in the DB — never stored in Postgres, never on
 * object storage. In production this should be the mounted volume path
 * (e.g. `/var/app-data/uploads`); UPLOADS_DIR is configurable via env so
 * local dev can point somewhere else.
 */

export type UploadCategory = "projects" | "blog" | "resumes" | "profiles" | "models";

const UPLOADS_ROOT =
  process.env.UPLOADS_DIR?.trim() || path.join(process.cwd(), "public", "uploads");

const LIMITS_BYTES: Record<UploadCategory, number> = {
  projects: 15 * 1024 * 1024,
  blog: 15 * 1024 * 1024,
  resumes: 10 * 1024 * 1024,
  profiles: 5 * 1024 * 1024,
  // STL viewer note in docs/06: cap around 20–30 MB so it stays fast in-browser.
  models: 30 * 1024 * 1024,
};

const ALLOWED_EXTENSIONS: Record<UploadCategory, string[]> = {
  projects: [".jpg", ".jpeg", ".png", ".webp", ".mp4", ".webm"],
  blog: [".jpg", ".jpeg", ".png", ".webp"],
  resumes: [".pdf"],
  profiles: [".jpg", ".jpeg", ".png", ".webp"],
  models: [".stl"],
};

export class UploadValidationError extends Error {}

function assertValid(category: UploadCategory, filename: string, sizeBytes: number) {
  const ext = path.extname(filename).toLowerCase();
  if (!ALLOWED_EXTENSIONS[category].includes(ext)) {
    throw new UploadValidationError(
      `${ext || "(no extension)"} is not allowed for ${category} uploads. Allowed: ${ALLOWED_EXTENSIONS[category].join(", ")}`,
    );
  }
  if (sizeBytes > LIMITS_BYTES[category]) {
    const capMb = Math.round(LIMITS_BYTES[category] / (1024 * 1024));
    throw new UploadValidationError(`File exceeds the ${capMb} MB limit for ${category} uploads.`);
  }
}

/**
 * A very small STL sanity check: ASCII STLs start with "solid"; binary STLs
 * have an 80-byte header followed by a 4-byte triangle count whose implied
 * file size roughly matches the buffer length. This is not a full parser —
 * it's just enough to catch "wrong file renamed to .stl" before it reaches
 * the viewer, per docs/07_ADMIN_PANEL.md ("Validate the upload is actually
 * a parseable STL server-side").
 */
export function looksLikeStl(buffer: Buffer): boolean {
  if (buffer.length < 84) return false;
  const asciiHead = buffer.subarray(0, 5).toString("ascii").toLowerCase();
  if (asciiHead === "solid") return true;

  const triangleCount = buffer.readUInt32LE(80);
  const expectedSize = 84 + triangleCount * 50;
  // allow a little slack for trailing whitespace/padding some exporters add
  return Math.abs(buffer.length - expectedSize) <= 4;
}

export async function saveUpload(
  category: UploadCategory,
  file: { name: string; buffer: Buffer },
): Promise<{ url: string; sizeBytes: number }> {
  assertValid(category, file.name, file.buffer.byteLength);

  if (category === "models" && !looksLikeStl(file.buffer)) {
    throw new UploadValidationError(
      "This file doesn't look like a valid STL export — please re-export and try again.",
    );
  }

  const ext = path.extname(file.name).toLowerCase();
  const destDir = path.join(UPLOADS_ROOT, category);
  await mkdir(destDir, { recursive: true });

  const filename = `${randomUUID()}${ext}`;
  const destPath = path.join(destDir, filename);
  await writeFile(destPath, file.buffer);

  return {
    url: `/uploads/${category}/${filename}`,
    sizeBytes: file.buffer.byteLength,
  };
}

export async function deleteUpload(url: string): Promise<void> {
  if (!url.startsWith("/uploads/")) return;
  const relative = url.replace(/^\/uploads\//, "");
  const destPath = path.join(UPLOADS_ROOT, relative);
  await unlink(destPath).catch(() => {
    // Per docs/07: "leave orphaned files and add a cleanup script later
    // rather than building this into the critical path" — a missing file
    // on delete is not an error worth surfacing.
  });
}
