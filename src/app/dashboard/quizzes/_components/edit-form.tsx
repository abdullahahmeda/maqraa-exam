'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { type Selectable } from 'kysely'
import { useForm } from 'react-hook-form'
import { Button } from '~/components/ui/button'
import { Combobox } from '~/components/ui/combobox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import type { Quiz } from '~/kysely/types'

export type EditQuizFieldValues = {
  modelId: string
}

export const EditQuizForm = ({
  quiz,
  models,
}: {
  quiz: Selectable<Quiz>
  models: { id: string; name: string }[]
}) => {
  const form = useForm<EditQuizFieldValues>({
    // resolver: zodResolver(),
    defaultValues: quiz,
  })

  const onSubmit = (data: EditQuizFieldValues) => {
    alert('submitted')
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='modelId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>نموذج الإختبار</FormLabel>
              <FormControl>
                <Combobox
                  items={models}
                  labelKey='name'
                  valueKey='id'
                  value={field.value}
                  onSelect={field.onChange}
                  triggerText='اختر'
                  triggerClassName='w-full'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button>تعديل</Button>
      </form>
    </Form>
  )
}
