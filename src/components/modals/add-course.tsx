import { useQueryClient } from '@tanstack/react-query'
import { AddCourseFieldValues, CourseForm } from '../forms/course'
import { useToast } from '../ui/use-toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '~/utils/api'
import { newCourseSchema } from '~/validation/newCourseSchema'
import { DialogHeader } from '../ui/dialog'

export const AddCourseDialog = ({
  setDialogOpen,
}: {
  setDialogOpen: (state: boolean) => void
}) => {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const form = useForm<AddCourseFieldValues>({
    resolver: zodResolver(newCourseSchema),
  })
  const courseCreate = api.courses.create.useMutation()

  const onSubmit = (data: AddCourseFieldValues) => {
    const t = toast({ title: 'جاري إضافة المقرر' })
    courseCreate
      .mutateAsync(data)
      .then(() => {
        t.dismiss()
        toast({ title: 'تم إضافة المقرر بنجاح' })
        setDialogOpen(false)
      })
      .catch((error) => {
        t.dismiss()
        toast({ title: error.message, variant: 'destructive' })
      })
      .finally(() => {
        queryClient.invalidateQueries([['courses']])
      })
  }
  return (
    <>
      <DialogHeader>إضافة مقرر</DialogHeader>
      <CourseForm
        form={form}
        onSubmit={onSubmit}
        isLoading={courseCreate.isLoading}
        submitText='إضافة'
      />
    </>
  )
}
