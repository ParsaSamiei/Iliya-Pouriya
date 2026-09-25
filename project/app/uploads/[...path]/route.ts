import { createReadStream } from "node:fs";
import { Readable } from "node:stream";
import { type NextRequest, NextResponse } from "next/server";
import { resolveStoredUpload } from "@/lib/uploads";

export const runtime = "nodejs";

/**
 * Serve files written by saveUpload when the request reaches Next
 * (image optimizer, `next start` without nginx). Production nginx still
 * answers `/uploads/` from the volume first.
 */
async function serveUpload(segments: string[]) {
  const file = await resolveStoredUpload(segments);
  if (!file) {
    return new NextResponse("Not found", { status: 404 });
  }

  const body = Readable.toWeb(createReadStream(file.absolutePath)) as ReadableStream<Uint8Array>;
  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": file.mime,
      "Content-Length": String(file.size),
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
      "Content-Disposition": "inline",
    },
  });
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await params;
  return serveUpload(segments);
}

export async function HEAD(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await params;
  const file = await resolveStoredUpload(segments);
  if (!file) {
    return new NextResponse("Not found", { status: 404 });
  }
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Content-Type": file.mime,
      "Content-Length": String(file.size),
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
      "Content-Disposition": "inline",
    },
  });
}
