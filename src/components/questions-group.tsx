import { Selectable } from 'kysely'
import { TrashIcon } from 'lucide-react'
import {
  FieldValues,
  Path,
  PathValue,
  UseFormReturn,
  useWatch,
} from 'react-hook-form'
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion'
import { QuestionsGroupType } from '~/kysely/enums'
import { Question } from '~/kysely/types'
import { Fields } from '~/types'
import {
  AutomaticFieldKeys,
  AutomaticQuestionsFormFields,
} from './automatic-questions-form-fields'
import { ManualQuestionsFormFields } from './manual-questions-form-fields'
import { Button } from './ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'

type FieldKeys = 'type' | 'groupQuestions' | AutomaticFieldKeys

export type Group = {
  type: string
  questions: Record<string, Selectable<Question>>
  questionsNumber: number
  gradePerQuestion: number
  difficulty: string
  styleOrType: string
}

export type FormFieldsCommonProps = {
  setGroupQuestions: (
    quetions:
      | Selectable<Question>
      | Selectable<Question>[]
      | ((
          oldGroupQuestions: Record<string, Selectable<Question>>
        ) => Selectable<Question>[] | Selectable<Question>)
  ) => unknown
  getCommonFilters: () => {}
  validateCommonFilters: () => Promise<boolean>
}

type FormFields<T extends FieldValues> = Fields<FieldKeys, T>

type Props<T extends FieldValues> = FormFieldsCommonProps & {
  form: UseFormReturn<T>
  fields: FormFields<T>
  removeGroup: () => unknown
  index: number
}

export const QuestionGroup = <T extends FieldValues>({
  form,
  fields,
  removeGroup,
  index,
  getCommonFilters,
  validateCommonFilters,
  setGroupQuestions,
}: Props<T>) => {
  const { control, setValue } = form

  const groupType = useWatch({
    control,
    name: fields.type,
  })

  const groupQuestions = useWatch({
    control,
    name: fields.groupQuestions,
  })

  const groupQuestionsCount = Object.keys(groupQuestions).length

  return (
    <AccordionItem value={'' + index}>
      <AccordionTrigger className='bg-primary px-4 text-white'>
        المجموعة {index + 1} (عدد الأسئلة: {groupQuestionsCount})
      </AccordionTrigger>
      <AccordionContent className='p-4'>
        <div className='mb-4 flex justify-end'>
          <Button
            type='button'
            size='icon'
            variant='destructive'
            onClick={removeGroup}
          >
            <TrashIcon className='h-4 w-4' />
          </Button>
        </div>
        <Tabs
          value={groupType}
          onValueChange={(value: string) => {
            setValue(fields.type, value as PathValue<T, Path<T>>)
          }}
        >
          <div className='mx-4'>
            <TabsList className='mb-4 grid grid-cols-2'>
              <TabsTrigger value={QuestionsGroupType.AUTOMATIC}>
                تلقائي
              </TabsTrigger>
              <TabsTrigger value={QuestionsGroupType.MANUAL}>يدوي</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value={QuestionsGroupType.AUTOMATIC}>
            <AutomaticQuestionsFormFields
              form={form}
              fields={{
                questionsNumber: fields.questionsNumber,
                gradePerQuestion: fields.gradePerQuestion,
                difficulty: fields.difficulty,
                styleOrType: fields.styleOrType,
              }}
              validateCommonFilters={validateCommonFilters}
              setGroupQuestions={setGroupQuestions}
              getCommonFilters={getCommonFilters}
            />
          </TabsContent>
          <TabsContent value={QuestionsGroupType.MANUAL}>
            <ManualQuestionsFormFields
              groupQuestions={groupQuestions}
              validateCommonFilters={validateCommonFilters}
              setGroupQuestions={setGroupQuestions}
              getCommonFilters={getCommonFilters}
            />
          </TabsContent>
        </Tabs>
      </AccordionContent>
    </AccordionItem>
  )
}
