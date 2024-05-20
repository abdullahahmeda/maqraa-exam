import { z } from 'zod'

export const submitQuizSchema = z.object({
  id: z.string().min(1),
  answers: z.record(z.string().optional()),
})
