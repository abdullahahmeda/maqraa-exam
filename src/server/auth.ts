import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from 'next-auth'
import { env } from '../env.js'
import { mssqlDB, db } from './db'
import Credentials from 'next-auth/providers/credentials'
import { loginSchema } from '~/validation/loginSchema'
import { KyselyAdapter } from '@auth/kysely-adapter'
import { type UserRole } from '~/kysely/enums'
import { verifyHashedPassword } from '~/services/password'

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
      phone: string | null
    } & DefaultSession['user']
  }

  interface User {
    FullName: string | null
    Email: string | null
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
  session: { strategy: 'jwt' },
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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        token.name = session.name
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        token.phone = session.phone
      }
      if (user) {
        token.name = user.FullName
        token.email = user.Email
        token.role = user.role
      }
      return token
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
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

        const user = await mssqlDB
          .selectFrom('AspNetUsers')
          .selectAll('AspNetUsers')
          .leftJoin(
            'AspNetUserRoles',
            'AspNetUsers.Id',
            'AspNetUserRoles.UserId',
          )
          .select(['AspNetUserRoles.RoleId as roleId'])
          .where('Email', '=', input.data.email)
          .executeTakeFirst()

        if (!user) return null

        // check password and bingo
        const isPasswordCorrect =
          env.NODE_ENV === 'development' && input.data.password === '1234'
            ? true
            : verifyHashedPassword(input.data.password, user.PasswordHash!)
        if (!isPasswordCorrect) return null

        let role: UserRole
        switch (user.roleId) {
          case '111':
            role = 'STUDENT'
            break
          case '156':
            role = 'ADMIN'
            break
          default:
            role = 'CORRECTOR'
            break
        }

        return { id: user.Id, FullName: user.FullName, Email: user.Email, role }
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
