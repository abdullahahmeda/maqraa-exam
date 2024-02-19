import { coerceEmptyStringsToUndefined } from '~/utils/replaceEmptyStringsWithUndefined'
import { AnyTRPCMiddlewareFunction } from '@trpc/server'

export const coerceEmptyStringsToUndefinedMiddleware: AnyTRPCMiddlewareFunction =
  async ({ next, getRawInput }) => {
    const input = await getRawInput()
    const newInput = coerceEmptyStringsToUndefined(input)
    return next({
      input: newInput,
    })
  }
