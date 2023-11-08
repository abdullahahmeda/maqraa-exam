import { z } from 'zod'
import { QuestionStyle, QuestionType } from '~/kysely/enums'
import {
  arDifficultyToEn,
  arStyleToEn,
  arTypeToEn,
  difficultyMapping,
  styleMapping,
  typeMapping,
} from '../utils/questions'

export const questionSchema = z
  .object({
    number: z.preprocess((v) => Number(v), z.number().positive().int()),
    pageNumber: z.preprocess((v) => Number(v), z.number().positive().int()),
    partNumber: z.preprocess((v) => Number(v), z.number().positive().int()),
    hadithNumber: z.preprocess((v) => Number(v), z.number().positive().int()),
    type: z.preprocess(
      (v) => (v as string).trim(),
      z
        // @ts-ignore
        .union(Object.keys(typeMapping).map((s) => z.literal(s)))
        .transform((val) => arTypeToEn(val))
    ),
    style: z.preprocess(
      (v) => (v as string).trim(),
      z
        // @ts-ignore
        .union(Object.keys(styleMapping).map((s) => z.literal(s)))
        .transform((val) => arStyleToEn(val))
    ),
    difficulty: z.preprocess(
      (v) => (v as string).trim(),
      z
        // @ts-ignore
        .union(Object.keys(difficultyMapping).map((s) => z.literal(s)))
        .transform((val) => arDifficultyToEn(val))
    ),
    text: z
      .string()
      .min(1)
      .transform((str) => str.trim()),
    textForTrue: z.string().transform((str) => str.trim()),
    textForFalse: z.string().transform((str) => str.trim()),
    option1: z.string().transform((str) => str.trim()),
    option2: z.string().transform((str) => str.trim()),
    option3: z.string().transform((str) => str.trim()),
    option4: z.string().transform((str) => str.trim()),
    answer: z.string().transform((str) => str.trim()),
    anotherAnswer: z.string().min(1),
    // anotherAnswer: z
    //   .union([z.literal('لا'), z.string().min(1)])
    //   .transform((v) => (v === 'لا' ? null : v)),
    isInsideShaded: z
      .union([z.literal('نعم'), z.literal('لا')])
      .transform((v) => (v === 'نعم' ? true : false)),
    objective: z.string().transform((str) => str.trim()),
    courseId: z.string().min(1),
  })
  .refine(
    (data) => {
      if (data.type === QuestionType.MCQ) {
        if (!Object.values(QuestionStyle).includes(data.style as QuestionStyle))
          return false
      }
      return true
    },
    (val) => ({
      message: `أسلوب السؤال يجب أن يكون واحداً من ${JSON.stringify(
        Object.keys(styleMapping)
      )}`,
      path: ['style'],
    })
  )
