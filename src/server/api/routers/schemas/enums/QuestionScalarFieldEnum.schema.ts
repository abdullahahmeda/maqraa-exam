/* eslint-disable */
import { z } from 'zod'

export const QuestionScalarFieldEnumSchema = z.enum([
  'id',
  'number',
  'pageNumber',
  'partNumber',
  'hadithNumber',
  'text',
  'type',
  'style',
  'difficulty',
  'option1',
  'option2',
  'option3',
  'option4',
  'textForTrue',
  'textForFalse',
  'answer',
  'courseId',
])
