import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { api } from '~/utils/api'
import { newTrackSchema } from '~/validation/newTrackSchema'
import { NewTrackFieldValues, TrackForm } from '../forms/track'
import { DialogHeader } from '../ui/dialog'
import { useToast } from '../ui/use-toast'

export const NewTrackDialog = ({
  setDialogOpen,
}: {
  setDialogOpen: (state: boolean) => void
}) => {
  const form = useForm<NewTrackFieldValues>({
    resolver: zodResolver(newTrackSchema),
  })

  const queryClient = useQueryClient()
  const { toast } = useToast()

  const trackCreate = api.track.create.useMutation()

  const onSubmit = (data: NewTrackFieldValues) => {
    const t = toast({ title: 'جاري إضافة المسار' })
    trackCreate
      .mutateAsync(data as z.infer<typeof newTrackSchema>)
      .then(() => {
        t.dismiss()
        toast({ title: 'تم إضافة المسار بنجاح' })
        setDialogOpen(false)
      })
      .catch((error) => {
        t.dismiss()
        toast({ title: error.message, variant: 'destructive' })
      })
      .finally(() => {
        queryClient.invalidateQueries([['track']])
      })
  }

  return (
    <>
      <DialogHeader className='mb-2 text-lg font-bold'>إضافة مسار</DialogHeader>
      <TrackForm
        form={form}
        isLoading={trackCreate.isLoading}
        onSubmit={onSubmit}
      />
    </>
  )
}
