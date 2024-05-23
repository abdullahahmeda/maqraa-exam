import { logtail } from '../server/logtail'

export const logErrorToLogtail = (error: any) => {
  void logtail.error(error.message, {
    stack: error.stack,
  })
  void logtail.flush()
}
