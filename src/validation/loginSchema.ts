import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .email()
    .transform((val) => val.toLowerCase()),
  password: z.string().min(4),
})
