import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { api } from '~/utils/api'
import { CycleForm, EditCycleFieldValues } from '../forms/cycle'
import { DialogHeader } from '../ui/dialog'
import { editCycleSchema } from '~/validation/editCycleSchema'
import { toast } from 'sonner'
import { useEffect } from 'react'
import { Loader2Icon } from 'lucide-react'

export const EditCycleDialog = ({ id }: { id: string }) => {
  const form = useForm<EditCycleFieldValues>({
    resolver: zodResolver(editCycleSchema),
  })

  const utils = api.useUtils()
  const { data: cycle, isLoading, error } = api.cycle.get.useQuery(id)

  useEffect(() => {
    if (cycle) form.reset(cycle)
  }, [cycle, form])

  const mutation = api.cycle.update.useMutation()

  const onSubmit = (data: EditCycleFieldValues) => {
    const promise = mutation.mutateAsync(data).finally(() => {
      utils.cycle.invalidate()
    })
    toast.promise(promise, {
      loading: 'جاري تعديل الدورة...',
      success: 'تم تعديل الدورة بنجاح',
      error: (error) => error.message,
    })
  }

  if (isLoading)
    return (
      <div className='flex justify-center'>
        <Loader2Icon className='h-4 w-4 animate-spin' />
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
        isLoading={mutation.isPending}
        submitText='تعديل'
      />
    </>
  )
}
