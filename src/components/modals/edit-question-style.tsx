import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { useToast } from '../ui/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { editQuestionStyleSchema } from '~/validation/editQuestionStyleSchema'
import { api } from '~/utils/api'
import {
  EditQuestionStyleFieldValues,
  QuestionStyleForm,
} from '../forms/question-style'
import { DialogHeader } from '../ui/dialog'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'

export const EditQuestionStyleDialog = ({
  setDialogOpen,
  id,
}: {
  setDialogOpen: (state: boolean) => void
  id: string
}) => {
  const form = useForm<EditQuestionStyleFieldValues>({
    resolver: zodResolver(editQuestionStyleSchema),
    defaultValues: { choicesColumns: [] },
  })

  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { data, isLoading, error } = api.questionStyle.get.useQuery(id)

  useEffect(() => {
    if (data) form.reset(data as any)
  }, [data, form])

  const mutation = api.questionStyle.update.useMutation()

  const onSubmit = (data: EditQuestionStyleFieldValues) => {
    const t = toast({ title: 'جاري تعديل نوع السؤال' })
    mutation
      .mutateAsync(data as z.infer<typeof editQuestionStyleSchema>)
      .then(() => {
        t.dismiss()
        toast({ title: 'تم تعديل نوع السؤال بنجاح' })
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

  if (isLoading)
    return (
      <div className='flex justify-center'>
        <Loader2 className='h-4 w-4 animate-spin' />
      </div>
    )

  if (error || !data)
    return (
      <p className='text-center text-red-600'>
        {error?.message || 'حدث خطأ ما'}
      </p>
    )

  return (
    <>
      <DialogHeader className='mb-2 text-lg font-bold'>
        إضافة نوع سؤال
      </DialogHeader>
      <QuestionStyleForm
        form={form as any}
        isLoading={mutation.isLoading}
        submitText='تعديل'
        onSubmit={onSubmit as any}
      />
    </>
  )
}
