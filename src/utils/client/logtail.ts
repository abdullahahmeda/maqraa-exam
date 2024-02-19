import { Logtail } from '@logtail/browser'
import { env } from '~/env.mjs'
export const browserLogtail = new Logtail(env.NEXT_PUBLIC_LOGTAIL_SOURCE_TOKEN)

export const logErrorToBrowserLogtail = (error: any) => {
  browserLogtail.error(error.message, {
    stack: error.stack,
  })
  browserLogtail.flush()
}
