"use server";

import bcrypt from "bcryptjs";
import { auth, unstable_update } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatRetryAfter, rateLimit, resetRateLimit } from "@/lib/rate-limit";
import { changeEmailSchema, changePasswordSchema } from "@/lib/validation/auth";

export type AccountActionResult = { ok: true } | { ok: false; error: string };

const ACCOUNT_RATE_LIMIT = { max: 8, windowMs: 15 * 60 * 1000 };

async function currentAdmin() {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) return null;
  return db.admin.findUnique({ where: { id } });
}

function firstIssueMessage(issues: { message: string }[]): string {
  return issues[0]?.message ?? "Invalid input.";
}

export async function changeAdminEmail(input: {
  email: string;
  currentPassword: string;
}): Promise<AccountActionResult> {
  const admin = await currentAdmin();
  if (!admin) return { ok: false, error: "Sign in again to change your email." };

  const limitKey = `admin-account:${admin.id}`;
  const limit = rateLimit(limitKey, ACCOUNT_RATE_LIMIT);
  if (!limit.allowed) {
    return {
      ok: false,
      error: `Too many attempts. Please try again in ${formatRetryAfter(limit.retryAfterSeconds)}.`,
    };
  }

  const parsed = changeEmailSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: firstIssueMessage(parsed.error.issues) };

  const passwordMatches = await bcrypt.compare(parsed.data.currentPassword, admin.passwordHash);
  if (!passwordMatches) return { ok: false, error: "Current password is incorrect." };

  if (parsed.data.email === admin.email.toLowerCase()) {
    return { ok: false, error: "That is already your email." };
  }

  const taken = await db.admin.findUnique({ where: { email: parsed.data.email } });
  if (taken) return { ok: false, error: "That email is already in use." };

  await db.admin.update({
    where: { id: admin.id },
    data: { email: parsed.data.email },
  });

  resetRateLimit(limitKey);

  try {
    await unstable_update({ user: { email: parsed.data.email } });
  } catch {
    // The row is already updated. The session email catches up on the next sign-in.
  }

  return { ok: true };
}

export async function changeAdminPassword(input: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<AccountActionResult> {
  const admin = await currentAdmin();
  if (!admin) return { ok: false, error: "Sign in again to change your password." };

  const limitKey = `admin-account:${admin.id}`;
  const limit = rateLimit(limitKey, ACCOUNT_RATE_LIMIT);
  if (!limit.allowed) {
    return {
      ok: false,
      error: `Too many attempts. Please try again in ${formatRetryAfter(limit.retryAfterSeconds)}.`,
    };
  }

  const parsed = changePasswordSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: firstIssueMessage(parsed.error.issues) };

  const passwordMatches = await bcrypt.compare(parsed.data.currentPassword, admin.passwordHash);
  if (!passwordMatches) return { ok: false, error: "Current password is incorrect." };

  const samePassword = await bcrypt.compare(parsed.data.newPassword, admin.passwordHash);
  if (samePassword) return { ok: false, error: "Choose a different password." };

  const passwordHash = await bcrypt.hash(parsed.data.newPassword, 10);
  await db.admin.update({
    where: { id: admin.id },
    data: { passwordHash },
  });

  resetRateLimit(limitKey);
  return { ok: true };
}
