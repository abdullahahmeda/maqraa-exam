import { z } from 'zod'

export const reportErrorSchema = z.object({
  modelQuestionId: z.string().min(1),
  name: z.string().min(1),
  email: z.string().min(1).email(),
  note: z.string().min(1),
})
