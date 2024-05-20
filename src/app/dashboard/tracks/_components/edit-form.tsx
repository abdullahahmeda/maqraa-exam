'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { TrackFormFields, type EditTrackFieldValues } from './form-fields'
import { Button } from '~/components/ui/button'
import { Form } from '~/components/ui/form'
import type { Track, Course } from '~/kysely/types'
import { populateFormWithErrors } from '~/utils/errors'
import { useRouter } from 'next/navigation'
import { type Selectable } from 'kysely'
import { api } from '~/trpc/react'
import { updateTrackSchema } from '~/validation/backend/mutations/track/update'

export const EditTrackForm = ({
  track,
  courses,
}: {
  track: Selectable<Track>
  courses: Selectable<Course>[]
}) => {
  const router = useRouter()
  const form = useForm<EditTrackFieldValues>({
    resolver: zodResolver(updateTrackSchema),
    defaultValues: track,
  })

  const utils = api.useUtils()

  const mutation = api.track.update.useMutation({
    onError(error) {
      toast.error(error.message ?? 'حدث خطأ غير متوقع')
      populateFormWithErrors(form, error)
    },
    onSuccess() {
      toast.success('تم تعديل المسار بنجاح')
      void utils.track.invalidate()

      if (history.state === null) router.push('/dashboard/tracks')
      else router.back()
    },
  })

  const onSubmit = (data: EditTrackFieldValues) => {
    mutation.mutate(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <TrackFormFields control={form.control} courses={courses} />
        <Button loading={mutation.isPending}>تعديل</Button>
      </form>
    </Form>
  )
}
