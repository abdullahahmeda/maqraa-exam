import { UserRole } from '@prisma/client'
import { z } from 'zod'

const baseSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  email: z
    .string()
    .email()
    .min(1)
    .transform((val) => val.toLowerCase()),
  phone: z.string().nullish(),
})

const studentSchema = baseSchema.extend({
  role: z.literal(UserRole.STUDENT),
})
const adminSchema = baseSchema.extend({
  role: z.literal(UserRole.ADMIN),
})

const correctorSchema = baseSchema.extend({
  role: z.literal(UserRole.CORRECTOR),
  corrector: z.object({
    courseId: z.string().min(1),
    cycleId: z.string().min(1),
  })
})

// baseSchema is basically the studentSchema
export const updateUserSchema = z.discriminatedUnion('role', [
  adminSchema,
  correctorSchema,
  studentSchema,
])


