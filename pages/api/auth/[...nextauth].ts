import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import {
  isAllowedGoogleEmail,
  normalizeEmail,
} from "@/app/server/allowedGoogleEmails";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async signIn({ account, profile, user }) {
      if (account?.provider !== "google") return false;

      const email = normalizeEmail(profile?.email ?? user.email);

      if (isAllowedGoogleEmail(email)) return true;

      return "/?error=AccessDenied";
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email;
      }

      return session;
    },
  },
  pages: {
    signIn: "/",
    error: "/",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 365 * 100,
  },
  jwt: {
    maxAge: 60 * 60 * 24 * 365 * 100,
  },
};

export default NextAuth(authOptions);
