import { NewCurriculumFieldValues, CurriculumForm } from '../forms/curriculum'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { newCurriculumSchema } from '~/validation/newCurriculumSchema'
import { z } from 'zod'
import { toast } from 'sonner'
import { api } from '~/utils/api'
import { DialogHeader } from '../ui/dialog'

export const NewCurriculumDialog = ({
  setDialogOpen,
}: {
  setDialogOpen: (state: boolean) => void
}) => {
  const utils = api.useUtils()

  const form = useForm<NewCurriculumFieldValues>({
    resolver: zodResolver(newCurriculumSchema),
    defaultValues: {
      parts: [{ name: '', number: '', from: '', to: '', mid: '' }],
    },
  })

  const mutation = api.curriculum.create.useMutation()

  const onSubmit = (data: NewCurriculumFieldValues) => {
    const promise = mutation
      .mutateAsync(data as z.infer<typeof newCurriculumSchema>)
      .then(() => {
        setDialogOpen(false)
      })
      .finally(() => {
        utils.curriculum.invalidate()
      })
    toast.promise(promise, {
      loading: 'جاري إضافة المنهج...',
      success: 'تم إضافة المنهج بنجاح',
      error: (error) => error.message,
    })
  }

  return (
    <>
      <DialogHeader className='mb-2 text-lg font-bold'>إضافة منهج</DialogHeader>
      <CurriculumForm
        form={form}
        onSubmit={onSubmit}
        isLoading={mutation.isPending}
        submitText='إضافة'
      />
    </>
  )
}
