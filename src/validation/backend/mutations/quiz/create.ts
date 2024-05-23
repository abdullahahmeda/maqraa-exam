import { QuestionDifficulty } from '~/kysely/enums'
import { z } from 'zod'
import { numberInput } from '../../../common'

export const createQuizSchema = z
  .object({
    courseId: z.string().min(1),
    from: z.object({
      part: numberInput.pipe(z.number().int().safe().finite()),
      page: numberInput.pipe(z.number().int().safe().finite()),
      hadith: numberInput.pipe(z.number().int().safe().finite()),
    }),
    to: z.object({
      part: numberInput.pipe(z.number().int().safe().finite()),
      page: numberInput.pipe(z.number().int().safe().finite()),
      hadith: numberInput.pipe(z.number().int().safe().finite()),
    }),
    repeatFromSameHadith: z.boolean(),
    difficulty: z.union([
      z.nativeEnum(QuestionDifficulty, {
        invalid_type_error: 'يجب اختيار المستوى',
      }),
      z.literal('all').transform(() => undefined),
    ]),
    questionsNumber: numberInput.pipe(
      z.number().positive().int().finite().safe().max(25),
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
    },
  )
