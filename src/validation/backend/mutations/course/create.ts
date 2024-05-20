import { z } from 'zod'

export const createCourseSchema = z.object({
  name: z.string().trim().min(1),
})
