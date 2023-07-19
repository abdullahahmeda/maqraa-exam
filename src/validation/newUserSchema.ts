import { z } from 'zod'
import { UserRole } from '@prisma/client'

export const newUserSchema = z.object({
  name: z.string().min(1),
  email: z
    .string()
    .email()
    .min(1)
    .transform((val) => val.toLowerCase()),
  role: z.nativeEnum(UserRole),
})
