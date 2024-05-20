'use client'

import { useForm } from 'react-hook-form'
import { Form } from '~/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '~/trpc/react'
import { CourseFormFields, type NewCourseFieldValues } from './form-fields'
import { toast } from 'sonner'
import { populateFormWithErrors } from '~/utils/errors'
import { useRouter } from 'next/navigation'
import { Button } from '~/components/ui/button'
import { createCourseSchema } from '~/validation/backend/mutations/course/create'

export function NewCourseForm() {
  const router = useRouter()
  const form = useForm<NewCourseFieldValues>({
    resolver: zodResolver(createCourseSchema),
  })

  const utils = api.useUtils()
  const mutation = api.course.create.useMutation({
    onError(error) {
      toast.error(error.message ?? 'حدث خطأ غير متوقع')
      populateFormWithErrors(form, error)
    },
    onSuccess() {
      toast.success('تم إضافة المقرر بنجاح')
      void utils.course.invalidate()

      if (history.state === null) router.push('/dashboard/courses')
      else router.back()
    },
  })

  const onSubmit = (data: NewCourseFieldValues) => {
    mutation.mutate(data)
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <CourseFormFields control={form.control} />
        <Button loading={mutation.isPending}>إضافة</Button>
      </form>
    </Form>
  )
}
