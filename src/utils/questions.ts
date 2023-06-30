import {
  QuestionDifficulty as EnDifficulty,
  QuestionType as EnType,
  QuestionStyle,
  QuestionDifficulty,
} from '../constants'
import invert from 'lodash.invert'

export const typeMapping = {
  موضوعي: EnType.MCQ,
  مقالي: EnType.WRITTEN,
}

export const difficultyMapping = {
  سهل: EnDifficulty.EASY,
  متوسط: EnDifficulty.MEDIUM,
  صعب: EnDifficulty.HARD,
}

export const styleMapping = {
  'صح أو خطأ': QuestionStyle.TRUE_OR_FALSE,
  اختر: QuestionStyle.CHOOSE,
  الراوي: 'RAWI',
  أجب: 'ANSWER',
  اذكر: 'MENTION',
  أكمل: 'COMPLETE',
  عدد: 'NUMBER',
  استدل: 'EVIDENCE',
  'من القائل': 'WHO_SAID',
}

type ArType = keyof typeof typeMapping

export const arTypeToEn = (arType: string): EnType | string =>
  typeMapping[arType as ArType] ?? arType
export const enTypeToAr = (enType: string): ArType | string => {
  const inverted = invert(typeMapping)
  return inverted[enType as keyof typeof inverted] ?? enType
}

type ArDifficulty = keyof typeof difficultyMapping

export const arDifficultyToEn = (arDifficulty: string): EnDifficulty | string =>
  difficultyMapping[arDifficulty as ArDifficulty] ?? arDifficulty
export const enDifficultyToAr = (
  enDifficulty: string
): ArDifficulty | string => {
  const inverted = invert(difficultyMapping)
  return inverted[enDifficulty as keyof typeof inverted] ?? enDifficulty
}

type ArStyle = keyof typeof styleMapping

export const arStyleToEn = (arStyle: string): QuestionStyle | string =>
  styleMapping[arStyle as ArStyle] ?? arStyle
export const enStyleToAr = (enStyle: string): ArStyle | string => {
  const inverted = invert(styleMapping)
  return inverted[enStyle as keyof typeof inverted] ?? enStyle
}

export const getDifficultyVariant = (difficulty: QuestionDifficulty) => {
  switch (difficulty) {
    case QuestionDifficulty.EASY:
      return 'success'
    case QuestionDifficulty.MEDIUM:
      return 'warning'
    case QuestionDifficulty.HARD:
      return 'error'
    default:
      return undefined
  }
}
