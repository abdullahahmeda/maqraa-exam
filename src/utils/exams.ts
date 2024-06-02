import { QuizType as EnType } from '~/kysely/enums'
import invert from 'lodash.invert'
import {
  EditExamFieldValues,
  NewExamFieldValues,
} from '~/app/dashboard/exams/_components/form-fields'

export const typeMapping = {
  'محوري 1': EnType.FIRST_MEHWARY,
  'محوري 2': EnType.SECOND_MEHWARY,
  'المنهج كامل': EnType.WHOLE_CURRICULUM,
}

type ArType = keyof typeof typeMapping
// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export const arTypeToEn = (arType: string): EnType | string =>
  typeMapping[arType as ArType] ?? arType
// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export const enTypeToAr = (enType: string): ArType | string => {
  const inverted = invert(typeMapping)
  return inverted[enType as keyof typeof inverted] ?? enType
}

export function toExamInput(input: NewExamFieldValues | EditExamFieldValues) {
  if (input.curriculumSelection === 'specific') {
    const { groups, courseId, trackId, ...data } = input
    return {
      ...data,
      questions: groups.flatMap((questions) =>
        questions.questions.map((q) => q),
      ),
    }
  }
  return input
}
