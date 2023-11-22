import { useForm } from 'react-hook-form'
import { useToast } from '../ui/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { newCycleSchema } from '~/validation/newCycleSchema'
import { api } from '~/utils/api'
import { NewCycleFieldValues, CycleForm } from '../forms/cycle'
import { DialogHeader } from '../ui/dialog'

export const NewCycleDialog = ({
  setDialogOpen,
}: {
  setDialogOpen: (state: boolean) => void
}) => {
  const form = useForm<NewCycleFieldValues>({
    resolver: zodResolver(newCycleSchema),
  })

  const queryClient = useQueryClient()
  const { toast } = useToast()

  const cycleCreate = api.cycle.create.useMutation()

  const onSubmit = (data: NewCycleFieldValues) => {
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
        queryClient.invalidateQueries([['cycle']])
      })
  }

  return (
    <>
      <DialogHeader className='mb-2 text-lg font-bold'>إضافة دورة</DialogHeader>
      <CycleForm
        form={form}
        isLoading={cycleCreate.isLoading}
        submitText='إضافة'
        onSubmit={onSubmit}
      />
    </>
  )
}
