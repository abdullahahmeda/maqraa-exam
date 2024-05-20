import { z } from 'zod'
import { UserRole } from '~/kysely/enums'

export const createNotificationSchema = z.object({
  body: z.string(),
  url: z
    .string()
    .url()
    .transform((v) => (v === '' ? undefined : v))
    .optional(),
  to: z.discriminatedUnion('base', [
    z.object({
      base: z.literal('all'),
    }),
    z.object({
      base: z.literal('allExcept'),
      allExcept: z
        .array(
          z.object({
            value: z.string(),
          }),
        )
        .min(1),
    }),
    z.object({
      base: z.literal('selected'),
      selected: z
        .array(
          z.object({
            value: z.string(),
          }),
        )
        .min(1),
    }),
    z.object({
      base: z.literal('custom'),
      custom: z.object({
        role: z.array(z.nativeEnum(UserRole)).min(1),
        cycle: z.string(),
      }),
    }),
  ]),
})
