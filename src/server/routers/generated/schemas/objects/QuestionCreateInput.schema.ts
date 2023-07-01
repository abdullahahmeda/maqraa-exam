/* eslint-disable */
import { z } from 'zod'
import { CourseCreateNestedOneWithoutQuestionsInputObjectSchema } from './CourseCreateNestedOneWithoutQuestionsInput.schema'
import { ExamQuestionCreateNestedManyWithoutQuestionInputObjectSchema } from './ExamQuestionCreateNestedManyWithoutQuestionInput.schema'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<
  Omit<Prisma.QuestionCreateInput, 'zenstack_transaction' | 'zenstack_guard'>
> = z
  .object({
    id: z.string().optional(),
    number: z.number(),
    pageNumber: z.number(),
    partNumber: z.number(),
    hadithNumber: z.number(),
    text: z.string(),
    type: z.string(),
    style: z.string(),
    difficulty: z.string(),
    option1: z.string().optional().nullable(),
    option2: z.string().optional().nullable(),
    option3: z.string().optional().nullable(),
    option4: z.string().optional().nullable(),
    textForTrue: z.string().optional().nullable(),
    textForFalse: z.string().optional().nullable(),
    answer: z.string(),
    course: z.lazy(
      () => CourseCreateNestedOneWithoutQuestionsInputObjectSchema
    ),
    exams: z
      .lazy(() => ExamQuestionCreateNestedManyWithoutQuestionInputObjectSchema)
      .optional(),
  })
  .strict()

export const QuestionCreateInputObjectSchema = Schema
