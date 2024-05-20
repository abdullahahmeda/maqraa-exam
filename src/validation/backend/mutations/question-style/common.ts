import { z } from 'zod'
import { QuestionType } from '~/kysely/enums'
import { columnMapping } from '~/utils/questions'

export const baseSchema = z.object({
  name: z.string().min(1),
})

export function generateSchema<T extends z.ZodRawShape>(base: z.ZodObject<T>) {
  const withColumnsSchema = base.extend({
    type: z.literal(QuestionType.MCQ),
    choicesColumns: z
      // @ts-expect-error Can't type this
      .array(z.union(Object.values(columnMapping).map((c) => z.literal(c))))
      .min(1),
  })
  const withoutColumnsSchema = base.extend({
    type: z.literal(QuestionType.WRITTEN),
  })
  return z.discriminatedUnion('type', [withColumnsSchema, withoutColumnsSchema])
}
