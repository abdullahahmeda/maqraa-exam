'use client'

import { useForm } from 'react-hook-form'
import { Form } from '~/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '~/trpc/react'
import { ExamFormFields, type NewExamFieldValues } from './form-fields'
import { toast } from 'sonner'
import { populateFormWithErrors } from '~/utils/errors'
import { useRouter } from 'next/navigation'
import { Button } from '~/components/ui/button'
import { createExamSchema } from '~/validation/frontend/exam/create'
import { type Selectable } from 'kysely'
import type { Cycle, Course } from '~/kysely/types'
import { toExamInput } from '~/utils/exams'

export function NewExamForm({
  cycles,
  courses,
}: {
  cycles: Selectable<Cycle>[]
  courses: Selectable<Course>[]
}) {
  const router = useRouter()
  const form = useForm<NewExamFieldValues>({
    resolver: zodResolver(createExamSchema),
    defaultValues: {
      groups: [],
    },
  })

  const utils = api.useUtils()
  const mutation = api.exam.create.useMutation({
    onError(error) {
      toast.error(error.message ?? 'حدث خطأ غير متوقع')
      populateFormWithErrors(form, error)
    },
    onSuccess() {
      toast.success('تم إضافة الإختبار بنجاح')
      void utils.exam.invalidate()

      if (history.state === null) router.push('/dashboard/exams')
      else router.back()
    },
  })

  const onSubmit = (data: NewExamFieldValues) => {
    const newData = toExamInput(data)
    mutation.mutate(newData)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <ExamFormFields form={form} cycles={cycles} courses={courses} />
        <Button loading={mutation.isPending}>إضافة</Button>
      </form>
    </Form>
  )
}
