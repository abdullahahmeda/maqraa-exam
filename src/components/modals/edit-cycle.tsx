import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { api } from '~/utils/api'
import { CycleForm, EditCycleFieldValues } from '../forms/cycle'
import { DialogHeader } from '../ui/dialog'
import { editCycleSchema } from '~/validation/editCycleSchema'
import { useToast } from '../ui/use-toast'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

export const EditCycleDialog = ({ id }: { id: string }) => {
  const form = useForm<EditCycleFieldValues>({
    resolver: zodResolver(editCycleSchema),
  })

  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { data: cycle, isLoading, error } = api.cycle.get.useQuery(id)

  useEffect(() => {
    if (cycle) form.reset(cycle)
  }, [cycle, form])

  const cycleUpdate = api.cycle.update.useMutation()

  const onSubmit = (data: EditCycleFieldValues) => {
    const t = toast({ title: 'جاري تعديل الدورة' })
    cycleUpdate
      .mutateAsync(data)
      .then(() => {
        t.dismiss()
        toast({ title: 'تم تعديل الدورة بنجاح' })
        // closeModal()
      })
      .catch((error) => {
        t.dismiss()
        toast({ title: error.message, variant: 'destructive' })
      })
      .finally(() => {
        queryClient.invalidateQueries([['cycle']])
      })
  }

  if (isLoading)
    return (
      <div className='flex justify-center'>
        <Loader2 className='h-4 w-4 animate-spin' />
      </div>
    )

  if (error || !cycle)
    return (
      <p className='text-center text-red-600'>
        {error?.message || 'حدث خطأ ما'}
      </p>
    )

  return (
    <>
      <DialogHeader className='mb-2 text-lg font-bold'>
        تعديل المقرر
      </DialogHeader>
      <CycleForm
        form={form as any}
        onSubmit={onSubmit as any}
        isLoading={cycleUpdate.isLoading}
        submitText='تعديل'
      />
    </>
  )
}
