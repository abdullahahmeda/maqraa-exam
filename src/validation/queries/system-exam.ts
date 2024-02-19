import { z } from 'zod'
import { QuizType } from '~/kysely/enums'

export const filtersSchema = z.object({
  type: z.nativeEnum(QuizType).optional(),
  cycleId: z.string().optional(),
  curriculumId: z.string().optional(),
})

export type FiltersInput = z.infer<typeof filtersSchema>

export const includeSchema = z.object({
  cycle: z.boolean().optional(),
  curriculum: z
    .boolean()
    .or(
      z.object({
        track: z
          .boolean()
          .or(
            z.object({
              course: z.boolean().optional(),
            })
          )
          .optional(),
      })
    )
    .optional(),
})

export type IncludeInput = z.infer<typeof includeSchema>
