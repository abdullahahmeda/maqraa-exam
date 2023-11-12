import {
  QuestionDifficulty as EnDifficulty,
  QuestionType as EnType,
} from '~/kysely/enums'
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

export const columnMapping = {
  'خيار 1': 'option1',
  'خيار 2': 'option2',
  'خيار 3': 'option3',
  'خيار 4': 'option4',
  صح: 'textForTrue',
  خطأ: 'textForFalse',
}

// export const styleMapping = {
//   'صح أو خطأ': QuestionStyle.TRUE_OR_FALSE,
//   اختر: QuestionStyle.CHOOSE,
//   الراوي: QuestionStyle.RAWI,
//   أجب: QuestionStyle.ANSWER,
//   اذكر: QuestionStyle.MENTION,
//   أكمل: QuestionStyle.COMPLETE,
//   عدد: QuestionStyle.NUMBER,
//   استدل: QuestionStyle.EVIDENCE,
//   'من القائل': QuestionStyle.WHO_SAID,
// }
export const styleMapping = { a: 'test' }

type ArType = keyof typeof typeMapping

export const arTypeToEn = (arType: string): EnType =>
  typeMapping[arType as ArType]
export const enTypeToAr = (enType: string): ArType => {
  const inverted = invert(typeMapping)
  // @ts-ignore
  return inverted[enType as keyof typeof inverted]
}

type ArColumn = keyof typeof columnMapping

export function enColumnToAr(enColumn: string): ArColumn {
  const inverted = invert(columnMapping)
  // @ts-ignore
  return inverted[enColumn as keyof typeof inverted]
}

type ArDifficulty = keyof typeof difficultyMapping

export const arDifficultyToEn = (arDifficulty: string): EnDifficulty =>
  difficultyMapping[arDifficulty as ArDifficulty]
export const enDifficultyToAr = (enDifficulty: string): ArDifficulty => {
  const inverted = invert(difficultyMapping)
  // @ts-ignore
  return inverted[enDifficulty as keyof typeof inverted]
}

export const getDifficultyVariant = (difficulty: EnDifficulty) => {
  switch (difficulty) {
    case EnDifficulty.EASY:
      return 'success'
    case EnDifficulty.MEDIUM:
      return 'warning'
    case EnDifficulty.HARD:
      return 'error'
    default:
      return undefined
  }
}
