import { SettingKey, UserRole } from '~/kysely/enums'
import { z } from 'zod'

export const updateSettingsSchema = z.object({
  [SettingKey.SITE_NAME]: z.string().min(1),
  menuItems: z.record(
    z.nativeEnum(UserRole),
    z.array(
      z.object({
        label: z.string().min(1),
        icon: z.string().nullable(),
        key: z.string().min(1),
      })
    )
  ),
})
