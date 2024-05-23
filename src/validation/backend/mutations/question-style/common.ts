import { z } from 'zod'
import { QuestionType } from '~/kysely/enums'

export const baseSchema = z.object({
  name: z.string().min(1),
})

export function generateSchema<T extends z.ZodRawShape>(base: z.ZodObject<T>) {
  const withColumnsSchema = base.extend({
    type: z.literal(QuestionType.MCQ),
    choicesColumns: z
      .array(
        z.union([
          z.literal('option1'),
          z.literal('option2'),
          z.literal('option3'),
          z.literal('option4'),
          z.literal('textForTrue'),
          z.literal('textForFalse'),
        ]),
      )
      .min(1),
  })
  const withoutColumnsSchema = base.extend({
    type: z.literal(QuestionType.WRITTEN),
  })
  return z.discriminatedUnion('type', [withColumnsSchema, withoutColumnsSchema])
}
