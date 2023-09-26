import { z } from 'zod'

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1),
    password: z.string().min(4),
    confirmPassword: z.string().min(4),
  })
  .refine(
    (obj) => {
      return obj.password === obj.confirmPassword
    },
    {
      message: 'كلمتا المرور غير متطابقتين',
      path: ['confirmPassword']
    }
  )
