import { readFile } from 'fs/promises'
import path from 'path'

import NextAuth, { type NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const ALLOWED_GOOGLE_ACCOUNTS_PATH = path.join(
  process.cwd(),
  'config',
  'allowed-google-accounts.json'
)

const normalizeEmail = (email?: string | null) => email?.trim().toLowerCase() ?? ''

const getAllowedEmails = async () => {
  try {
    const allowedGoogleAccountsFile = await readFile(
      ALLOWED_GOOGLE_ACCOUNTS_PATH,
      'utf8'
    )
    const allowedGoogleAccounts = JSON.parse(allowedGoogleAccountsFile)

    if (!Array.isArray(allowedGoogleAccounts)) return new Set<string>()

    return new Set(
      allowedGoogleAccounts
        .filter((email): email is string => typeof email === 'string')
        .map((email) => normalizeEmail(email))
    )
  } catch {
    return new Set<string>()
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
  ],
  callbacks: {
    async signIn({ account, profile, user }) {
      if (account?.provider !== 'google') return false

      const allowedEmails = await getAllowedEmails()
      const email = normalizeEmail(profile?.email ?? user.email)

      if (allowedEmails.has(email)) return true

      return '/?error=AccessDenied'
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email
      }

      return session
    },
  },
  pages: {
    signIn: '/',
    error: '/',
  },
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 * 365 * 100,
  },
  jwt: {
    maxAge: 60 * 60 * 24 * 365 * 100,
  },
}

export default NextAuth(authOptions)
