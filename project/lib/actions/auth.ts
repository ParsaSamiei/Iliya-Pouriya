"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth";
import { formatRetryAfter, rateLimit, resetRateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request";

export type AdminSignInResult = { ok: true } | { ok: false; error: string };

// 5 attempts per 15 minutes per IP — there are exactly two legitimate
// accounts (docs/07_ADMIN_PANEL.md), so this is generous for a mistyped
// password and tight for brute-forcing either one.
const LOGIN_RATE_LIMIT = { max: 5, windowMs: 15 * 60 * 1000 };

export async function adminSignIn(email: string, password: string): Promise<AdminSignInResult> {
  const ip = await getClientIp();
  const rateLimitKey = `admin-login:${ip}`;

  const limit = rateLimit(rateLimitKey, LOGIN_RATE_LIMIT);
  if (!limit.allowed) {
    return {
      ok: false,
      error: `Too many sign-in attempts. Please try again in ${formatRetryAfter(limit.retryAfterSeconds)}.`,
    };
  }

  try {
    await signIn("credentials", { email, password, redirect: false });
    // Clear the counter on success so a couple of earlier typos don't leave
    // a legitimate owner partway through the window next time.
    resetRateLimit(rateLimitKey);
    return { ok: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { ok: false, error: "Invalid email or password." };
    }
    throw error;
  }
}
