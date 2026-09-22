import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { saveUpload, type UploadCategory, UploadValidationError } from "@/lib/uploads";

export const runtime = "nodejs";

const CLIENT_ALLOWED: UploadCategory[] = [
  "projects",
  "blog",
  "profiles",
  "resumes",
  "gallery",
  "sponsors",
  "clients",
];

/**
 * Admin file upload via Route Handler — Server Actions choke on large
 * multipart bodies ("Unexpected end of form" / 1 MB default). This path
 * is excluded from proxy.ts and accepts up to the category caps in lib/uploads.
 */
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Upload was interrupted. Try a smaller file or retry." },
      { status: 400 },
    );
  }

  const category = String(formData.get("category") ?? "") as UploadCategory;
  if (!CLIENT_ALLOWED.includes(category)) {
    return NextResponse.json({ ok: false, error: "Invalid upload category." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ ok: false, error: "Choose a file first." }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const { url } = await saveUpload(category, { name: file.name, buffer });
    return NextResponse.json({ ok: true, url } satisfies UploadApiResult);
  } catch (error) {
    if (error instanceof UploadValidationError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { ok: false, error: "Upload failed. Please try again." },
      { status: 500 },
    );
  }
}

export type UploadApiResult = { ok: true; url: string } | { ok: false; error: string };
