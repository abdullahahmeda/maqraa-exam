'use client'

import {
  type FieldValues,
  type Control,
  type FieldPath,
  useWatch,
} from 'react-hook-form'
import { Checkbox } from '~/components/ui/checkbox'
import {
  FormField,
  FormControl,
  FormLabel,
  FormMessage,
  FormItem,
  FormDescription,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { QuestionType } from '~/kysely/enums'
import { columnMapping, typeMapping } from '~/utils/questions'

export type ChoiceColumn = (typeof columnMapping)[keyof typeof columnMapping]

export type NewQuestionStyleFieldValues = { name: string } & (
  | {
      type: typeof QuestionType.MCQ
      choicesColumns: ChoiceColumn[]
    }
  | {
      type: typeof QuestionType.WRITTEN
    }
)
export type EditQuestionStyleFieldValues = {
  id: string
} & NewQuestionStyleFieldValues

type FormProps<T extends FieldValues> = {
  control: Control<T>
}

const items = Object.entries(columnMapping).map(([label, value]) => ({
  label,
  value,
}))

export const QuestionStyleFormFields = <T extends FieldValues>({
  control,
}: FormProps<T>) => {
  const type = useWatch({
    control,
    name: 'type' as FieldPath<T>,
  })

  return (
    <>
      <FormField
        control={control}
        name={'name' as FieldPath<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>الاسم</FormLabel>
            <FormControl>
              <Input placeholder='مثال: صح أو خطأ' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={'type' as FieldPath<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>نوع السؤال</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder='اختر نوع السؤال' />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
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
      {type === 'MCQ' && (
        <div>
          <h4 className='text-lg font-semibold'></h4>
          <FormField
            control={control}
            name={'choicesColumns' as FieldPath<T>}
            render={() => (
              <FormItem>
                <div className='mb-4'>
                  <FormLabel className='text-base'>الإختيارات</FormLabel>
                  <FormDescription>
                    اختر الحقول التي سيتم استخدامها للإختيارات
                  </FormDescription>
                </div>
                {items.map((item) => (
                  <FormField
                    key={item.value}
                    control={control}
                    name={'choicesColumns' as FieldPath<T>}
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item.value}
                          className='flex items-center gap-2 space-y-0'
                        >
                          <FormControl>
                            <Checkbox
                              checked={(field.value as string[])?.includes(
                                item.value,
                              )}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, item.value])
                                  : field.onChange(
                                      (field.value as string[])?.filter(
                                        (value: string) => value !== item.value,
                                      ),
                                    )
                              }}
                            />
                          </FormControl>
                          <FormLabel className='font-normal'>
                            {item.label}
                          </FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
    </>
  )
}
