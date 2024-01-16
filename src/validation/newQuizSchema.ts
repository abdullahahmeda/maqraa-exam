import { QuestionDifficulty } from '~/kysely/enums'
import { z } from 'zod'

export const newQuizSchema = z
  .object({
    courseId: z.string().min(1),
    from: z.object({
      part: z.preprocess(
        (v) => (v !== '' ? Number(v) : v),
        z.number().int().safe().finite()
      ),
      page: z.preprocess(
        (v) => (v !== '' ? Number(v) : v),
        z.number().int().safe().finite()
      ),
      hadith: z.preprocess(
        (v) => (v !== '' ? Number(v) : v),
        z.number().int().safe().finite()
      ),
    }),
    to: z.object({
      part: z.preprocess(
        (v) => (v !== '' ? Number(v) : v),
        z.number().int().safe().finite()
      ),
      page: z.preprocess(
        (v) => (v !== '' ? Number(v) : v),
        z.number().int().safe().finite()
      ),
      hadith: z.preprocess(
        (v) => (v !== '' ? Number(v) : v),
        z.number().int().safe().finite()
      ),
    }),
    repeatFromSameHadith: z.boolean(),
    difficulty: z.union([
      z.nativeEnum(QuestionDifficulty, {
        invalid_type_error: 'يجب اختيار المستوى',
      }),
      z.literal('').transform(() => null),
      z.null(),
    ]),
    questionsNumber: z.preprocess(
      (v) => Number(v),
      z.number().positive().int().finite().safe().max(25)
    ),
  })
  .refine(
    ({ from, to }) => {
      return (
        to.part > from.part ||
        (to.part === from.part && to.page > from.page) ||
        (to.part === from.part &&
          to.page === from.page &&
          to.hadith >= from.hadith)
      )
    },
    {
      path: ['from.part'],
      message: 'نطاق غير صالح',
    }
  )
