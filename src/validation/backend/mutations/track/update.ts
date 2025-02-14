import { z } from 'zod'
import { createTrackSchema } from './create'

export const updateTrackSchema = createTrackSchema.extend({
  id: z.string().min(1),
})
export type UpdateTrackSchema = z.infer<typeof updateTrackSchema>
