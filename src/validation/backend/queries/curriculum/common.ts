import { z } from 'zod'

export const includeSchema = z.object({
  parts: z.boolean().optional(),
  track: z
    .boolean()
    .or(
      z.object({
        course: z.boolean(),
      }),
    )
    .optional(),
})
z.record(
  z.union([z.literal('parts'), z.literal('track')]),
  z.boolean().optional(),
)
export type IncludeSchema = z.infer<typeof includeSchema>

export const filtersSchema = z.object({
  trackId: z.string().optional(),
})

export type FiltersSchema = z.infer<typeof filtersSchema>
