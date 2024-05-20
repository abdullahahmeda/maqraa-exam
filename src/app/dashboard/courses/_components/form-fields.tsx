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

export type NewCourseFieldValues = { name: string }
export type EditCourseFieldValues = { id: string } & NewCourseFieldValues

type FormProps<T extends FieldValues> = {
  control: Control<T>
}

export const CourseFormFields = <T extends FieldValues>({
  control,
}: FormProps<T>) => {
  return (
    <>
      <FormField
        control={control}
        name={'name' as FieldPath<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>اسم المقرر</FormLabel>
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
