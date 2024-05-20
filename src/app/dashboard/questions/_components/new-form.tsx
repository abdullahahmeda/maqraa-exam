'use client'

import { useForm } from 'react-hook-form'
import { Form } from '~/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '~/trpc/react'
import { QuestionFormFields, type NewQuestionFieldValues } from './form-fields'
import { toast } from 'sonner'
import { populateFormWithErrors } from '~/utils/errors'
import { useRouter } from 'next/navigation'
import { Button } from '~/components/ui/button'
import { importQuestionsSchema } from '~/validation/backend/mutations/question/import'

export function ImportQuestionsForm({
  courses,
}: {
  courses: { id: string; name: string }[]
}) {
  const router = useRouter()
  const form = useForm<NewQuestionFieldValues>({
    resolver: zodResolver(importQuestionsSchema),
  })

  const utils = api.useUtils()
  const mutation = api.question.import.useMutation({
    onError(error) {
      toast.error(error.message ?? 'حدث خطأ غير متوقع')
      populateFormWithErrors(form, error)
    },
    onSuccess() {
      toast.success('تم إضافة الأسئلة بنجاح')
      void utils.question.invalidate()

      if (history.state === null) router.push('/dashboard/questions')
      else router.back()
    },
  })

  const onSubmit = (data: NewQuestionFieldValues) => {
    mutation.mutate(data)
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <QuestionFormFields form={form} courses={courses} />
        <Button loading={mutation.isPending}>إضافة</Button>
      </form>
    </Form>
  )
}
