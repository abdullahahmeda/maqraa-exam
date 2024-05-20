'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { api } from '~/trpc/react'
import { toast } from 'sonner'
import { ExamFormFields, type EditExamFieldValues } from './form-fields'
import { Button } from '~/components/ui/button'
import { Form } from '~/components/ui/form'
import { type Exam } from '~/kysely/types'
import { populateFormWithErrors } from '~/utils/errors'
import { useRouter } from 'next/navigation'
import { type Selectable } from 'kysely'
import { updateExamSchema } from '~/validation/mutations/exam/update'

export const EditExamForm = ({ exam }: { exam: Selectable<Exam> }) => {
  const router = useRouter()
  const form = useForm<EditExamFieldValues>({
    resolver: zodResolver(updateExamSchema),
    defaultValues: exam,
  })

  const utils = api.useUtils()

  const mutation = api.exam.update.useMutation({
    onError(error) {
      toast.error(error.message ?? 'حدث خطأ غير متوقع')
      populateFormWithErrors(form, error)
    },
    onSuccess() {
      toast.success('تم تعديل الإختبار بنجاح')
      void utils.exam.invalidate()

      if (history.state === null) router.push('/dashboard/exams')
      else router.back()
    },
  })

  const onSubmit = (data: EditExamFieldValues) => {
    mutation.mutate(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <ExamFormFields control={form.control} />
        <Button loading={mutation.isPending}>تعديل</Button>
      </form>
    </Form>
  )
}
