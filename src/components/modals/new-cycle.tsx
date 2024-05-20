import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { newCycleSchema } from '~/validation/newCycleSchema'
import { api } from '~/trpc/react'
import { type NewCycleFieldValues, CycleForm } from '../forms/cycle'
import { DialogHeader } from '../ui/dialog'
import { toast } from 'sonner'
import { populateFormWithErrors } from '~/utils/errors'

export const NewCycleDialog = ({
  setDialogOpen,
}: {
  setDialogOpen: (state: boolean) => void
}) => {
  const form = useForm<NewCycleFieldValues>({
    resolver: zodResolver(newCycleSchema),
  })

  const utils = api.useUtils()
  const mutation = api.cycle.create.useMutation()

  const onSubmit = (data: NewCycleFieldValues) => {
    const promise = mutation.mutateAsync(data)
    toast.promise(promise, {
      loading: 'جاري إضافة الدورة...',
      success: 'تم إضافة الدورة بنجاح',
      error: (error) => error.message,
    })
    promise
      .then(() => {
        setDialogOpen(false)
      })
      .catch((error) => {
        populateFormWithErrors(form, error)
      })
      .finally(() => {
        utils.cycle.invalidate()
      })
  }

  return (
    <>
      <DialogHeader className='mb-2 text-lg font-bold'>إضافة دورة</DialogHeader>
      <CycleForm
        form={form}
        isLoading={mutation.isPending}
        submitText='إضافة'
        onSubmit={onSubmit}
      />
    </>
  )
}
