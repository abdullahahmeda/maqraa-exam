import { toast } from 'sonner'
import { DialogHeader } from '../ui/dialog'
import { api } from '~/trpc/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { newQuestionStyleSchema } from '~/validation/newQuestionStyleSchema'
import {
  NewQuestionStyleFieldValues,
  QuestionStyleForm,
} from '../forms/question-style'
import { z } from 'zod'

export const NewQuestionStyleDialog = ({
  setDialogOpen,
}: {
  setDialogOpen: (state: boolean) => void
}) => {
  const form = useForm<NewQuestionStyleFieldValues>({
    resolver: zodResolver(newQuestionStyleSchema),
    defaultValues: { choicesColumns: [] },
  })

  const utils = api.useUtils()
  const mutation = api.questionStyle.create.useMutation()

  const onSubmit = (data: NewQuestionStyleFieldValues) => {
    const promise = mutation
      .mutateAsync(data as z.infer<typeof newQuestionStyleSchema>)
      .then(() => {
        setDialogOpen(false)
      })
      .finally(() => {
        utils.questionStyle.invalidate()
      })
    toast.promise(promise, {
      loading: 'جاري إضافة نوع السؤال...',
      success: 'تم إضافة نوع السؤال بنجاح',
      error: (error) => error.message,
    })
  }

  return (
    <>
      <DialogHeader className='mb-2 text-lg font-bold'>
        إضافة نوع سؤال
      </DialogHeader>
      <QuestionStyleForm
        form={form}
        isLoading={mutation.isPending}
        submitText='إضافة'
        onSubmit={onSubmit}
      />
    </>
  )
}
