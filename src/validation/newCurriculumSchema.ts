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
          mid: z.preprocess(
            (v) => Number(v),
            z.number().nonnegative().int().finite()
          ),
        })
        .superRefine(({ from, to, mid }, ctx) => {
          if (from > to)
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ['from'],
              message: 'هذا النطاق غير صحيح',
            })

          if (mid !== 0 && !(from <= mid && mid <= to))
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ['mid'],
              message: 'حقل نصف المنهج يجب أن يكون في نطاق الأحاديث المختارة',
            })
        })
    )
    .min(1),
})
