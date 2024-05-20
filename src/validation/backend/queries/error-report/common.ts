import { z } from 'zod'

export const includeSchema = z.object({
  modelQuestion: z
    .boolean()
    .or(
      z.object({
        question: z.boolean().optional(),
      }),
    )
    .optional(),
  user: z.boolean().optional(),
})

export type IncludeSchema = z.infer<typeof includeSchema>
