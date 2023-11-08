import { QuestionStyle, QuestionType, QuestionDifficulty } from '~/kysely/enums'
import { z } from 'zod'

export const groupSchema = z.object({
  questionsNumber: z.preprocess(
    (v) => Number(v),
    z.number().positive().int().finite().safe()
  ),
  gradePerQuestion: z.preprocess(
    (v) => Number(v),
    z.number().positive().int().finite().safe()
  ),
  difficulty: z.union([
    z.nativeEnum(QuestionDifficulty, {
      invalid_type_error: 'يجب اختيار المستوى',
    }),
    z.literal('').transform(() => null),
    z.null(),
  ]),
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

export type QuizGroupSchema = z.infer<typeof groupSchema>

const groupsSchema = z.array(groupSchema).superRefine((groups, ctx) => {
  let totalQuestions = 0
  let totalGrade = 0
  groups.forEach((group) => {
    totalQuestions += group.questionsNumber
    totalGrade += group.questionsNumber * group.gradePerQuestion
  })
  const MAX_GRADE = 100
  if (totalGrade > MAX_GRADE)
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'الدرجة الكلية يجب ألا تزيد عن 100',
    })
  // TODO: get the real maxNumber from database?
  const MAX_QUESTIONS = 25
  if (totalQuestions > MAX_QUESTIONS)
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'عدد الأسئلة يجب ألا يزيد عن 25',
    })
})

export const newQuizSchema = z.object({
  courseId: z.string().min(1),
  trackId: z.string().min(1),
  curriculumId: z.string().min(1),
  repeatFromSameHadith: z.boolean(),
  groups: groupsSchema,
})
