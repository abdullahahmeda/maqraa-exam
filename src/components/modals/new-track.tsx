import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { api } from '~/utils/api'
import { newTrackSchema } from '~/validation/newTrackSchema'
import { NewTrackFieldValues, TrackForm } from '../forms/track'
import { DialogHeader } from '../ui/dialog'
import { toast } from 'sonner'

export const NewTrackDialog = ({
  setDialogOpen,
}: {
  setDialogOpen: (state: boolean) => void
}) => {
  const form = useForm<NewTrackFieldValues>({
    resolver: zodResolver(newTrackSchema),
  })

  const utils = api.useUtils()

  const mutation = api.track.create.useMutation()

  const onSubmit = (data: NewTrackFieldValues) => {
    const promise = mutation
      .mutateAsync(data as z.infer<typeof newTrackSchema>)
      .then(() => {
        setDialogOpen(false)
      })
      .finally(() => {
        utils.track.invalidate()
      })
    toast.promise(promise, {
      loading: 'جاري إضافة المسار',
      success: 'تم إضافة المسار بنجاح',
      error: (error) => error.message,
    })
  }

  return (
    <>
      <DialogHeader className='mb-2 text-lg font-bold'>إضافة مسار</DialogHeader>
      <TrackForm
        form={form}
        isLoading={mutation.isPending}
        onSubmit={onSubmit}
      />
    </>
  )
}
