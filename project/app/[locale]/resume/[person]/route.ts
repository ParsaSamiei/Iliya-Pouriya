import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ locale: string; person: string }> },
) {
  const { locale, person: slug } = await params;

  const person = await db.person.findUnique({
    where: { slug },
    select: { resumeUrlEn: true, resumeUrlFa: true },
  });

  if (!person) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Resume may be single-language — fall back to whichever locale exists
  // rather than 404ing, per docs/05_DATABASE.md's nullable resume_url_*.
  const url =
    locale === "fa"
      ? (person.resumeUrlFa ?? person.resumeUrlEn)
      : (person.resumeUrlEn ?? person.resumeUrlFa);

  if (!url) {
    return NextResponse.json({ error: "No resume uploaded yet" }, { status: 404 });
  }

  return NextResponse.redirect(new URL(url, request.url));
}
