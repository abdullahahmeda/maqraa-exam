import { z } from 'zod'

export const createCourseSchema = z.object({
  name: z.string().trim().min(1),
  note: z.string().optional()
})
export type CreateCourseSchema = z.infer<typeof createCourseSchema>
