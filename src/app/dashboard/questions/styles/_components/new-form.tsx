'use client'

import { useForm } from 'react-hook-form'
import { Form } from '~/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '~/trpc/react'
import {
  QuestionStyleFormFields,
  type NewQuestionStyleFieldValues,
} from './form-fields'
import { toast } from 'sonner'
import { populateFormWithErrors } from '~/utils/errors'
import { useRouter } from 'next/navigation'
import { Button } from '~/components/ui/button'
import { createQuestionStyleSchema } from '~/validation/backend/mutations/question-style/create'

export function NewQuestionStyleForm() {
  const router = useRouter()
  const form = useForm<NewQuestionStyleFieldValues>({
    resolver: zodResolver(createQuestionStyleSchema),
  })

  const utils = api.useUtils()
  const mutation = api.questionStyle.create.useMutation({
    onError(error) {
      toast.error(error.message ?? 'حدث خطأ غير متوقع')
      populateFormWithErrors(form, error)
    },
    onSuccess() {
      toast.success('تم إضافة نوع السؤال بنجاح')
      void utils.questionStyle.invalidate()

      if (history.state === null) router.push('/dashboard/questions/styles')
      else router.back()
    },
  })

  const onSubmit = (data: NewQuestionStyleFieldValues) => {
    mutation.mutate(data)
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <QuestionStyleFormFields control={form.control} />
        <Button loading={mutation.isPending}>إضافة</Button>
      </form>
    </Form>
  )
}
