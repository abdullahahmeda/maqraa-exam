'use client'

import { PlusIcon } from 'lucide-react'
import Link from 'next/link'
import type { FieldValues, FieldPath, UseFormReturn } from 'react-hook-form'
import { ImportFormFields } from '~/components/import-form-fields'
import { buttonVariants } from '~/components/ui/button'
import {
  FormField,
  FormControl,
  FormLabel,
  FormMessage,
  FormItem,
  FormDescription,
} from '~/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip'
import { api } from '~/trpc/react'

export type NewQuestionFieldValues = {
  url: string
  sheetName: string
  courseId: string
}
// export type EditQuestionFieldValues = { id: string } & NewQuestionFieldValues

type FormProps<T extends FieldValues> = {
  form: UseFormReturn<T>
  courses: { name: string; id: string }[]
}

export const QuestionFormFields = <T extends FieldValues>({
  form,
  courses,
}: FormProps<T>) => {
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
        name={'courseId' as FieldPath<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>المقرر</FormLabel>
            <div className='flex gap-2'>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger
                  // loading={isCoursesLoading}
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
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      className={buttonVariants({
                        size: 'icon',
                        variant: 'secondary',
                      })}
                      href='/dashboard/courses/new'
                      prefetch
                    >
                      <PlusIcon className='h-4 w-4' />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>إنشاء مقرر</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <FormDescription>
              إذا لم تظهر المقررات الجديدة قم بإعادة تحميل الصفحة
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}
