import { z } from 'zod'

export const includeSchema = z.record(
  z.literal('course'),
  z.boolean().optional(),
)
export type IncludeSchema = z.infer<typeof includeSchema>

export const filtersSchema = z.object({
  courseId: z.string().optional(),
})

export type FiltersSchema = z.infer<typeof filtersSchema>
