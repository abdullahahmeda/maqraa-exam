'use client'

import { useForm } from 'react-hook-form'
import { Form } from '~/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '~/utils/api'
import { TrackFormFields, type NewTrackFieldValues } from './form-fields'
import { toast } from 'sonner'
import { populateFormWithErrors } from '~/utils/errors'
import { Button } from '~/components/ui/button'
import { type Course } from '~/kysely/types'
import { type Selectable } from 'kysely'
import { createTrackSchema } from '~/validation/backend/mutations/track/create'

export function NewTrackForm({ courses, defaultValues }: { courses: Selectable<Course>[]; defaultValues?: { courseId: string } }) {
  const utils = api.useUtils()
  const form = useForm<NewTrackFieldValues>({
    defaultValues,
    resolver: zodResolver(createTrackSchema),
  })

  const mutation = api.track.create.useMutation({
    onError(error) {
      toast.error(error.message ?? 'حدث خطأ غير متوقع')
      populateFormWithErrors(form, error)
    },
    onSuccess() {
      toast.success('تم إضافة المسار بنجاح')
      void utils.track.invalidate()
      void utils.course.getOneForShow.invalidate()
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
