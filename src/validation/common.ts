import { z } from 'zod'
import { SPREADSHEET_URL_REGEX } from '~/constants'
import { arabicNumeralsToEnglish } from '~/utils/arabicNumeralsToEnglish'

export const numberInput = z
  .string()
  .trim()
  .min(1)
  .transform((v) => arabicNumeralsToEnglish(v))
  .pipe(z.coerce.number())
  .or(z.number())

export const spreadsheetUrlSchema = z
  .string()
  .url('رابط غير صالح')
  .regex(SPREADSHEET_URL_REGEX, 'هذا الرابط ليس جوجل شيت')
