import { z } from 'zod'

export const markNotificationAsReadSchema = z.object({
  id: z.string(),
})
