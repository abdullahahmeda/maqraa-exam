import { z } from 'zod'
import { QuizType } from '~/kysely/enums'
import { numberInput } from '~/validation/common'

const questionSchema = z.object({
  id: z.string(),
  weight: numberInput.pipe(z.number().int().safe().positive()),
})

export const createExamSchema = z.object({
  name: z.string().min(1),
  type: z.nativeEnum(QuizType),
  isInsideShaded: z
    .boolean()
    .or(z.literal('INSIDE').transform(() => true))
    .or(z.literal('OUTSIDE').transform(() => false))
    .or(z.literal('').transform(() => undefined))
    .optional(),
  endsAt: z.date().nullish(),
  curriculumId: z.string(),
  cycleId: z.string(),
  // repeatFromSameHadith: z.boolean(),
  questions: z
    .array(questionSchema)
    .min(1)
    .superRefine((questions, ctx) => {
      const s = new Set(questions.map(({ id }) => id))
      if (s.size !== questions.length)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'هناك أسئلة مكررة',
          path: ['questions'],
        })
    }),
})
