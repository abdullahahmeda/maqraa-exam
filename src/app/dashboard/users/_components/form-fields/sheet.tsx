import { type Selectable } from 'kysely'
import type { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form'
import { ImportFormFields } from '~/components/import-form-fields'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import type { Cycle } from '~/kysely/types'

type SheetUsersFormProps<T extends FieldValues> = {
  form: UseFormReturn<T>
  cycles: Selectable<Cycle>[]
}

export type SheetUsersFieldValues = {
  url: string
  sheetName: string
  cycleId: string
}

export function SheetUsersFormFields<T extends FieldValues>({
  form,
  cycles,
}: SheetUsersFormProps<T>) {
  return (
    <>
      <ImportFormFields
        form={form}
        fields={{
          url: 'url' as FieldPath<T>,
          sheetName: 'sheetName' as FieldPath<T>,
        }}
      />
      <FormField
        control={form.control}
        name={'cycleId' as FieldPath<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>الدورة</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder='اختر الدورة' />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {cycles.map((cycle) => (
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
    </>
  )
}
