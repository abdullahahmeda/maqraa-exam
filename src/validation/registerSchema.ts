import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().trim().email().min(1).toLowerCase(),
})
