import { QuizType, QuestionsGroupType } from '~/kysely/enums'
import { z } from 'zod'
import { groupSchema } from './newQuizSchema'

const questionSchema = z.object({
  id: z.string().min(1),
  weight: z.number().int().safe().finite().min(1),
})

export const newSystemExamSchema = z.object({
  name: z.string().min(1),
  type: z.nativeEnum(QuizType),
  endsAt: z.date().nullish(),
  courseId: z.string().min(1),
  trackId: z.string().min(1),
  curriculumId: z.string().min(1),
  cycleId: z.string().min(1),
  repeatFromSameHadith: z.boolean(),
  groups: z
    .array(
      z.discriminatedUnion('type', [
        groupSchema.extend({
          type: z.literal(QuestionsGroupType.AUTOMATIC),
          questions: z.array(questionSchema).min(1),
        }),
        z.object({
          type: z.literal(QuestionsGroupType.MANUAL),
          questions: z
            .record(questionSchema, {
              invalid_type_error: 'يجب أن يكون هناك سؤال واحد على الأقل',
              required_error: 'يجب أن يكون هناك سؤال واحد على الأقل',
            })
            .refine((obj) => Object.keys({ ...obj }).length > 0, {
              message: 'يجب أن يكون هناك سؤال واحد على الأقل',
            }),
        }),
      ])
    )
    .superRefine((groups, ctx) => {
      // let numberSum = 0
      let gradeSum = 0
      groups.forEach((group) => {
        // numberSum += group.questionsNumber
        if (group.type === 'AUTOMATIC')
          gradeSum += group.questionsNumber * group.gradePerQuestion
        else
          gradeSum += Object.values(group.questions).reduce(
            (acc, q) => acc + q.weight,
            0
          )
      })
      if (gradeSum > 100)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'الدرجة الكلية يجب ألا تزيد عن 100',
        })
    }),
})
