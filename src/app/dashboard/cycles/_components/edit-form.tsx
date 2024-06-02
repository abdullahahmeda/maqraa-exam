'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { api } from '~/trpc/react'
import { toast } from 'sonner'
import { CycleFormFields, type EditCycleFieldValues } from './form-fields'
import { Button } from '~/components/ui/button'
import { Form } from '~/components/ui/form'
import type { Cycle, Curriculum, CycleCurriculum } from '~/kysely/types'
import { populateFormWithErrors } from '~/utils/errors'
import { useRouter } from 'next/navigation'
import { type Selectable } from 'kysely'
import { updateCycleFrontendSchema } from '~/validation/frontend/cycle/update'
import { updateCycleFrontendDataToBackend } from '~/dto/validation/cycle/update'

export const EditCycleForm = ({
  cycle,
  curricula,
}: {
  cycle: Selectable<Cycle> & {
    cycleCurricula: (Selectable<CycleCurriculum> & {
      curriculum: Selectable<Curriculum> | null
    })[]
  }
  curricula: Selectable<Curriculum>[]
}) => {
  const router = useRouter()
  const form = useForm<EditCycleFieldValues>({
    resolver: zodResolver(updateCycleFrontendSchema),
    defaultValues: {
      ...cycle,
      curricula: cycle.cycleCurricula.map((c) => ({
        label: c.curriculum?.name,
        value: c.curriculum?.id,
      })),
    },
  })

  const utils = api.useUtils()

  const mutation = api.cycle.update.useMutation({
    onError(error) {
      toast.error(error.message ?? 'حدث خطأ غير متوقع')
      populateFormWithErrors(form, error)
    },
    onSuccess() {
      toast.success('تم تعديل الدورة بنجاح')
      void utils.cycle.invalidate()

      if (history.state === null) router.push('/dashboard/cycles')
      else router.back()
    },
  })

  const onSubmit = (data: EditCycleFieldValues) => {
    mutation.mutate(updateCycleFrontendDataToBackend(data))
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <CycleFormFields curricula={curricula} control={form.control} />
        <Button loading={mutation.isPending}>تعديل</Button>
      </form>
    </Form>
  )
}
