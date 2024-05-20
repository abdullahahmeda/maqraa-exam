'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { api } from '~/trpc/react'
import { toast } from 'sonner'
import {
  CurriculumFormFields,
  type EditCurriculumFieldValues,
} from './form-fields'
import { Button } from '~/components/ui/button'
import { Form } from '~/components/ui/form'
import type { Course, Curriculum, CurriculumPart, Track } from '~/kysely/types'
import { populateFormWithErrors } from '~/utils/errors'
import { useRouter } from 'next/navigation'
import { type Selectable } from 'kysely'
import { updateCurriculumSchema } from '~/validation/backend/mutations/curriculum/update'

export const EditCurriculumForm = ({
  curriculum,
  tracks,
}: {
  curriculum: Selectable<Curriculum> & {
    parts: Selectable<CurriculumPart>[]
  }
  tracks: (Selectable<Track> & { course: Selectable<Course> | null })[]
}) => {
  const router = useRouter()
  const form = useForm<EditCurriculumFieldValues>({
    resolver: zodResolver(updateCurriculumSchema),
    defaultValues: curriculum,
  })

  const utils = api.useUtils()

  const mutation = api.curriculum.update.useMutation({
    onError(error) {
      toast.error(error.message ?? 'حدث خطأ غير متوقع')
      populateFormWithErrors(form, error)
    },
    onSuccess() {
      toast.success('تم تعديل المنهج بنجاح')
      void utils.curriculum.invalidate()

      if (history.state === null) router.push('/dashboard/curricula')
      else router.back()
    },
  })

  const onSubmit = (data: EditCurriculumFieldValues) => {
    mutation.mutate(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <CurriculumFormFields control={form.control} tracks={tracks} />
        <div>
          <Button loading={mutation.isPending}>تعديل</Button>
        </div>
      </form>
    </Form>
  )
}
