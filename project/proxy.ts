import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { auth } from "./lib/auth";

const handleI18n = createMiddleware(routing);

/**
 * proxy.ts (Next.js 16's replacement for middleware.ts — see
 * docs/09_DEVELOPMENT_GUIDELINES.md and the Next.js 16 upgrade guide).
 * Unlike middleware.ts, this runs on the Node.js runtime — not Edge, and
 * not configurable — which matters here because lib/auth.ts pulls in
 * lib/db.ts and the Prisma-generated client, which use Node built-ins
 * (node:path, node:url, etc.) that the Edge Runtime can't load. Running
 * this on Node.js is what makes the real session check below possible at
 * all; it would fail the same way the old middleware.ts did otherwise.
 *
 * The /admin panel is deliberately excluded from the locale-prefixed,
 * public site — it's a single-locale (English) internal tool, gated by
 * a real session check here rather than left to page-level redirects.
 */
export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (pathname.startsWith("/admin/login")) {
      return NextResponse.next();
    }
    const session = await auth();
    if (!session?.user) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  return handleI18n(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|uploads|.*\\..*).*)"],
};
