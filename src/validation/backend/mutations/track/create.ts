import { z } from 'zod'

export const createTrackSchema = z.object({
  name: z.string().min(1),
  courseId: z.string().min(1),
})
