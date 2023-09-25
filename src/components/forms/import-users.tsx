import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Input } from '../ui/input'
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from '../ui/select'
import { DialogFooter } from '../ui/dialog'
import { Button } from '../ui/button'
import { UseFormReturn } from 'react-hook-form'
import { api } from '~/utils/api'

export type ImportStudentsFieldValues = {
  url: string
  sheet: string
  cycleId: string
}

type FormProps = {
  form: UseFormReturn<ImportStudentsFieldValues>
  onSubmit: (data: ImportStudentsFieldValues) => void
  isLoading?: boolean
}

export const ImportStudentsForm = ({
  form,
  onSubmit,
  isLoading,
}: FormProps) => {
  const { data: cycles, isLoading: isCyclesLoading } =
    api.cycle.findMany.useQuery({})

  const {
    isFetching: isFetchingSheets,
    data: sheets,
    refetch: refetchSheets,
  } = api.listSheets.useQuery(
    {
      url: form.getValues('url'),
    },
    {
      enabled: false,
      refetchOnMount: false,
      refetchOnReconnect: false,

      onError: (error) => {
        form.setError('url', {
          message: error.message,
        })
      },
    }
  )

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
                <div className='flex gap-1'>
                  <Input type='url' {...field} />
                  <Button
                    type='button'
                    onClick={updateSpreadsheet}
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
          name='sheet'
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
          name='cycleId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>الدورة</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger loading={isCyclesLoading}>
                    <SelectValue placeholder='اختر الدورة' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {cycles?.map((cycle) => (
                    <SelectItem key={cycle.id} value={cycle.id}>
                      {cycle.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button type='submit' loading={isLoading}>
            إضافة
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
