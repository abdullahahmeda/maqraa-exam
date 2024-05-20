import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from '../ui/select'
import { DialogFooter } from '../ui/dialog'
import { Button } from '../ui/button'
import { type UseFormReturn } from 'react-hook-form'
import { api } from '~/trpc/react'
import { ImportFormFields } from '../import-form-fields'

export type ImportStudentsFieldValues = {
  url: string
  sheetName: string
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
  const { data: cycles, isLoading: isCyclesLoading } = api.cycle.list.useQuery()

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <ImportFormFields
          form={form}
          fields={{
            url: 'url',
            sheetName: 'sheetName',
          }}
        />
        <FormField
          control={form.control}
          name='cycleId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>الدورة</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger
                  // loading={isCyclesLoading}
                  >
                    <SelectValue placeholder='اختر الدورة' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {cycles?.data.map((cycle) => (
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
