import { z } from 'zod'

export const studentSchema = z.object({
  email: z.string().email()
})
