import { QuestionDifficulty } from '../constants'
import { z } from 'zod'

export const newExamSchema = z.object({
  difficulty: z.nativeEnum(QuestionDifficulty, {
    invalid_type_error: 'يجب اختيار المستوى'
  }),
  course: z
    .number({
      invalid_type_error: 'يجب اختيار مقرر',
      required_error: 'يجب اختيار مقرر'
    })
    .positive()
    .int(),
  curriculum: z
    .number({
      invalid_type_error: 'يجب اختيار منهج',
      required_error: 'يجب اختيار منهج'
    })
    .positive()
    .int()
})
