"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { deleteUpload, saveUpload, UploadValidationError } from "@/lib/uploads";
import { projectSchema } from "@/lib/validation/project";

export type ActionResult = { ok: true } | { ok: false; error: string };

function parseProjectForm(formData: FormData) {
  const contributorIds = formData.getAll("contributorIds").map(String);
  const tags = String(formData.get("tags") ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const gallery = parseGalleryField(formData.get("gallery"));

  return projectSchema.safeParse({
    slug: String(formData.get("slug") ?? ""),
    titleEn: String(formData.get("titleEn") ?? ""),
    titleFa: String(formData.get("titleFa") ?? ""),
    summaryEn: String(formData.get("summaryEn") ?? "") || undefined,
    summaryFa: String(formData.get("summaryFa") ?? "") || undefined,
    contentEn: String(formData.get("contentEn") ?? "") || undefined,
    contentFa: String(formData.get("contentFa") ?? "") || undefined,
    coverImageUrl: String(formData.get("coverImageUrl") ?? "") || undefined,
    gallery,
    tags,
    externalLinks: {
      github: String(formData.get("linkGithub") ?? "") || undefined,
      demo: String(formData.get("linkDemo") ?? "") || undefined,
      publication: String(formData.get("linkPublication") ?? "") || undefined,
    },
    isFeatured: formData.get("isFeatured") === "on",
    publishedAt: formData.get("published") === "on" ? new Date() : null,
    contributorIds,
  });
}

/** GalleryUploadField submits the URL list as a JSON-encoded hidden field —
 * falls back to an empty gallery on missing/malformed input rather than
 * failing the whole form submission over it. */
function parseGalleryField(raw: FormDataEntryValue | null): string[] {
  if (typeof raw !== "string" || !raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

export async function createProject(formData: FormData): Promise<ActionResult> {
  const parsed = parseProjectForm(formData);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { contributorIds, ...data } = parsed.data;
  const project = await db.project.create({
    data: {
      ...data,
      contributors: { create: contributorIds.map((personId) => ({ personId })) },
    },
  });

  revalidatePath("/admin/projects");
  revalidatePath("/[locale]/projects", "page");
  redirect(`/admin/projects/${project.id}`);
}

export async function updateProject(id: string, formData: FormData): Promise<ActionResult> {
  const parsed = parseProjectForm(formData);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const existing = await db.project.findUnique({ where: { id }, select: { gallery: true } });
  const previousGallery = Array.isArray(existing?.gallery) ? (existing.gallery as string[]) : [];

  const { contributorIds, ...data } = parsed.data;
  await db.project.update({
    where: { id },
    data: {
      ...data,
      contributors: {
        deleteMany: {},
        create: contributorIds.map((personId) => ({ personId })),
      },
    },
  });

  // Delete any gallery files that were removed from the form (not just
  // uploaded, but actually saved) — leaving them would strand disk space.
  const nextGallery = new Set(data.gallery ?? []);
  const removedFromGallery = previousGallery.filter((url) => !nextGallery.has(url));
  await Promise.all(removedFromGallery.map((url) => deleteUpload(url)));

  revalidatePath("/admin/projects");
  revalidatePath("/[locale]/projects", "page");
  revalidatePath("/[locale]/projects/[slug]", "page");

  return { ok: true };
}

export async function deleteProject(id: string): Promise<ActionResult> {
  const project = await db.project.findUnique({
    where: { id },
    include: { models: true },
  });
  if (!project) return { ok: false, error: "Not found." };

  const gallery = Array.isArray(project.gallery) ? (project.gallery as string[]) : [];

  await Promise.all([
    ...project.models.map((m) => deleteUpload(m.fileUrl)),
    ...gallery.map((url) => deleteUpload(url)),
    project.coverImageUrl ? deleteUpload(project.coverImageUrl) : Promise.resolve(),
  ]);

  await db.project.delete({ where: { id } });
  revalidatePath("/admin/projects");
  revalidatePath("/[locale]/projects", "page");
  return { ok: true };
}

export async function uploadProjectModel(
  projectId: string,
  formData: FormData,
): Promise<ActionResult> {
  const file = formData.get("file");
  const nameEn = String(formData.get("nameEn") ?? "");
  const nameFa = String(formData.get("nameFa") ?? "");

  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Choose an .stl file first." };
  }
  if (!nameEn || !nameFa) {
    return { ok: false, error: "Give the model an English and Persian label." };
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const { url, sizeBytes } = await saveUpload("models", { name: file.name, buffer });

    const count = await db.projectModel.count({ where: { projectId } });
    await db.projectModel.create({
      data: { projectId, nameEn, nameFa, fileUrl: url, fileSizeBytes: sizeBytes, sortOrder: count },
    });
  } catch (error) {
    if (error instanceof UploadValidationError) {
      return { ok: false, error: error.message };
    }
    return { ok: false, error: "Upload failed. Please try again." };
  }

  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath("/[locale]/projects/[slug]", "page");
  return { ok: true };
}

export async function deleteProjectModel(
  modelId: string,
  projectId: string,
): Promise<ActionResult> {
  const model = await db.projectModel.findUnique({ where: { id: modelId } });
  if (!model) return { ok: false, error: "Not found." };

  await deleteUpload(model.fileUrl);
  await db.projectModel.delete({ where: { id: modelId } });

  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath("/[locale]/projects/[slug]", "page");
  return { ok: true };
}

export async function reorderProjects(orderedIds: string[]): Promise<ActionResult> {
  await db.$transaction(
    orderedIds.map((id, index) => db.project.update({ where: { id }, data: { sortOrder: index } })),
  );

  revalidatePath("/admin/projects");
  revalidatePath("/[locale]/projects", "page");
  revalidatePath("/[locale]", "page"); // homepage's featured-project order
  return { ok: true };
}

export async function reorderProjectModels(
  projectId: string,
  orderedIds: string[],
): Promise<ActionResult> {
  await db.$transaction(
    orderedIds.map((id, index) =>
      db.projectModel.update({ where: { id }, data: { sortOrder: index } }),
    ),
  );

  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath("/[locale]/projects/[slug]", "page");
  return { ok: true };
}
