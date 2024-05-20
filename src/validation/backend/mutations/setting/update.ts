import { SettingKey } from '~/kysely/enums'
import { z } from 'zod'

export const updateSettingsSchema = z.object({
  [SettingKey.SITE_NAME]: z.string().min(1),
})
