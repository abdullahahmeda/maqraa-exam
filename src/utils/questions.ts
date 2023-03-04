import {
  QuestionDifficulty as EnDifficulty,
  QuestionType as EnType,
  QuestionStyle
} from '../constants'
import invert from 'lodash.invert'

const typeMapping = {
  موضوعي: EnType.MCQ,
  مقالي: EnType.WRITTEN
}

const difficultyMapping = {
  سهل: EnDifficulty.EASY,
  متوسط: EnDifficulty.MEDIUM,
  صعب: EnDifficulty.HARD
}

const styleMapping = {
  'صح أو خطأ': QuestionStyle.TRUE_OR_FALSE,
  اختر: QuestionStyle.CHOOSE
}

type ArType = keyof typeof typeMapping

export const arTypeToEn = (arType: ArType) => typeMapping[arType]
export const enTypeToAr = (enType: EnType) => {
  const inverted = invert(typeMapping)
  return inverted[enType as keyof typeof inverted]
}

type ArDifficulty = keyof typeof difficultyMapping

export const arDifficultyToEn = (arDifficulty: ArDifficulty) =>
  difficultyMapping[arDifficulty]
export const enDifficultyToAr = (enDifficulty: EnDifficulty) => {
  const inverted = invert(difficultyMapping)
  return inverted[enDifficulty as keyof typeof inverted]
}

type ArStyle = keyof typeof styleMapping

export const arStyleToEn = (arStyle: string): QuestionStyle | string =>
  styleMapping[arStyle as ArStyle] ?? arStyle
export const enStyleToAr = (enStyle: string): ArStyle | string => {
  const inverted = invert(styleMapping)
  return inverted[enStyle as keyof typeof inverted] ?? enStyle
}
