import { z } from 'zod'
import { QuestionType } from '~/kysely/enums'

export const filtersSchema = z.object({
  name: z.string().optional(),
  type: z.nativeEnum(QuestionType).optional(),
})

export type FiltersSchema = z.infer<typeof filtersSchema>
