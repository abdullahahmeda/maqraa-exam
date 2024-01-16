import { UseFormReturn } from 'react-hook-form'
import { api } from '~/utils/api'
import { Button } from '../ui/button'
import { DialogFooter } from '../ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'

export type ImportQuestionsFieldValues = {
  url: string
  sheetName: string
  courseId: string
}

type FormProps = {
  form: UseFormReturn<ImportQuestionsFieldValues>
  onSubmit: (data: ImportQuestionsFieldValues) => void
  isLoading?: boolean
}

export const ImportQuestionsForm = ({
  form,
  onSubmit,
  isLoading,
}: FormProps) => {
  const {
    isFetching: isFetchingSheets,
    data: sheets,
    refetch: refetchSheets,
  } = api.sheet.listNames.useQuery(
    { url: form.getValues('url') },
    {
      enabled: false,
      refetchOnMount: false,
      refetchOnReconnect: false,

      onError: (error) => {
        form.setError('url', { message: error.message })
      },
    }
  )

  const { data: courses, isLoading: isCoursesLoading } =
    api.course.list.useQuery({})

  const updateSpreadsheet = async () => {
    const isValidUrl = await form.trigger('url')
    if (!isValidUrl) return

    refetchSheets()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='url'
          render={({ field }) => (
            <FormItem>
              <FormLabel>رابط الإكسل الشيت</FormLabel>
              <FormControl>
                <div className='flex gap-1.5'>
                  <Input {...field} />
                  <Button
                    type='button'
                    variant='secondary'
                    onClick={updateSpreadsheet}
                    disabled={isFetchingSheets}
                    loading={isFetchingSheets}
                  >
                    تحديث
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='sheetName'
          render={({ field }) => (
            <FormItem>
              <FormLabel>الورقة</FormLabel>
              <Select
                disabled={!sheets || sheets.length === 0}
                onValueChange={field.onChange}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='اختر الورقة' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {sheets?.map((sheet) => (
                    <SelectItem key={sheet} value={sheet}>
                      {sheet}
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
          name='courseId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>المقرر</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger
                  // loading={isCoursesLoading}
                  >
                    <SelectValue placeholder='اختر المقرر' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {courses?.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button
            type='submit'
            // variant='success'
            loading={isLoading}
          >
            إضافة
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
