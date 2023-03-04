import { z } from 'zod'
import { QuestionStyle, QuestionType } from '../constants'
import { arDifficultyToEn, arStyleToEn, arTypeToEn } from '../utils/questions'

export const questionSchema = z
  .object({
    number: z.number().positive().int(),
    pageNumber: z.number().positive().int(),
    partNumber: z.number().positive().int(),
    hadithNumber: z.number().positive().int(),
    type: z
      .union([z.literal('مقالي'), z.literal('موضوعي')])
      .transform(val => arTypeToEn(val)),
    style: z.string().transform(val => arStyleToEn(val)),
    difficulty: z
      .union([z.literal('سهل'), z.literal('متوسط'), z.literal('صعب')])
      .transform(val => arDifficultyToEn(val)),
    text: z.string().min(1),
    trueText: z.string(),
    falseText: z.string(),
    option1: z.string(),
    option2: z.string(),
    option3: z.string(),
    option4: z.string(),
    answer: z.string()
  })
  .refine(
    data => {
      if (data.type === QuestionType.MCQ) {
        if (
          !Object.values(QuestionStyle).includes(data.style as QuestionStyle)
        ) {
          return false
        }
      }
      return true
    },
    val => ({
      message: 'أسلوب السؤال يجب أن يكون صح و خطأ أو اختر',
      path: ['style']
    })
  )
