import { useEffect } from 'react'
import { CurriculumForm, EditCurriculumFieldValues } from '../forms/curriculum'
import { DialogHeader } from '../ui/dialog'
import { api } from '~/utils/api'
import { Loader2 } from 'lucide-react'
import { useToast } from '../ui/use-toast'
import { useQueryClient } from '@tanstack/react-query'
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
  const queryClient = useQueryClient()
  const form = useForm<EditCurriculumFieldValues>({
    resolver: zodResolver(editCurriculumSchema),
  })

  const curriculumUpdate = api.updateCurriculum.useMutation()

  const { toast } = useToast()

  const onSubmit = (data: EditCurriculumFieldValues) => {
    const t = toast({ title: 'جاري إضافة المنهج' })
    curriculumUpdate
      .mutateAsync(data as z.infer<typeof editCurriculumSchema>)
      .then(() => {
        t.dismiss()
        toast({ title: 'تم إضافة المنهج بنجاح' })
        setDialogOpen(false)
      })
      .catch((error) => {
        t.dismiss()
        toast({ title: error.message })
      })
      .finally(() => {
        queryClient.invalidateQueries([['curriculum']])
      })
  }

  const {
    data: course,
    isLoading,
    error,
  } = api.curricula.findFirst.useQuery({
    where: { id },
    include: { parts: true },
  })

  useEffect(() => {
    if (course) form.reset(course)
  }, [course, form])

  if (isLoading)
    return (
      <div className='flex justify-center'>
        <Loader2 className='h-4 w-4 animate-spin' />
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
        isLoading={curriculumUpdate.isLoading}
        submitText='تعديل'
      />
    </>
  )
}
