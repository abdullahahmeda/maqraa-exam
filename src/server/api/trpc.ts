/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * tl;dr - This is where all the tRPC server stuff is created and plugged in.
 * The pieces you will need to use are documented accordingly near the end.
 */

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the
 * database, the session, etc.
 */
import { type CreateNextContextOptions } from '@trpc/server/adapters/next'
import { type Session } from 'next-auth'

import { getServerAuthSession } from '../auth'
import { prisma } from '../db'
import { enhance } from '@zenstackhq/runtime'

type CreateContextOptions = {
  session:
    | (Session & {
        user: { role?: string }
      })
    | null
  prisma: PrismaClient
}

/**
 * This helper generates the "internals" for a tRPC context. If you need to use
 * it, you can export it from here.
 *
 * Examples of things you may need it for:
 * - testing, so we don't have to mock Next.js' req/res
 * - tRPC's `createSSGHelpers`, where we don't have req/res
 *
 * @see https://create.t3.gg/en/usage/trpc#-servertrpccontextts
 */
const createInnerTRPCContext = async (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    prisma: enhance(prisma, { user: opts.session?.user }),
  }
}

/**
 * This is the actual context you will use in your router. It will be used to
 * process every request that goes through your tRPC endpoint.
 *
 * @see https://trpc.io/docs/context
 */
export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts

  // Get the session from the server using the getServerSession wrapper function
  const session = await getServerAuthSession({ req, res })

  return createInnerTRPCContext({
    session,
    // @ts-expect-error
    prisma: enhance(prisma, { user: session?.user }),
  })
}

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and
 * transformer.
 */
import { initTRPC, TRPCError } from '@trpc/server'
import superjson from 'superjson'
import { UserRole } from '../../constants'
import { ZodError } from 'zod'
import { PrismaClient } from '@prisma/client'
import { env } from '~/env.mjs'

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter(opts) {
    const { shape, error } = opts
    if (env.NODE_ENV === 'production') {
      if (shape.data.code === 'FORBIDDEN')
        shape.message = 'لا تملك الصلاحية لهذه العملية'
      if (shape.data.code === 'INTERNAL_SERVER_ERROR')
        shape.message = 'حدث خطأ غير متوقع'
    }

    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          // error.code === 'BAD_REQUEST' &&
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    }
  },
})

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these
 * a lot in the "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router

export const mergeRouters = t.mergeRouters

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your
 * tRPC API. It does not guarantee that a user querying is authorized, but you
 * can still access user session data if they are logged in.
 */
export const publicProcedure = t.procedure

/**
 * Reusable middleware that enforces users are logged in before running the
 * procedure.
 */
const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'هذه العملية غير مصرحة لك، يجب تسجيل الدخول أولاً',
    })
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  })
})

/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use
 * this. It verifies the session is valid and guarantees `ctx.session.user` is
 * not null.
 *
 * @see https://trpc.io/docs/procedures
 */
export const protectedProcedure = t.procedure.use(enforceUserIsAuthed)

const enforceUserIsAdmin = t.middleware(({ ctx, next }) => {
  if (
    !ctx.session ||
    !ctx.session.user ||
    ctx.session.user.role !== UserRole.ADMIN
  ) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'هذه العملية غير مصرحة لك، يجب تسجيل الدخول أولاً',
    })
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  })
})

export const adminOnlyProcedure = t.procedure.use(enforceUserIsAdmin)
