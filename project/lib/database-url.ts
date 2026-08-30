/**
 * Neon and other hosted Postgres URLs often use `sslmode=require`. The `pg`
 * driver currently treats that as verify-full but warns; make the intent
 * explicit so logs stay clean across pg v9.
 */
export function normalizeDatabaseUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const sslmode = parsed.searchParams.get("sslmode");
    if (sslmode === "require" || sslmode === "prefer" || sslmode === "verify-ca") {
      parsed.searchParams.set("sslmode", "verify-full");
      return parsed.toString();
    }
  } catch {
    // Not a parseable URL — return unchanged.
  }
  return url;
}
