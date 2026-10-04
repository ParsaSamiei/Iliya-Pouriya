"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { personSchema } from "@/lib/validation/person";

export type ActionResult = { ok: true } | { ok: false; error: string };

function emptyToUndefined(value: FormDataEntryValue | null): string | undefined {
  const trimmed = String(value ?? "").trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function normalizeHttpUrl(value: FormDataEntryValue | null): string | undefined {
  const trimmed = emptyToUndefined(value);
  if (!trimmed) return undefined;
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function revalidatePersonPages(slug: string) {
  revalidatePath("/admin/people");
  // next-intl `localePrefix: as-needed`: FA has no prefix, EN is `/en/*`.
  // Also invalidate the internal `/fa/*` paths used at build time.
  // Homepage has no ISR window, so it must be included or people cards
  // stay stale until the next deploy.
  revalidatePath("/", "layout");
  for (const prefix of ["", "/fa", "/en"]) {
    revalidatePath(`${prefix || "/"}`);
    revalidatePath(`${prefix}/about`);
    revalidatePath(`${prefix}/team/${slug}`);
  }
  revalidatePath("/[locale]", "page");
  revalidatePath("/[locale]/about", "page");
  revalidatePath("/[locale]/team/[person]", "page");
  revalidatePath("/[locale]/projects/[slug]", "page");
  revalidatePath("/[locale]/blog/[slug]", "page");
}

export async function updatePerson(id: string, formData: FormData): Promise<ActionResult> {
  const raw = {
    slug: String(formData.get("slug") ?? ""),
    nameEn: String(formData.get("nameEn") ?? "").trim(),
    nameFa: String(formData.get("nameFa") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    photoUrl: emptyToUndefined(formData.get("photoUrl")),
    bioEn: emptyToUndefined(formData.get("bioEn")),
    bioFa: emptyToUndefined(formData.get("bioFa")),
    resumeUrlEn: emptyToUndefined(formData.get("resumeUrlEn")),
    resumeUrlFa: emptyToUndefined(formData.get("resumeUrlFa")),
    socialLinks: {
      github: normalizeHttpUrl(formData.get("github")),
      linkedin: normalizeHttpUrl(formData.get("linkedin")),
      email: emptyToUndefined(formData.get("socialEmail")),
    },
  };

  const parsed = personSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  try {
    await db.person.update({
      where: { id },
      data: {
        slug: parsed.data.slug,
        nameEn: parsed.data.nameEn,
        nameFa: parsed.data.nameFa,
        title: parsed.data.title,
        photoUrl: parsed.data.photoUrl ?? null,
        bioEn: parsed.data.bioEn ?? null,
        bioFa: parsed.data.bioFa ?? null,
        resumeUrlEn: parsed.data.resumeUrlEn ?? null,
        resumeUrlFa: parsed.data.resumeUrlFa ?? null,
        socialLinks: parsed.data.socialLinks ?? {},
      },
    });
  } catch (error) {
    console.error("updatePerson failed", error);
    return { ok: false, error: "Could not save this person. Try again." };
  }

  revalidatePersonPages(parsed.data.slug);
  return { ok: true };
}
