'use client'

import { useForm } from 'react-hook-form'
import { Form } from '~/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '~/trpc/react'
import { TrackFormFields, type NewTrackFieldValues } from './form-fields'
import { toast } from 'sonner'
import { populateFormWithErrors } from '~/utils/errors'
import { useRouter } from 'next/navigation'
import { Button } from '~/components/ui/button'
import { type Course } from '~/kysely/types'
import { type Selectable } from 'kysely'
import { createTrackSchema } from '~/validation/backend/mutations/track/create'

export function NewTrackForm({ courses }: { courses: Selectable<Course>[] }) {
  const router = useRouter()
  const form = useForm<NewTrackFieldValues>({
    resolver: zodResolver(createTrackSchema),
  })

  const utils = api.useUtils()
  const mutation = api.track.create.useMutation({
    onError(error) {
      toast.error(error.message ?? 'حدث خطأ غير متوقع')
      populateFormWithErrors(form, error)
    },
    onSuccess() {
      toast.success('تم إضافة المسار بنجاح')
      void utils.track.invalidate()

      if (history.state === null) router.push('/dashboard/tracks')
      else router.back()
    },
  })

  const onSubmit = (data: NewTrackFieldValues) => {
    mutation.mutate(data)
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <TrackFormFields control={form.control} courses={courses} />
        <Button loading={mutation.isPending}>إضافة</Button>
      </form>
    </Form>
  )
}
