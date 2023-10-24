import { z } from 'zod'

export const submitExamSchema = z.object({
  id: z.string().min(1),
  questions: z.record(z.string().optional()),
})
