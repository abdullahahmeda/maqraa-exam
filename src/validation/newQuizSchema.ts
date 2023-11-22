import { QuestionType, QuestionDifficulty } from '~/kysely/enums'
import { z } from 'zod'

export const newQuizSchema = z.object({
  courseId: z.string().min(1),
  trackId: z.string().min(1),
  curriculumId: z.string().min(1),
  repeatFromSameHadith: z.boolean(),
  questionsNumber: z.preprocess(
    (v) => Number(v),
    z.number().positive().int().finite().safe().max(25)
  ),
  gradePerQuestion: z.preprocess(
    (v) => Number(v),
    z.number().positive().int().finite().safe().max(4)
  ),
  difficulty: z.union([
    z.nativeEnum(QuestionDifficulty, {
      invalid_type_error: 'يجب اختيار المستوى',
    }),
    z.literal('').transform(() => null),
    z.null(),
  ]),
  type: z.union([
    z.nativeEnum(QuestionType, {
      invalid_type_error: 'يجب اختيار طريقة الأسئلة',
    }),
    z.literal('').transform(() => null),
    z.null(),
  ]),
})
