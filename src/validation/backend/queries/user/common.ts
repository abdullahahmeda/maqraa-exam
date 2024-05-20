import { z } from 'zod'
import { UserRole } from '~/kysely/enums'

export const filtersSchema = z.object({
  email: z.string().optional(),
  role: z.nativeEnum(UserRole).optional(),
  userCycle: z
    .object({
      id: z.string().optional(),
      cycleId: z.string().optional(),
      curriculumId: z.string().optional(),
    })
    .optional(),
})

export type FiltersSchema = z.infer<typeof filtersSchema>

export const includeSchema = z.object({
  cycles: z
    .boolean()
    .or(
      z.object({
        curriculum: z
          .boolean()
          .or(
            z.object({
              track: z
                .boolean()
                .or(
                  z.object({
                    course: z.boolean().optional(),
                  }),
                )
                .optional(),
            }),
          )
          .optional(),
        cycle: z.boolean().optional(),
      }),
    )
    .optional(),
})

export type IncludeSchema = z.infer<typeof includeSchema>
