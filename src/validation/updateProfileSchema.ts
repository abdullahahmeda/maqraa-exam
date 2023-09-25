import { z } from 'zod'

export const updateProfileSchema = z
  .discriminatedUnion('changePassword', [
    z.object({
      name: z.string().min(1),
      phone: z.string().nullable(),
      changePassword: z.literal(true),
      currentPassword: z.string().min(4),
      newPassword: z.string().min(4),
      confirmNewPassword: z.string().min(4),
    }),
    z.object({
      name: z.string().min(1),
      phone: z.string().nullable(),
      changePassword: z.literal(false),
    }),
  ])
  .refine(
    (obj) => {
      if (obj.changePassword) return obj.newPassword === obj.confirmNewPassword
      return true
    },
    {
      message: 'كلمتا المرور غير متطابقتين',
      path: ['confirmNewPassword'],
    }
  )
