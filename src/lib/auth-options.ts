import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { writeAuditLog } from "@/lib/audit";
import { logServer } from "@/lib/logger";
import { ADMIN_EMAIL, ADMIN_NAME, verifyAdminPassword } from "@/lib/admin-credentials";
import { getAuthSecret } from "@/lib/auth-secret";

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
        if (!(await verifyAdminPassword(credentials.password))) return null;

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
  secret: getAuthSecret(),
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
