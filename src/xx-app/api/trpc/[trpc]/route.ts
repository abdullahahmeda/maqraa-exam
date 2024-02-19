import {
  FetchCreateContextFnOptions,
  fetchRequestHandler,
} from '@trpc/server/adapters/fetch'
import { getSession } from 'next-auth/react'
import { env } from '~/env.mjs'
import { appRouter } from '~/server/api/root'
import { createInnerTRPCContext } from '~/server/api/trpc'
import { logErrorToLogtail } from '~/utils/logtail'
import { db } from '~/server/db'

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: async ({ req }: FetchCreateContextFnOptions) => {
      // Get the session from the server using the getServerSession wrapper function
      const session = await getSession({ req })

      return createInnerTRPCContext({
        session,
        db,
      })
    },
    onError:
      env.NODE_ENV === 'development'
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`
            )
          }
        : ({ error }) => {
            if (error.code === 'INTERNAL_SERVER_ERROR') logErrorToLogtail(error)
          },
  })

export { handler as GET, handler as POST }
