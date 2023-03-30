import { z } from 'zod'

export const newCurriculumSchema = z.object({
  course: z.number().positive().int(),
  name: z.string().trim().min(1),
  pages: z
    .object({
      from: z.number().positive().int(),
      to: z.number().positive().int()
    })
    .refine(
      ({ from, to }) => {
        return to >= from
      },
      {
        message: 'هذا النطاق غير صحيح'
      }
    )
})
