import { z } from 'zod'

export const newTrackSchema = z.object({
  name: z.string().min(1),
  courseId: z.string().min(1),
})
