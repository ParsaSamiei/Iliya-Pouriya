import { NextResponse } from "next/server";
import { submitContactMessage } from "@/lib/actions/contact";

/**
 * The contact form itself calls the submitContactMessage Server Action
 * directly (preferred per docs/06_FRONTEND_ARCHITECTURE.md). This route
 * exists only for the documented folder structure / any non-JS or external
 * caller that needs a plain HTTP endpoint.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const result = await submitContactMessage(body);
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
