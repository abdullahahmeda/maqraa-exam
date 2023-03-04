import { SettingKey } from '../constants'
import { z } from 'zod'

export const updateSettingsSchema = z.object({
  [SettingKey.EASY_MCQ_QUESTIONS]: z.number().positive().int(),
  [SettingKey.EASY_WRITTEN_QUESTIONS]: z.number().positive().int(),
  [SettingKey.MEDIUM_MCQ_QUESTIONS]: z.number().positive().int(),
  [SettingKey.MEDIUM_WRITTEN_QUESTIONS]: z.number().positive().int(),
  [SettingKey.HARD_MCQ_QUESTIONS]: z.number().positive().int(),
  [SettingKey.HARD_WRITTEN_QUESTIONS]: z.number().positive().int()
})

export type ValidSchema = z.infer<typeof updateSettingsSchema>
