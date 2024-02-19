import { AnyTRPCMiddlewareFunction } from '@trpc/server'
import { coerceStringsToBoolean } from '~/utils/coerceStringsToBoolean'

export const coerceStringsToBooleanMiddleware: AnyTRPCMiddlewareFunction =
  async ({ getRawInput, next }) => {
    const input = await getRawInput()
    const newInput = coerceStringsToBoolean(input)
    return next({
      input: newInput,
    })
  }
