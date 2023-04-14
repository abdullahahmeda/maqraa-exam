import { z } from 'zod'
import { UserRole } from '~/constants'
import { arUserRoleToEn } from '~/utils/users'

export const userSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().min(1),
  role: z
    .union([z.literal('أدمن'), z.literal('طالب')])
    .transform(val => arUserRoleToEn(val))
})
