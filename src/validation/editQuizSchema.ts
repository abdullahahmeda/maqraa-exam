import { z } from 'zod'

export const editQuizSchema = z.object({
  id: z.string().min(1),
  endsAt: z.date().nullish().default(null),
})
