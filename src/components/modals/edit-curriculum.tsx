import { useEffect } from 'react'
import { CurriculumForm, EditCurriculumFieldValues } from '../forms/curriculum'
import { DialogHeader } from '../ui/dialog'
import { api } from '~/trpc/react'
import { Loader2Icon } from 'lucide-react'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { editCurriculumSchema } from '~/validation/editCurriculumSchema'
import { z } from 'zod'

export const EditCurriculumDialog = ({
  id,
  setDialogOpen,
}: {
  id: string
  setDialogOpen: (state: boolean) => void
}) => {
  const utils = api.useUtils()
  const form = useForm<EditCurriculumFieldValues>({
    resolver: zodResolver(editCurriculumSchema),
  })

  const mutation = api.curriculum.update.useMutation()

  const onSubmit = (data: EditCurriculumFieldValues) => {
    mutation
      .mutateAsync(data as z.infer<typeof editCurriculumSchema>)
      .then(() => {
        setDialogOpen(false)
        toast.success('تم تعديل المنهج بنجاح')
      })
      .catch((error) => {
        toast.error(error.message)
      })
      .finally(() => {
        utils.curriculum.invalidate()
      })
  }

  const {
    data: course,
    isLoading,
    error,
  } = api.curriculum.get.useQuery({
    id,
    include: { parts: true },
  })

  useEffect(() => {
    if (course) form.reset(course)
  }, [course, form])

  if (isLoading)
    return (
      <div className='flex justify-center'>
        <Loader2Icon className='h-4 w-4 animate-spin' />
      </div>
    )

  if (error)
    return (
      <p className='text-center text-red-600'>
        {error.message || 'حدث خطأ ما'}
      </p>
    )

  return (
    <>
      <DialogHeader className='mb-2 text-lg font-bold'>
        تعديل المنهج
      </DialogHeader>
      <CurriculumForm
        form={form as any}
        onSubmit={onSubmit as any}
        isLoading={mutation.isPending}
        submitText='تعديل'
      />
    </>
  )
}
