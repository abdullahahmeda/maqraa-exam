import { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form'
import { api } from '~/utils/api'
import { Button } from './ui/button'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
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
import { RefreshCwIcon } from 'lucide-react'
import { cn } from '~/lib/utils'
import { useEffect } from 'react'

type Fields = {
  url: string
  sheetName: string
}

const DEFAULT_FIELDS: Fields = {
  url: 'url',
  sheetName: 'sheetName',
}

type Props<T extends FieldValues> = {
  fields?: Fields
  form: UseFormReturn<T>
}

export const ImportFormFields = <T extends FieldValues>({
  form,
  fields = DEFAULT_FIELDS,
}: Props<T>) => {
  const { control, getValues, resetField } = form
  const utils = api.useUtils()

  const {
    isFetching,
    data: sheetNames,
    error,
    refetch,
  } = api.sheet.listSheetNames.useQuery(
    { url: getValues(fields.url as FieldPath<T>) },
    {
      enabled: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    }
  )

  useEffect(() => {
    form.setError(fields.url as FieldPath<T>, {
      message: error?.message,
    })
  }, [form, error])

  const updateSpreadsheet = async () => {
    const isValidUrl = await form.trigger(fields.url as FieldPath<T>)

    // error messages will show already, so no need to show anything
    if (!isValidUrl) return

    clearSheetNames()
    refetch()
  }

  const clearSheetNames = () => {
    // clear value
    resetField(fields.sheetName as FieldPath<T>)
    // clear options
    utils.sheet.listSheetNames.reset()
  }

  return (
    <>
      <FormField
        control={control}
        name={fields.url as FieldPath<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>رابط الإكسل الشيت</FormLabel>
            <FormControl>
              <div className='flex gap-2'>
                <Input type='url' {...field} />
                <Button
                  type='button'
                  onClick={updateSpreadsheet}
                  disabled={isFetching}
                >
                  <RefreshCwIcon
                    className={cn('ml-2 h-4 w-4', isFetching && 'animate-spin')}
                  />
                  تحديث
                </Button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={fields.sheetName as FieldPath<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>الورقة</FormLabel>
            <Select
              disabled={!sheetNames || sheetNames.length === 0}
              onValueChange={field.onChange}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger
                  disabled={!sheetNames || sheetNames?.length === 0}
                >
                  <SelectValue placeholder='اختر الورقة' />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {sheetNames?.map((sheet) => (
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
    </>
  )
}
