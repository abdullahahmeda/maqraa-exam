import { z } from 'zod'
import { arabicNumeralsToEnglish } from '~/utils/arabicNumeralsToEnglish'

export const numberInput = z
  .string()
  .trim()
  .min(1)
  .transform((v) => arabicNumeralsToEnglish(v))
  .pipe(z.coerce.number())
  .or(z.number())
