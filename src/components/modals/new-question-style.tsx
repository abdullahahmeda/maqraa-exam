import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { useToast } from '../ui/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { newQuestionStyleSchema } from '~/validation/newQuestionStyleSchema'
import { api } from '~/utils/api'
import {
  NewQuestionStyleFieldValues,
  QuestionStyleForm,
} from '../forms/question-style'
import { DialogHeader } from '../ui/dialog'

export const NewQuestionStyleDialog = ({
  setDialogOpen,
}: {
  setDialogOpen: (state: boolean) => void
}) => {
  const form = useForm<NewQuestionStyleFieldValues>({
    resolver: zodResolver(newQuestionStyleSchema),
    defaultValues: { choicesColumns: [] },
  })

  const queryClient = useQueryClient()
  const { toast } = useToast()

  const mutation = api.questionStyle.create.useMutation()

  const onSubmit = (data: NewQuestionStyleFieldValues) => {
    const t = toast({ title: 'جاري إضافة نوع السؤال' })
    mutation
      .mutateAsync(data as z.infer<typeof newQuestionStyleSchema>)
      .then(() => {
        t.dismiss()
        toast({ title: 'تم إضافة نوع السؤال بنجاح' })
        setDialogOpen(false)
      })
      .catch((error) => {
        t.dismiss()
        toast({ title: error.message, variant: 'destructive' })
      })
      .finally(() => {
        queryClient.invalidateQueries([['questionStyle']])
      })
  }

  return (
    <>
      <DialogHeader className='mb-2 text-lg font-bold'>
        إضافة نوع سؤال
      </DialogHeader>
      <QuestionStyleForm
        form={form}
        isLoading={mutation.isLoading}
        submitText='إضافة'
        onSubmit={onSubmit}
      />
    </>
  )
}
