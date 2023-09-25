import { SettingKey } from '../constants'
import invert from 'lodash.invert'

const settingMapping = {
  'عدد الأسئلة الموضوعية للمستوى السهل': SettingKey.EASY_MCQ_QUESTIONS,
  'عدد الأسئلة المقالية للمستوى السهل': SettingKey.EASY_WRITTEN_QUESTIONS,
  'عدد الأسئلة الموضوعية للمستوى المتوسط': SettingKey.MEDIUM_MCQ_QUESTIONS,
  'عدد الأسئلة المقالية للمستوى المتوسط': SettingKey.MEDIUM_WRITTEN_QUESTIONS,
  'عدد الأسئلة الموضوعية للمستوى الصعب': SettingKey.HARD_MCQ_QUESTIONS,
  'عدد الأسئلة المقالية للمستوى الصعب': SettingKey.HARD_WRITTEN_QUESTIONS
}

type ArSetting = keyof typeof settingMapping

export const arSettingToEn = (arSetting: ArSetting) => settingMapping[arSetting]
export const enSettingToAr = (enSetting: SettingKey) => {
  const inverted = invert(settingMapping)
  return inverted[enSetting as keyof typeof inverted]
}
