import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from 'next-auth'
import { env } from '../env.js'
import { db } from './db'
import Credentials from 'next-auth/providers/credentials'
import { loginSchema } from '~/validation/loginSchema'
import { KyselyAdapter } from '@auth/kysely-adapter'
import { UserRole } from '~/kysely/enums'
import { comparePassword } from '~/utils/server/password'

/**
 * Module augmentation for `next-auth` types.
 * Allows us to add custom properties to the `session` object and keep type
 * safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 **/
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string
      role: UserRole
    } & DefaultSession['user']
  }

  interface User {
    role: UserRole
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks,
 * etc.
 *
 * @see https://next-auth.js.org/configuration/options
 **/
export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/',
    verifyRequest: '/verify-request',
  },
  debug: env.NODE_ENV === 'development',
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.email = token.email
        session.user.role = token.role as UserRole
      }
      return session
    },
    async jwt({ token, user, session, trigger }) {
      if (trigger === 'update') {
        token.name = session.name
        token.phone = session.phone
      }
      if (user) {
        token.name = user!.name
        token.email = user!.email
        token.role = user!.role
      }
      return token
    },
  },
  adapter: KyselyAdapter(db as any) as any,
  providers: [
    Credentials({
      credentials: {
        email: { label: 'البريد الإلكتروني', type: 'email' },
        password: { label: 'كلمة المرور', type: 'password' },
      },
      async authorize(credentials, req) {
        const input = loginSchema.safeParse(credentials)
        if (!input.success) return null

        const user = await db
          .selectFrom('User')
          .selectAll()
          .where('email', '=', input.data.email)
          .executeTakeFirst()

        if (!user) return null

        // check password and bingo
        const isPasswordCorrect =
          env.NODE_ENV === 'development' && input.data.password === '1234'
            ? true
            : comparePassword(input.data.password, user.password)
        if (!isPasswordCorrect) return null

        return user
      },
    }),
  ],
}

/**
 * Wrapper for `getServerSession` so that you don't need to import the
 * `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 **/
export const getServerAuthSession = () => getServerSession(authOptions)
