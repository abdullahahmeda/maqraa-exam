import { useForm } from 'react-hook-form'
import { useToast } from '../ui/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { newCycleSchema } from '~/validation/newCycleSchema'
import { api } from '~/utils/api'
import { AddCycleFieldValues, CycleForm } from '../forms/cycle'
import { DialogHeader } from '../ui/dialog'

export const AddCycleDialog = ({
  setDialogOpen,
}: {
  setDialogOpen: (state: boolean) => void
}) => {
  const form = useForm<AddCycleFieldValues>({
    resolver: zodResolver(newCycleSchema),
  })

  const queryClient = useQueryClient()
  const { toast } = useToast()

  const cycleCreate = api.cycles.create.useMutation()

  const onSubmit = (data: AddCycleFieldValues) => {
    const t = toast({ title: 'جاري إضافة الدورة' })
    cycleCreate
      .mutateAsync(data)
      .then(() => {
        t.dismiss()
        toast({ title: 'تم إضافة الدورة بنجاح' })
        setDialogOpen(false)
      })
      .catch((error) => {
        t.dismiss()
        toast({ title: error.message, variant: 'destructive' })
      })
      .finally(() => {
        queryClient.invalidateQueries([['cycles']])
      })
  }

  return (
    <>
      <DialogHeader>إضافة دورة</DialogHeader>
      <CycleForm
        form={form}
        isLoading={cycleCreate.isLoading}
        submitText='إضافة'
        onSubmit={onSubmit}
      />
    </>
  )
}
