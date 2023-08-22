import { z } from 'zod'
import { UserRole } from '@prisma/client'

const baseSchema = z.object({
  name: z.string().min(1),
  email: z
    .string()
    .email()
    .min(1)
    .transform((val) => val.toLowerCase()),
  phone: z.string().optional(),
})

const studentSchema = baseSchema.extend({
  role: z.literal(UserRole.STUDENT),
  // student: z.object({
  //   cycles: z.array(z.string().min(1))
  // })
})
const adminSchema = baseSchema.extend({
  role: z.literal(UserRole.ADMIN),
})

const correctorSchema = baseSchema.extend({
  role: z.literal(UserRole.CORRECTOR),
  corrector: z.object({
    courseId: z.string().min(1),
    cycleId: z.string().min(1),
  }),
})

// baseSchema is basically the studentSchema
export const newUserSchema = z.discriminatedUnion('role', [
  adminSchema,
  correctorSchema,
  studentSchema,
])
