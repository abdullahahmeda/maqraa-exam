import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { editCourseSchema } from '~/validation/editCourseSchema'
import { useEffect } from 'react'
import { api } from '~/utils/api'
import { CourseForm, EditCourseFieldValues } from '../forms/course'
import { Loader2 } from 'lucide-react'
import { DialogHeader } from '../ui/dialog'
import { z } from 'zod'

export const EditCourseDialog = ({ id }: { id: string }) => {
  const utils = api.useUtils()
  const form = useForm<EditCourseFieldValues>({
    resolver: zodResolver(editCourseSchema),
  })

  const { data: course, isLoading, error } = api.course.get.useQuery(id)
  const mutation = api.course.update.useMutation()

  useEffect(() => {
    if (course) form.reset(course)
  }, [course, form])

  const onSubmit = (data: EditCourseFieldValues) => {
    mutation
      .mutateAsync(data as z.infer<typeof editCourseSchema>)
      .then(() => {
        toast.success('تم تعديل المقرر بنجاح')
      })
      .catch((error) => {
        toast.error(error.message)
      })
      .finally(() => {
        utils.course.invalidate()
      })
  }

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
        تعديل المقرر
      </DialogHeader>
      <CourseForm
        form={form as any}
        onSubmit={onSubmit as any}
        isLoading={mutation.isPending}
        submitText='تعديل'
      />
    </>
  )
}
