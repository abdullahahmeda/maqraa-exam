import { z } from 'zod'

export const createCourseSchema = z.object({
  name: z.string().trim().min(1),
  note: z.string().nullish()
})
export type CreateCourseSchema = z.infer<typeof createCourseSchema>
