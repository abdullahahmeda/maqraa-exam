import { NewCourseFieldValues, CourseForm } from '../forms/course'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '~/trpc/react'
import { newCourseSchema } from '~/validation/newCourseSchema'
import { DialogHeader } from '../ui/dialog'

export const NewCourseDialog = ({
  setDialogOpen,
}: {
  setDialogOpen: (state: boolean) => void
}) => {
  const utils = api.useUtils()
  const form = useForm<NewCourseFieldValues>({
    resolver: zodResolver(newCourseSchema),
  })
  const mutation = api.course.create.useMutation()

  const onSubmit = (data: NewCourseFieldValues) => {
    const promise = mutation
      .mutateAsync(data)
      .then(() => {
        setDialogOpen(false)
      })
      .finally(() => {
        utils.course.invalidate()
      })
    toast.promise(promise, {
      loading: 'جاري إضافة المقرر',
      success: 'تم إضافة المقرر بنجاح',
      error: (error) => error.message,
    })
  }
  return (
    <>
      <DialogHeader className='mb-2 text-lg font-bold'>إضافة مقرر</DialogHeader>
      <CourseForm
        form={form}
        onSubmit={onSubmit}
        isLoading={mutation.isPending}
        submitText='إضافة'
      />
    </>
  )
}
