import { z } from 'zod'
import { spreadsheetUrlSchema } from '~/validation/common'

export const importUsersSchema = z.object({
  url: spreadsheetUrlSchema,
  sheetName: z.string().min(1),
  cycleId: z.string().min(1),
})
