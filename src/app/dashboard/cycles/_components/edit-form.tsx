'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { api } from '~/trpc/react'
import { toast } from 'sonner'
import { CycleFormFields, type EditCycleFieldValues } from './form-fields'
import { Button } from '~/components/ui/button'
import { Form } from '~/components/ui/form'
import { type Cycle } from '~/kysely/types'
import { populateFormWithErrors } from '~/utils/errors'
import { useRouter } from 'next/navigation'
import { type Selectable } from 'kysely'
import { updateCycleSchema } from '~/validation/backend/mutations/cycle/update'

export const EditCycleForm = ({ cycle }: { cycle: Selectable<Cycle> }) => {
  const router = useRouter()
  const form = useForm<EditCycleFieldValues>({
    resolver: zodResolver(updateCycleSchema),
    defaultValues: cycle,
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
    mutation.mutate(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <CycleFormFields control={form.control} />
        <Button loading={mutation.isPending}>تعديل</Button>
      </form>
    </Form>
  )
}
