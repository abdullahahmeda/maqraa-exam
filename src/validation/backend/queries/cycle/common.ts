import { z } from 'zod'

export const filtersSchema = z.object({
  name: z.string().optional(),
})

export type FiltersSchema = z.infer<typeof filtersSchema>

