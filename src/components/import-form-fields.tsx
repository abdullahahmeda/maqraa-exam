import type {
  FieldValues,
  Path,
  PathValue,
  UseFormReturn,
} from 'react-hook-form'
import { api } from '~/trpc/react'
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
import { type Fields } from '~/types'

type FieldKeys = 'url' | 'sheetName'

type FormFields<T extends FieldValues> = Fields<FieldKeys, T>

type Props<T extends FieldValues> = {
  fields: FormFields<T>
  form: UseFormReturn<T>
}

export const ImportFormFields = <T extends FieldValues>({
  form,
  fields,
}: Props<T>) => {
  const { control, getValues, resetField } = form
  const utils = api.useUtils()

  const {
    isFetching,
    data: sheetNames,
    error,
    refetch,
  } = api.sheet.listSheetNames.useQuery(
    { url: getValues(fields.url) },
    {
      enabled: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
  )

  useEffect(() => {
    if (error)
      form.setError(fields.url, {
        message: error?.message,
      })
  }, [error, form, fields.url])

  const updateSpreadsheet = async () => {
    const isValidUrl = await form.trigger(fields.url)

    // error messages will show already, so no need to show anything
    if (!isValidUrl) return

    clearSheetNames()
    void refetch()
  }

  const clearSheetNames = () => {
    // clear value
    resetField(fields.sheetName, {
      defaultValue: null as PathValue<T, Path<T>>,
    })
    // clear options
    void utils.sheet.listSheetNames.reset()
  }

  return (
    <>
      <FormField
        control={control}
        name={fields.url}
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
        name={fields.sheetName}
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
