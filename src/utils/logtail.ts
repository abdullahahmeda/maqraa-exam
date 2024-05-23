import { logtail } from '../server/logtail'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const logErrorToLogtail = (error: any) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
  void logtail.error(error.message, {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    stack: error.stack,
  })
  void logtail.flush()
}
