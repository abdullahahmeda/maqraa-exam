import { QuestionStyle, QuestionType } from '@prisma/client'
import { QuestionDifficulty } from '../constants'
import { z } from 'zod'

export const newExamSchema = z.object({
  courseId: z.string().min(1),
  trackId: z.string().min(1),
  curriculumId: z.string().min(1),
  repeatFromSameHadith: z.boolean(),
  groups: z
    .array(
      z.object({
        number: z.preprocess(
          (v) => Number(v),
          z.number().positive().int().finite()
        ),
        gradePerQuestion: z.preprocess(
          (v) => Number(v),
          z.number().positive().int().finite()
        ),
        difficulty: z.union([
          z.nativeEnum(QuestionDifficulty, {
            invalid_type_error: 'يجب اختيار المستوى',
          }),
          z.literal('').transform(() => null),
          z.null(),
        ]),
        // type: z.union([
        //   z.nativeEnum(QuestionType, {
        //     invalid_type_error: 'يجب اختيار نوع الأسئلة',
        //   }),
        //   z.literal('').transform(() => null),
        //   z.null(),
        // ]),
        styleOrType: z.union([
          z.nativeEnum(QuestionStyle, {
            invalid_type_error: 'يجب اختيار طريقة الأسئلة',
          }),
          z.nativeEnum(QuestionType, {
            invalid_type_error: 'يجب اختيار طريقة الأسئلة',
          }),
          z.literal('').transform(() => null),
          z.null(),
        ]),
      })
    )
    .superRefine((groups, ctx) => {
      let numberSum = 0
      let gradeSum = 0
      groups.forEach((group) => {
        numberSum += group.number
        gradeSum += group.number * group.gradePerQuestion
      })
      if (gradeSum > 100)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'الدرجة الكلية يجب ألا تزيد عن 100',
        })
      // TODO: get the real maxNumber from database?
      const maxNumber = 25
      if (numberSum > maxNumber)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'عدد الأسئلة أكبر من 25',
        })
    }),
})
