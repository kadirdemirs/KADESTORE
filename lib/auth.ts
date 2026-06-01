import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { rateLimit } from "./rate-limit";

export const BCRYPT_ROUNDS = 12;

type UserRole = "user" | "admin";

function toUserRole(role: string): UserRole {
  return role === "admin" ? "admin" : "user";
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt", maxAge: 7 * 24 * 60 * 60 }, // 7 gün (30 yerine)
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  useSecureCookies: process.env.NODE_ENV === "production",
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) return null;

        // Rate-limit: email + IP başına 10 deneme / 15 dakika
        const ip = (req?.headers?.["x-forwarded-for"] as string) || "unknown";
        const key = `login:${credentials.email.toLowerCase()}:${ip}`;
        const { ok } = rateLimit(key, 10, 15 * 60 * 1000);
        if (!ok) {
          throw new Error("Çok fazla giriş denemesi. 15 dakika sonra tekrar deneyin.");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
        });
        if (!user) return null;

        // E-posta doğrulanmamışsa girişe izin verme
        if ((user as any).emailVerified === false) {
          throw new Error("Lütfen e-posta adresinizi doğrulayın.");
        }

        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: toUserRole(user.role),
          points: user.points,
          rank: user.rank,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.points = (user as any).points;
        token.rank = (user as any).rank;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).points = token.points;
        (session.user as any).rank = token.rank;
      }
      return session;
    },
  },
};
