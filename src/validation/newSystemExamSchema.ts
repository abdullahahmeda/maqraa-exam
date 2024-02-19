import { QuizType, QuestionsGroupType } from '~/kysely/enums'
import { z } from 'zod'
import { numberInput } from './common'

const questionSchema = z.object({
  id: z.string(),
  grade: numberInput.pipe(z.number().int().safe().positive()),
})

const groupSchema = z.object({
  type: z.nativeEnum(QuestionsGroupType),
  questions: z.record(z.string(), z.object({ id: z.string() })),
})

export const newSystemExamSchema = z.object({
  name: z.string().min(1),
  type: z.nativeEnum(QuizType),
  isInsideShaded: z
    .boolean()
    .or(z.literal('INSIDE').transform(() => true))
    .or(z.literal('OUTSIDE').transform(() => false))
    .or(z.literal('').transform(() => undefined))
    .optional(),
  endsAt: z.date().nullish(),
  courseId: z.string(),
  trackId: z.string(),
  curriculumId: z.string(),
  cycleId: z.string(),
  repeatFromSameHadith: z.boolean(),
  groups: z
    .array(groupSchema)
    .min(1)
    .refine(
      (groups) =>
        groups.every((group) => {
          const questionsCount = Object.keys(group.questions).length
          return questionsCount > 0
        }),
      {
        message: 'هنلك مجموعات لا تحتوي على أي أسئلة',
      }
    ),
  questions: z.array(z.record(z.string(), questionSchema)).min(1),
})

//
//
//
//
// const groupSchema = z.object({
//   questionsNumber: numberInput.pipe(
//     z.number().positive().int().finite().safe()
//   ),
//   gradePerQuestion: numberInput.pipe(
//     z.number().positive().int().finite().safe()
//   ),
//   difficulty: z.union([
//     z.nativeEnum(QuestionDifficulty, {
//       invalid_type_error: 'يجب اختيار المستوى',
//     }),
//     z.literal('').transform(() => null),
//     z.null(),
//   ]),
//   styleOrType: z.union([
//     z.nativeEnum(QuestionType, {
//       invalid_type_error: 'يجب اختيار طريقة الأسئلة',
//     }),
//     z.string().min(1),
//     z.literal('').transform(() => null),
//     z.null(),
//   ]),
// })
//
// const questionSchema = z.object({
//   id: z.string().min(1),
//   weight: numberInput.pipe(z.number().int().safe().finite().min(1)),
// })
//
// export const newSystemExamSchema = z.object({
//   name: z.string().min(1),
//   type: z.nativeEnum(QuizType),
//   isInsideShaded: z
//     .boolean()
//     .or(z.literal('INSIDE').transform(() => true))
//     .or(z.literal('OUTSIDE').transform(() => false))
//     .or(z.literal('')),
//   endsAt: z.date().nullish(),
//   courseId: z.string().min(1),
//   trackId: z.string().min(1),
//   curriculumId: z.string().min(1),
//   cycleId: z.string().min(1),
//   repeatFromSameHadith: z.boolean(),
//   groups: z
//     .array(
//       z.discriminatedUnion('type', [
//         groupSchema.extend({
//           type: z.literal(QuestionsGroupType.AUTOMATIC),
//           questions: z.array(questionSchema).min(1),
//         }),
//         z.object({
//           type: z.literal(QuestionsGroupType.MANUAL),
//           questions: z
//             .record(questionSchema, {
//               invalid_type_error: 'يجب أن يكون هناك سؤال واحد على الأقل',
//               required_error: 'يجب أن يكون هناك سؤال واحد على الأقل',
//             })
//             .refine((obj) => Object.keys({ ...obj }).length > 0, {
//               message: 'يجب أن يكون هناك سؤال واحد على الأقل',
//             }),
//         }),
//       ])
//     )
//     .superRefine((groups, ctx) => {
//       let gradeSum = 0
//       groups.forEach((group) => {
//         if (group.type === 'AUTOMATIC')
//           gradeSum += group.questionsNumber * group.gradePerQuestion
//         else
//           gradeSum += Object.values(group.questions).reduce(
//             (acc, q) => acc + q.weight,
//             0
//           )
//       })
//       if (gradeSum > 100)
//         ctx.addIssue({
//           code: z.ZodIssueCode.custom,
//           message: 'الدرجة الكلية يجب ألا تزيد عن 100',
//         })
//     }),
// })
