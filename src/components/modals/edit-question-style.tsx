import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { zodResolver } from '@hookform/resolvers/zod'
import { editQuestionStyleSchema } from '~/validation/editQuestionStyleSchema'
import { api } from '~/utils/api'
import {
  EditQuestionStyleFieldValues,
  QuestionStyleForm,
} from '../forms/question-style'
import { DialogHeader } from '../ui/dialog'
import { Loader2Icon } from 'lucide-react'
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

  const utils = api.useUtils()

  const { data, isLoading, error } = api.questionStyle.get.useQuery(id)
  const mutation = api.questionStyle.update.useMutation()

  useEffect(() => {
    if (data) form.reset(data as any)
  }, [data, form])

  const onSubmit = (data: EditQuestionStyleFieldValues) => {
    const promise = mutation
      .mutateAsync(data as z.infer<typeof editQuestionStyleSchema>)
      .then(() => {
        setDialogOpen(false)
      })
      .finally(() => {
        utils.questionStyle.invalidate()
      })
    toast.promise(promise, {
      loading: 'جاري تعديل نوع السؤال...',
      success: 'تم تعديل نوع السؤال بنجاح',
      error: (error) => error.message,
    })
  }

  if (isLoading)
    return (
      <div className='flex justify-center'>
        <Loader2Icon className='h-4 w-4 animate-spin' />
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
        تعديل نوع سؤال
      </DialogHeader>
      <QuestionStyleForm
        form={form as any}
        isLoading={mutation.isPending}
        submitText='تعديل'
        onSubmit={onSubmit as any}
      />
    </>
  )
}
