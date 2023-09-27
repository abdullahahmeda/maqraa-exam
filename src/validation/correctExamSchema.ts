import { z } from 'zod'

export const correctExamSchema = z.object({
  id: z.string().min(1),
  groups: z.record(
    z.object({
      questions: z.record(
        z.preprocess((v) => parseInt(v as string), z.number().int().finite())
      ),
    })
  ),
})
