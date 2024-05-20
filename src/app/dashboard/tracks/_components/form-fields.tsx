'use client'

import { type Selectable } from 'kysely'
import type { FieldValues, Control, FieldPath } from 'react-hook-form'
import {
  FormField,
  FormControl,
  FormLabel,
  FormMessage,
  FormItem,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import type { Course } from '~/kysely/types'

export type NewTrackFieldValues = { name: string; courseId: string }
export type EditTrackFieldValues = { id: string } & NewTrackFieldValues

type FormProps<T extends FieldValues> = {
  control: Control<T>
  courses: Selectable<Course>[]
}

export const TrackFormFields = <T extends FieldValues>({
  control,
  courses,
}: FormProps<T>) => {
  return (
    <>
      <FormField
        control={control}
        name={'name' as FieldPath<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>اسم المسار</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={'courseId' as FieldPath<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>المقرر</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger
                // loading={isTracksLoading}
                >
                  <SelectValue placeholder='اختر المقرر' />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
    </>
  )
}
