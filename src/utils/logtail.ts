import { logtail } from '../server/logtail'

export const logErrorToLogtail = (error: any) => {
  logtail.error(error.message, {
    stack: error.stack
  })
  logtail.flush()
}
