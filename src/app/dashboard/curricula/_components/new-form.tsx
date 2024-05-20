'use client'

import { useForm } from 'react-hook-form'
import { Form } from '~/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '~/trpc/react'
import {
  CurriculumFormFields,
  type NewCurriculumFieldValues,
} from './form-fields'
import { toast } from 'sonner'
import { populateFormWithErrors } from '~/utils/errors'
import { useRouter } from 'next/navigation'
import { Button } from '~/components/ui/button'
import type { Course, Track } from '~/kysely/types'
import { type Selectable } from 'kysely'
import { createCurriculumSchema } from '~/validation/backend/mutations/curriculum/create'

export function NewCurriculumForm({
  tracks,
}: {
  tracks: (Selectable<Track> & { course: Selectable<Course> | null })[]
}) {
  const router = useRouter()
  const form = useForm<NewCurriculumFieldValues>({
    resolver: zodResolver(createCurriculumSchema),
  })

  const utils = api.useUtils()
  const mutation = api.curriculum.create.useMutation({
    onError(error) {
      toast.error(error.message ?? 'حدث خطأ غير متوقع')
      populateFormWithErrors(form, error)
    },
    onSuccess() {
      toast.success('تم إضافة المنهج بنجاح')
      void utils.curriculum.invalidate()

      if (history.state === null) router.push('/dashboard/curricula')
      else router.back()
    },
  })

  const onSubmit = (data: NewCurriculumFieldValues) => {
    mutation.mutate(data)
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <CurriculumFormFields control={form.control} tracks={tracks} />
        <div>
          <Button loading={mutation.isPending}>إضافة</Button>
        </div>
      </form>
    </Form>
  )
}
