import { z } from 'zod'

export const reportErrorSchema = z.object({
  questionId: z.string().min(1),
  name: z.string().min(1),
  email: z.string().min(1).email(),
  description: z.string().min(1),
})
