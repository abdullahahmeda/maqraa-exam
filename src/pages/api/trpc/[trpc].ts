import { createNextApiHandler } from '@trpc/server/adapters/next'

import { env } from '~/env.mjs'
import { createTRPCContext } from '~/server/api/trpc'
import { appRouter } from '~/server/api/root'
import { logErrorToLogtail } from '~/utils/logtail'

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
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

// export const config = {
//   responseLimit: '1mb',
// }
