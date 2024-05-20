import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { api } from '~/trpc/react'
import { newQuestionStyleSchema } from '~/validation/newQuestionStyleSchema'
import { NewQuestionStyleFieldValues, QuestionStyleForm } from '.'

type Props = {
  onError?: (onErrorParams: {
    error: any
    form: UseFormReturn<NewQuestionStyleFieldValues>
  }) => void
  onSettled?: (onSettledParams: {
    form: UseFormReturn<NewQuestionStyleFieldValues>
  }) => void
  onSuccess?: (onSuccessParams: {
    form: UseFormReturn<NewQuestionStyleFieldValues>
  }) => void
  onLoading?: (onLoadingParams: {
    form: UseFormReturn<NewQuestionStyleFieldValues>
  }) => void
}

export const NewQuestionStyleForm = ({
  onSuccess,
  onError,
  onSettled,
  onLoading,
}: Props) => {
  const form = useForm<NewQuestionStyleFieldValues>({
    resolver: zodResolver(newQuestionStyleSchema),
    defaultValues: { choicesColumns: [] },
  })

  const utils = api.useUtils()
  const mutation = api.questionStyle.create.useMutation()

  const onSubmit = (data: NewQuestionStyleFieldValues) => {
    if (onLoading) onLoading({ form })
    mutation
      .mutateAsync(data as z.infer<typeof newQuestionStyleSchema>)
      .then(() => {
        if (onSuccess) onSuccess({ form })
      })
      .catch((error) => {
        if (onError) onError({ error, form })
      })
      .finally(() => {
        utils.questionStyle.invalidate()
        if (onSettled) onSettled({ form })
      })
  }

  return (
    <QuestionStyleForm
      form={form}
      isLoading={mutation.isPending}
      submitText='إضافة'
      onSubmit={onSubmit}
    />
  )
}
