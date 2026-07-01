import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { writeAuditLog } from "@/lib/audit";
import { logServer } from "@/lib/logger";

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "admin@smartgroupsolution.com")
  .toLowerCase()
  .trim();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin123!";
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || "";
const ADMIN_NAME = process.env.ADMIN_NAME || "Administrator";

/**
 * Verify a submitted password against either a bcrypt hash
 * (`ADMIN_PASSWORD_HASH`) or a plain-text password (`ADMIN_PASSWORD`).
 * The hash takes precedence when both are provided.
 */
async function verifyPassword(submitted: string): Promise<boolean> {
  if (ADMIN_PASSWORD_HASH) {
    try {
      return await bcrypt.compare(submitted, ADMIN_PASSWORD_HASH);
    } catch {
      return false;
    }
  }
  // Constant-time-ish comparison for the plain-text fallback.
  if (submitted.length !== ADMIN_PASSWORD.length) return false;
  let mismatch = 0;
  for (let i = 0; i < submitted.length; i++) {
    mismatch |= submitted.charCodeAt(i) ^ ADMIN_PASSWORD.charCodeAt(i);
  }
  return mismatch === 0;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email.toLowerCase().trim();
        if (email !== ADMIN_EMAIL) return null;
        if (!(await verifyPassword(credentials.password))) return null;

        return { id: "admin", email: ADMIN_EMAIL, name: ADMIN_NAME };
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 },
  pages: { signIn: "/admin/login" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.id = token.id as string;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  events: {
    async signIn({ user }) {
      await writeAuditLog({
        userId: user.id,
        action: "auth.sign_in",
        entity: "User",
        details: user.email ?? undefined,
      });
    },
    async signOut({ token }) {
      const userId = typeof token?.id === "string" ? token.id : undefined;
      await writeAuditLog({ userId, action: "auth.sign_out", entity: "User" });
    },
  },
  logger: {
    error(code, metadata) {
      logServer("error", `NextAuth ${code}`, JSON.stringify(metadata));
    },
  },
};
