import { z } from 'zod'

export const newCurriculumSchema = z.object({
  trackId: z.string().min(1),
  name: z.string().min(1),
  parts: z
    .array(
      z
        .object({
          name: z.string().min(1),
          number: z.preprocess(
            (v) => Number(v),
            z.number().positive().int().finite()
          ),
          from: z.preprocess(
            (v) => Number(v),
            z.number().positive().int().finite()
          ),
          to: z.preprocess(
            (v) => Number(v),
            z.number().positive().int().finite()
          ),
        })
        .refine(({ from, to }) => to >= from, {
          message: 'هذا النطاق غير صحيح',
          path: ['from'],
        })
    )
    .min(1),
})
