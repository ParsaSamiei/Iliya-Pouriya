import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "./db";
import { rateLimit } from "./rate-limit";
import { getClientIp } from "./request";
import { loginSchema } from "./validation/auth";

/**
 * Auth.js (NextAuth v5), Credentials provider only — see docs/07_ADMIN_PANEL.md:
 * "No public sign-up. Admin accounts are seeded manually." There are exactly
 * two admin accounts (Iliya, Pouriya), both with full access — no roles.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (rawCredentials) => {
        const parsed = loginSchema.safeParse(rawCredentials);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;

        // Silent backstop, independent of lib/actions/auth.ts::adminSignIn's
        // user-facing rate limit — this one exists purely to blunt someone
        // hitting /api/auth/callback/credentials directly instead of going
        // through the admin login page/Server Action. Using a distinct
        // bucket key means it doesn't double-count normal UI-driven
        // attempts; it just fires independently at the same threshold.
        // A rate-limited hit returns null, same as any wrong password —
        // no custom error text needed since the caller can't tell the
        // difference either way.
        const ip = await getClientIp();
        const limit = rateLimit(`admin-login-authorize:${ip}`, {
          max: 5,
          windowMs: 15 * 60 * 1000,
        });
        if (!limit.allowed) return null;

        const admin = await db.admin.findUnique({ where: { email } });
        if (!admin) return null;

        const passwordMatches = await bcrypt.compare(password, admin.passwordHash);
        if (!passwordMatches) return null;

        return { id: admin.id, email: admin.email };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      if (session.user && typeof token.id === "string") {
        session.user.id = token.id;
      }
      return session;
    },
  },
});
