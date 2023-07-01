import { z } from 'zod'

export const newCurriculumSchema = z
  .object({
    trackId: z.string().min(1),
    name: z.string().min(1),
    fromPage: z.preprocess((v) => Number(v), z.number().positive().int()),
    toPage: z.preprocess((v) => Number(v), z.number().positive().int()),
  })
  .refine(({ fromPage, toPage }) => toPage >= fromPage, {
    message: 'هذا النطاق غير صحيح',
    path: ['fromPage'],
  })
