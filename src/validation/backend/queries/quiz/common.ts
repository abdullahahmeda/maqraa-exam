import { z } from 'zod'

export const filtersSchema = z.object({
  systemExamId: z.string().nullable().optional(),
  examinee: z
    .object({
      name: z.string().optional(),
    })
    .optional(),
})
export type FiltersSchema = z.infer<typeof filtersSchema>

export const includeSchema = z.record(
  z.union([
    z.literal('examinee'),
    z.literal('curriculum'),
    z.literal('corrector'),
    z.literal('systemExam'),
  ]),
  z.boolean().optional(),
)
export type IncludeSchema = z.infer<typeof includeSchema>
