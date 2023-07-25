import { useQueryClient } from '@tanstack/react-query'
import { AddCurriculumFieldValues, CurriculumForm } from '../forms/curriculum'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { newCurriculumSchema } from '~/validation/newCurriculumSchema'
import { z } from 'zod'
import { useToast } from '../ui/use-toast'
import { api } from '~/utils/api'
import { DialogHeader } from '../ui/dialog'

export const AddCurriculumDialog = ({
  setDialogOpen,
}: {
  setDialogOpen: (state: boolean) => void
}) => {
  const queryClient = useQueryClient()
  const form = useForm<AddCurriculumFieldValues>({
    resolver: zodResolver(newCurriculumSchema),
    defaultValues: {
      parts: [{ name: '', number: '', from: '', to: '', mid: '' }],
    },
  })

  const curriculumCreate = api.curricula.create.useMutation()

  const { toast } = useToast()

  const onSubmit = (data: AddCurriculumFieldValues) => {
    const t = toast({ title: 'جاري إضافة المنهج' })
    curriculumCreate
      .mutateAsync(data as z.infer<typeof newCurriculumSchema>)
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
        queryClient.invalidateQueries([['curricula']])
      })
  }

  return (
    <>
      <DialogHeader>إضافة منهج</DialogHeader>
      <CurriculumForm
        form={form}
        onSubmit={onSubmit}
        isLoading={curriculumCreate.isLoading}
        submitText='إضافة'
      />
    </>
  )
}
