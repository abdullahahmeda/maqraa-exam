import { z } from 'zod'
import { SPREADSHEET_URL_REGEX } from '../constants'

export const spreadsheetUrlSchema = z
  .string()
  .url('رابط غير صالح')
  .regex(SPREADSHEET_URL_REGEX, 'هذا الرابط ليس جوجل شيت')

export const importUsersSchema = z.object({
  url: spreadsheetUrlSchema,
  sheet: z.string().min(1)
})
