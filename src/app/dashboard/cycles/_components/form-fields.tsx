'use client'

import { Selectable } from 'kysely'
import type { FieldValues, Control, FieldPath } from 'react-hook-form'
import {
  FormField,
  FormControl,
  FormLabel,
  FormMessage,
  FormItem,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import MultipleSelector from '~/components/ui/multi-select'
import type { Curriculum } from '~/kysely/types'

export type NewCycleFieldValues = {
  name: string
  curricula: { value: string }[]
}
export type EditCycleFieldValues = { id: string } & NewCycleFieldValues

type FormProps<T extends FieldValues> = {
  control: Control<T>
  curricula: Selectable<Curriculum>[]
}

export const CycleFormFields = <T extends FieldValues>({
  control,
  curricula,
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
      <FormField
        control={control}
        name={'curricula' as FieldPath<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>المناهج</FormLabel>
            <FormControl>
              <MultipleSelector
                value={field.value}
                onChange={field.onChange}
                options={curricula.map((c) => ({
                  label: c.name,
                  value: c.id,
                }))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}
