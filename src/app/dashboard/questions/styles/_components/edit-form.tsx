'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { api } from '~/trpc/react'
import { toast } from 'sonner'
import {
  QuestionStyleFormFields,
  type EditQuestionStyleFieldValues,
} from './form-fields'
import { Button } from '~/components/ui/button'
import { Form } from '~/components/ui/form'
import { type QuestionStyle } from '~/kysely/types'
import { populateFormWithErrors } from '~/utils/errors'
import { useRouter } from 'next/navigation'
import { type Selectable } from 'kysely'
import { updateQuestionStyleSchema } from '~/validation/backend/mutations/question-style/update'

export const EditQuestionStyleForm = ({
  questionStyle,
}: {
  questionStyle: Selectable<QuestionStyle>
}) => {
  const router = useRouter()
  const form = useForm<EditQuestionStyleFieldValues>({
    resolver: zodResolver(updateQuestionStyleSchema),
    defaultValues: questionStyle,
  })

  const utils = api.useUtils()

  const mutation = api.questionStyle.update.useMutation({
    onError(error) {
      toast.error(error.message ?? 'حدث خطأ غير متوقع')
      populateFormWithErrors(form, error)
    },
    onSuccess() {
      toast.success('تم تعديل نوع السؤال بنجاح')
      void utils.questionStyle.invalidate()

      if (history.state === null) router.push('/dashboard/questions/styles')
      else router.back()
    },
  })

  const onSubmit = (data: EditQuestionStyleFieldValues) => {
    // @ts-expect-error Check this type error
    mutation.mutate(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <QuestionStyleFormFields control={form.control} />
        <Button loading={mutation.isPending}>تعديل</Button>
      </form>
    </Form>
  )
}
