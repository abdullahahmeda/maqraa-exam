import { z } from 'zod'
import { UserRole } from '@prisma/client'

const baseSchema = z.object({
  name: z.string().min(1),
  email: z
    .string()
    .email()
    .min(1)
    .transform((val) => val.toLowerCase()),
  password: z.string().min(4),
  phone: z.string().optional(),
})

const studentSchema = baseSchema.extend({
  role: z.literal(UserRole.STUDENT),
  student: z.object({
    cycles: z
      .record(
        z.object({
          courseId: z.string().min(1),
          trackId: z.string().min(1),
          curriculumId: z.string().min(1),
        })
      )
      .refine((cycles) => Object.keys(cycles).length > 0, {
        message: 'يجب أن ينضم الطالب لدورة واحدة على الأقل',
      }),
  }),
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
