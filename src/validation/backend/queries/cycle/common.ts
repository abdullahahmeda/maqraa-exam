import { z } from 'zod'

export const filtersSchema = z.object({
  name: z.string().optional(),
})

export type FiltersSchema = z.infer<typeof filtersSchema>

export const includeSchema = z.object({
  cycleCurricula: z
    .boolean()
    .or(
      z.object({
        curriculum: z.boolean().optional(),
      }),
    )
    .optional(),
})

export type IncludeSchema = z.infer<typeof includeSchema>
