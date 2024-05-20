'use client'

import type { FieldValues, Control, FieldPath } from 'react-hook-form'
import {
  FormField,
  FormControl,
  FormLabel,
  FormMessage,
  FormItem,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'

export type NewCycleFieldValues = { name: string }
export type EditCycleFieldValues = { id: string } & NewCycleFieldValues

type FormProps<T extends FieldValues> = {
  control: Control<T>
}

export const CycleFormFields = <T extends FieldValues>({
  control,
}: FormProps<T>) => {
  return (
    <>
      <FormField
        control={control}
        name={'name' as FieldPath<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>اسم الدورة</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}
