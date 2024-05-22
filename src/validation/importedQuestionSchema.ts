import { z } from 'zod'
import { questionSchema } from './questionSchema'
import { QuestionType } from '~/kysely/enums'
import { enColumnToAr, enTypeToAr } from '~/utils/questions'

export const importedQuestionSchema = questionSchema
  .extend({
    questionStyles: z.record(
      z.object({
        name: z.string(),
        type: z.nativeEnum(QuestionType),
        choicesColumns: z.union([z.array(z.string()), z.literal(null)]),
      }),
    ),
  })
  .superRefine(({ questionStyles, styleName, type, answer, ...obj }, ctx) => {
    const style = questionStyles[styleName]
    if (!style)
      return ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `السؤال من نوع (${styleName}) غير موجود في قاعدة البيانات`,
      })
    if (style.type !== type)
      return ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `السؤال من نوع (${styleName}) يجب أن يكون ${enTypeToAr(
          style.type,
        )} لكنه في الإكسل (${enTypeToAr(type)})`,
      })

    if (type === 'MCQ') {
      let answerIsInChoices = false
      for (const column of style.choicesColumns!) {
        const field = obj[column as keyof typeof obj] as string
        if (field === answer) {
          if (answerIsInChoices)
            return ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'الإجابة الصحيحة موجودة في أكثر من خيار',
            })
          answerIsInChoices = true
        }
        if (field == undefined || field === '')
          return ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `الحقل (${enColumnToAr(
              column,
            )}) مطلوب لنوع السؤال ${styleName} لكن قيمته فارغة في الإكسل`,
          })
      }
      if (!answerIsInChoices)
        return ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'الإجابة الصحيحة ليست موجودة في الإختيارات',
        })
    }
  })
