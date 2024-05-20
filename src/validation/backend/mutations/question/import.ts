import { z } from 'zod'
import { spreadsheetUrlSchema } from '~/validation/common'

export const importQuestionsSchema = z.object({
  url: spreadsheetUrlSchema,
  sheetName: z.string().min(1),
  courseId: z.string().min(1),
})
