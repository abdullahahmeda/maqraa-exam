/* eslint-disable */
import { z } from 'zod'

export const ExamQuestionScalarFieldEnumSchema = z.enum([
  'id',
  'examId',
  'questionId',
  'answer',
  'isCorrect',
])
