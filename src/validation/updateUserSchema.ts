import { z } from 'zod'
import { UserRole } from '~/constants'

export const updateUserSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email().min(1),
  role: z.nativeEnum(UserRole)
})
