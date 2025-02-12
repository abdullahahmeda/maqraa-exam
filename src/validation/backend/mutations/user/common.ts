import { z } from 'zod'
import { UserRole } from '~/kysely/enums'

export const baseSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().toLowerCase().min(1),
  password: z.string().min(4).optional(),
  phone: z.string().nullish(),
})

export function generateSchema<T extends z.ZodRawShape>(base: z.ZodObject<T>) {
  const studentSchema = base.extend({
    role: z.literal(UserRole.STUDENT),
    student: z
      .object({
        cycles: z
          .array(z.object({ value: z.string() }))
          .min(1, 'يجب أن ينضم الطالب لدورة واحدة على الأقل'),
        curricula: z.record(
          z.object({
            courseId: z.string().min(1),
            trackId: z.string().min(1),
            curriculumId: z.string().min(1),
          }),
        ),
      })
      .refine(
        ({ curricula, cycles }) => {
          return Object.keys(curricula).every((cycleId) =>
            cycles.some((c) => c.value === cycleId),
          )
        },
        { message: 'هناك خطأ في البيانات' },
      ),
  })
  const adminSchema = base.extend({
    role: z.literal(UserRole.ADMIN),
  })

  const superAdminSchema = base.extend({
    role: z.literal(UserRole.SUPER_ADMIN),
  })

  const correctorSchema = base.extend({
    role: z.literal(UserRole.CORRECTOR),
    corrector: z
      .object({
        cycles: z
          .array(z.object({ value: z.string() }))
          .min(1, 'يجب أن ينضم المصحح لدورة واحدة على الأقل'),
        curricula: z.record(z.array(z.object({ value: z.string() }))),
      })
      .refine(
        ({ curricula, cycles }) => {
          return Object.keys(curricula).every((cycleId) =>
            cycles.some((c) => c.value === cycleId),
          )
        },
        { message: 'هناك خطأ في البيانات' },
      ),
  })

  return z.discriminatedUnion('role', [
    superAdminSchema,
    adminSchema,
    correctorSchema,
    studentSchema,
  ])
}
