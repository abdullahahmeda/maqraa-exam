/* eslint-disable */
import { z } from 'zod'

export const ExamScalarFieldEnumSchema = z.enum([
  'id',
  'difficulty',
  'userId',
  'grade',
  'submittedAt',
  'createdAt',
  'courseId',
  'curriculumId',
])
