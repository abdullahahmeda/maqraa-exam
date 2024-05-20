import { z } from 'zod'

export const getCourseSchema = z.object({
  id: z.string(),
})
