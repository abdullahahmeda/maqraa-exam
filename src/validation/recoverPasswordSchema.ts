import { z } from 'zod'

export const recoverPasswordSchema = z.object({
  email: z.string().email()
})

