'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { api } from '~/trpc/react'
import { toast } from 'sonner'
import { CourseFormFields, type EditCourseFieldValues } from './form-fields'
import { Button } from '~/components/ui/button'
import { Form } from '~/components/ui/form'
import { type Course } from '~/kysely/types'
import { populateFormWithErrors } from '~/utils/errors'
import { useRouter } from 'next/navigation'
import { type Selectable } from 'kysely'
import { updateCourseSchema } from '~/validation/backend/mutations/course/update'

export const EditCourseForm = ({ course }: { course: Selectable<Course> }) => {
  const router = useRouter()
  const form = useForm<EditCourseFieldValues>({
    resolver: zodResolver(updateCourseSchema),
    defaultValues: course,
  })

  const utils = api.useUtils()

  const mutation = api.course.update.useMutation({
    onError(error) {
      toast.error(error.message ?? 'حدث خطأ غير متوقع')
      populateFormWithErrors(form, error)
    },
    onSuccess() {
      toast.success('تم تعديل المقرر بنجاح')
      void utils.course.invalidate()

      if (history.state === null) router.push('/dashboard/courses')
      else router.back()
    },
  })

  const onSubmit = (data: EditCourseFieldValues) => {
    mutation.mutate(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <CourseFormFields control={form.control} />
        <Button loading={mutation.isPending}>تعديل</Button>
      </form>
    </Form>
  )
}
