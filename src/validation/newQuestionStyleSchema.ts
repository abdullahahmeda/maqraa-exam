import { z } from 'zod'
import { QuestionType } from '~/kysely/enums'
import { columnMapping } from '~/utils/questions'

const commonSchema = z.object({
  name: z.string().min(1),
})

const withColumnsSchema = commonSchema.extend({
  type: z.literal(QuestionType.MCQ),
  choicesColumns: z
    .array(
      z.union(
        // @ts-ignore
        Object.values(columnMapping).map((c) => z.literal(c))
      )
    )
    .nonempty(),
})
const withoutColumnsSchema = commonSchema.extend({
  type: z.literal(QuestionType.WRITTEN),
})

export const newQuestionStyleSchema = z.discriminatedUnion('type', [
  withColumnsSchema,
  withoutColumnsSchema,
])

export type NewQuestionStyleSchema = z.infer<typeof newQuestionStyleSchema>
