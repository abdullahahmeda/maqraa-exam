import { FieldValues, UseFormReturn } from 'react-hook-form'
import { Fields } from '~/types'
import { difficultyMapping, typeMapping } from '~/utils/questions'
import { Button } from './ui/button'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form'
import { Input } from './ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { api } from '~/trpc/react'
import { toast } from 'sonner'
import { FormFieldsCommonProps } from './questions-group'
import { useState } from 'react'
import { RefreshCwIcon } from 'lucide-react'
import { cn } from '~/lib/utils'

export type AutomaticFieldKeys =
  | 'questionsNumber'
  | 'gradePerQuestion'
  | 'difficulty'
  | 'styleOrType'

type FieldKeys = AutomaticFieldKeys

type FormFields<T extends FieldValues> = Fields<FieldKeys, T>

type Props<T extends FieldValues> = FormFieldsCommonProps & {
  form: UseFormReturn<T>
  fields: FormFields<T>
}

export const AutomaticQuestionsFormFields = <T extends FieldValues>({
  form,
  fields,
  setGroupQuestions,
  getCommonFilters,
  validateCommonFilters,
}: Props<T>) => {
  const { getValues, trigger } = form
  const [isLoading, setIsLoading] = useState(false)
  const utils = api.useUtils()

  const validateDataForFetching = async () => {
    return (
      (await validateCommonFilters()) &&
      (await trigger([
        fields.questionsNumber,
        fields.styleOrType,
        fields.difficulty,
        fields.gradePerQuestion,
      ]))
    )
  }

  const generateRandomQuestions = async () => {
    // trigger validation for required fields
    const isValidData = await validateDataForFetching()
    if (!isValidData) return

    const gradePerQuestion = getValues(fields.gradePerQuestion)

    setIsLoading(true)

    utils.question.listRandom
      .fetch({
        limit: getValues(fields.questionsNumber),
        filters: {
          ...getCommonFilters(),
          difficulty: getValues(fields.difficulty),
          type: getValues(fields.styleOrType),
        },
        include: { style: true },
      })
      .then((data) => {
        setGroupQuestions(
          data.map((q) => ({ ...q, grade: Number(gradePerQuestion) })),
          // data.reduce((acc, q) => ({ ...acc, [q.id]: gradePerQuestion }), {})
        )
      })
      .catch((error) => {
        toast.error(error.message)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <div>
      <div className='grid grid-cols-2 gap-4'>
        <FormField
          control={form.control}
          name={fields.questionsNumber}
          render={({ field }) => (
            <FormItem className='flex-grow'>
              <FormLabel>عدد الأسئلة</FormLabel>
              <FormControl>
                <Input type='number' min={1} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={fields.gradePerQuestion}
          render={({ field }) => (
            <FormItem className='flex-grow'>
              <FormLabel>الدرجة للسؤال</FormLabel>
              <FormControl>
                <Input type='number' min={1} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={fields.difficulty}
          render={({ field }) => (
            <FormItem>
              <FormLabel>المستوى</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='اختر المستوى' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value=''>كل المستويات</SelectItem>
                  {Object.entries(difficultyMapping).map(([label, value]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={fields.styleOrType}
          render={({ field }) => (
            <FormItem>
              <FormLabel>طريقة الأسئلة</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='اختر طريقة الأسئلة' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value=''>موضوعي ومقالي</SelectItem>
                  {Object.entries(typeMapping).map(([label, value]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <Button
        type='button'
        className='mt-4 gap-2'
        onClick={generateRandomQuestions}
        disabled={isLoading}
      >
        <RefreshCwIcon className={cn('h-4 w-4', isLoading && 'animate-spin')} />
        توليد
      </Button>
      <p className='mt-2 text-sm text-gray-500'>
        الضغط على هذا الزر سيستبدل أسئلة هذه المجموعة بالأسئلة المتولدة
      </p>
    </div>
  )
}
