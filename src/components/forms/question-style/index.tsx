import { UseFormReturn, useWatch } from 'react-hook-form'
import {
  Form,
  FormField,
  FormDescription,
  FormControl,
  FormLabel,
  FormMessage,
  FormItem,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { DialogFooter } from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { QuestionType } from '~/kysely/enums'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { columnMapping, typeMapping } from '~/utils/questions'
import { Checkbox } from '~/components/ui/checkbox'

export type NewQuestionStyleFieldValues = {
  name: string
  type: QuestionType
  choicesColumns: string[]
}
export type EditQuestionStyleFieldValues = {
  id: string
} & NewQuestionStyleFieldValues

type FormProps = {
  form: UseFormReturn<
    NewQuestionStyleFieldValues | EditQuestionStyleFieldValues
  >
  onSubmit: (
    data: NewQuestionStyleFieldValues | EditQuestionStyleFieldValues
  ) => void
  isLoading?: boolean
  submitText: string
}

const items = Object.entries(columnMapping).map(([label, value]) => ({
  label,
  value,
}))

export const QuestionStyleForm = ({
  form,
  onSubmit,
  isLoading = false,
  submitText,
}: FormProps) => {
  const type = useWatch({
    control: form.control,
    name: 'type',
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='name'
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
          control={form.control}
          name='type'
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
            <p></p>
            <FormField
              control={form.control}
              name='choicesColumns'
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
                      control={form.control}
                      name='choicesColumns'
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.value}
                            className='flex items-center gap-2 space-y-0'
                          >
                            <FormControl>
                              <Checkbox
                                // @ts-ignore
                                checked={field.value?.includes(item.value)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([
                                        ...field.value,
                                        item.value,
                                      ])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.value
                                        )
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
        <DialogFooter>
          <Button type='submit' loading={isLoading}>
            {submitText}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
