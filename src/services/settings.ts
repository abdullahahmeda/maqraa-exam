import { Setting } from '@prisma/client'
import { SettingKey } from '../constants'
import { prisma } from '../server/db'
import { ValidSchema } from '../validation/updateSettingsSchema'

export const getSettings = (): Promise<Setting[]> => {
  return prisma.setting.findMany()
}

export const updateSettings = (settings: ValidSchema) => {
  const settingsArr = Object.entries(settings).map(([key, value]) => ({
    key: key as SettingKey,
    value: '' + value
  }))
  prisma.$transaction([
    prisma.setting.deleteMany(),
    prisma.setting.createMany({ data: settingsArr })
  ])
}
