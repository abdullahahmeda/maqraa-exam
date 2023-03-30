import { z } from 'zod'

export const newCourseSchema = z.object({
  name: z.string().trim().min(1)
})
