'use client'

import { useForm } from 'react-hook-form'
import { Form } from '~/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '~/trpc/react'
import { CycleFormFields, type NewCycleFieldValues } from './form-fields'
import { toast } from 'sonner'
import { populateFormWithErrors } from '~/utils/errors'
import { useRouter } from 'next/navigation'
import { Button } from '~/components/ui/button'
import { type Selectable } from 'kysely'
import type { Curriculum } from '~/kysely/types'
import { createCycleFrontendSchema } from '~/validation/frontend/cycle/create'
import { createCycleFrontendDataToBackend } from '~/dto/validation/cycle/create'

export function NewCycleForm({
  curricula,
}: {
  curricula: Selectable<Curriculum>[]
}) {
  const router = useRouter()
  const form = useForm<NewCycleFieldValues>({
    resolver: zodResolver(createCycleFrontendSchema),
  })

  const utils = api.useUtils()
  const mutation = api.cycle.create.useMutation({
    onError(error) {
      toast.error(error.message ?? 'حدث خطأ غير متوقع')
      populateFormWithErrors(form, error)
    },
    onSuccess() {
      toast.success('تم إضافة الدورة بنجاح')
      void utils.cycle.invalidate()

      if (history.state === null) router.push('/dashboard/cycles')
      else router.back()
    },
  })

  const onSubmit = (data: NewCycleFieldValues) => {
    mutation.mutate(createCycleFrontendDataToBackend(data))
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <CycleFormFields control={form.control} curricula={curricula} />
        <Button loading={mutation.isPending}>إضافة</Button>
      </form>
    </Form>
  )
}
