import type { GetServerSidePropsContext } from 'next'
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { env } from '../env.mjs'
import { prisma } from './db'
import { UserRole } from '@prisma/client'
import Credentials from 'next-auth/providers/credentials'
import { loginSchema } from '~/validation/loginSchema'
import { compareSync } from 'bcryptjs'

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
    signIn: '/login',
    verifyRequest: '/verify-request',
  },
  debug: env.NODE_ENV === 'development',
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async session ({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.email = token.email
        session.user.role = token.role as UserRole
      }
      return session
    },
    async jwt ({ token, user }) {
      if (user) {
        token.name = user.name
        token.email = user.email
        token.role = user.role
      }
      return token
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      credentials: {
        email: { label: 'البريد الإلكتروني', type: 'email' },
        password: { label: 'كلمة المرور', type: 'password' },
      },
      async authorize (credentials, req) {
        const input = loginSchema.safeParse(credentials)
        if (!input.success) return null

        const user = await prisma.user.findFirst({
          where: { email: input.data.email },
        })

        if (!user) return null

        // check password and bingo
        const isPasswordCorrect = compareSync(
          input.data.password,
          user.password
        )
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
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext['req']
  res: GetServerSidePropsContext['res']
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions)
}
