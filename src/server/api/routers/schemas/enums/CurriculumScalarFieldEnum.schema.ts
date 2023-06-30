/* eslint-disable */
import { z } from 'zod'

export const CurriculumScalarFieldEnumSchema = z.enum([
  'id',
  'name',
  'courseId',
  'fromPage',
  'toPage',
])
