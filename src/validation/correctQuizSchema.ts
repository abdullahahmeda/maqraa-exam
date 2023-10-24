import { z } from 'zod'

export const correctQuizSchema = z.object({
  id: z.string().min(1),
  questions: z.record(
    z.preprocess((v) => parseInt(v as string), z.number().int().finite())
  ),
})
