import { QuizType as EnType } from '@prisma/client'
import invert from 'lodash.invert'

export const typeMapping = {
  'محوري 1': EnType.FIRST_MEHWARY,
  'محوري 2': EnType.SECOND_MEHWARY,
  'المنهج كامل': EnType.WHOLE_CURRICULUM,
}

type ArType = keyof typeof typeMapping
export const arTypeToEn = (arType: string): EnType | string =>
  typeMapping[arType as ArType] ?? arType
export const enTypeToAr = (enType: string): ArType | string => {
  const inverted = invert(typeMapping)
  return inverted[enType as keyof typeof inverted] ?? enType
}
