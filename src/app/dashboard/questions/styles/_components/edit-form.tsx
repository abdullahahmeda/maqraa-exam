'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { api } from '~/trpc/react'
import { toast } from 'sonner'
import {
  type ChoiceColumn,
  QuestionStyleFormFields,
  type EditQuestionStyleFieldValues,
} from './form-fields'
import { Button } from '~/components/ui/button'
import { Form } from '~/components/ui/form'
import { populateFormWithErrors } from '~/utils/errors'
import { useRouter } from 'next/navigation'
import { updateQuestionStyleSchema } from '~/validation/backend/mutations/question-style/update'
import { QuestionType } from '~/kysely/enums'

export const EditQuestionStyleForm = ({
  questionStyle,
}: {
  questionStyle: { id: string; name: string } & (
    | {
        type: typeof QuestionType.MCQ
        choicesColumns: ChoiceColumn[]
      }
    | {
        type: typeof QuestionType.WRITTEN
      }
  )
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
