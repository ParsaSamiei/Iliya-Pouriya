"use server";

import { db } from "@/lib/db";
import { formatRetryAfter, rateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request";
import { type ContactMessageInput, contactMessageSchema } from "@/lib/validation/contact";

export type SubmitContactMessageResult = { ok: true } | { ok: false; error: string };

// 5 messages per 10 minutes per IP — generous for a real visitor, tight
// enough to blunt a script hammering the form. Also covers /api/contact,
// which just calls this same function.
const CONTACT_RATE_LIMIT = { max: 5, windowMs: 10 * 60 * 1000 };

/**
 * Server Action, preferred over a hand-rolled API route per
 * docs/06_FRONTEND_ARCHITECTURE.md. Writes to contact_messages and,
 * if RESEND_API_KEY is configured, sends a notification email — see
 * docs/07_ADMIN_PANEL.md ("recommended, since checking /admin/messages
 * manually will get missed"). Email sending is optional/best-effort: a
 * failed notification never blocks the message from being recorded.
 */
export async function submitContactMessage(
  input: ContactMessageInput,
): Promise<SubmitContactMessageResult> {
  // Rate-limit before validating: an attacker sending deliberately malformed
  // payloads shouldn't get free, unlimited attempts just because they never
  // reach a "valid" submission.
  const ip = await getClientIp();
  const limit = rateLimit(`contact:${ip}`, CONTACT_RATE_LIMIT);
  if (!limit.allowed) {
    return {
      ok: false,
      error: `Too many messages sent. Please try again in ${formatRetryAfter(limit.retryAfterSeconds)}.`,
    };
  }

  const parsed = contactMessageSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Invalid submission." };
  }

  try {
    await db.contactMessage.create({ data: parsed.data });
  } catch {
    return { ok: false, error: "Could not save your message. Please try again." };
  }

  await notifyByEmail(parsed.data).catch(() => {
    // Best-effort only — see docstring above.
  });

  return { ok: true };
}

async function notifyByEmail(data: ContactMessageInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const notifyTo = process.env.CONTACT_NOTIFY_EMAIL;
  if (!apiKey || !notifyTo) return;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.CONTACT_NOTIFY_FROM ?? "site@localhost",
      to: notifyTo,
      subject: `New contact message from ${data.name}`,
      text: `${data.name} <${data.email}>\n\n${data.message}`,
    }),
  });
}
