'use client'

import { useForm, useWatch } from 'react-hook-form'
import { Form } from '~/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '~/trpc/react'
import { toast } from 'sonner'
import { populateFormWithErrors } from '~/utils/errors'
import { useRouter } from 'next/navigation'
import { Button } from '~/components/ui/button'
import type { Cycle } from '~/kysely/types'
import { type Selectable } from 'kysely'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { UserIcon, UsersIcon } from 'lucide-react'
import {
  type NewUserFieldValues,
  SingleUserFormFields,
} from './form-fields/single'
import {
  type SheetUsersFieldValues,
  SheetUsersFormFields,
} from './form-fields/sheet'
import { createUserSchema } from '~/validation/backend/mutations/user/create'
import { z } from 'zod'
import { importUsersSchema } from '~/validation/backend/mutations/user/import'

type FieldValues =
  | ({ type: 'single' } & NewUserFieldValues)
  | ({ type: 'sheet' } & SheetUsersFieldValues)

export function NewUserForm({ cycles }: { cycles: Selectable<Cycle>[] }) {
  const router = useRouter()
  const form = useForm<FieldValues>({
    resolver: zodResolver(
      z.union([
        createUserSchema.and(z.object({ type: z.literal('single') })),
        importUsersSchema.extend({ type: z.literal('sheet') }),
      ]),
    ),
    defaultValues: {
      type: 'single',
      password: '',
      student: { cycles: [] },
      corrector: { cycles: [] },
    },
  })

  const type = useWatch({
    control: form.control,
    name: 'type',
  })

  const utils = api.useUtils()
  const createUser = api.user.create.useMutation({
    onError(error) {
      toast.error(error.message ?? 'حدث خطأ غير متوقع')
      populateFormWithErrors(form, error)
    },
    onSuccess() {
      toast.success('تم إضافة المستخدم بنجاح')
      void utils.user.invalidate()

      if (history.state === null) router.push('/dashboard/users')
      else router.back()
    },
  })

  const importUsers = api.user.import.useMutation({
    onError(error) {
      toast.error(error.message ?? 'حدث خطأ غير متوقع')
      populateFormWithErrors(form, error)
    },
    onSuccess() {
      toast.success('تم استيراد الطلاب بنجاح')
      void utils.user.invalidate()

      if (history.state === null) router.push('/dashboard/users')
      else router.back()
    },
  })

  const onSubmit = (data: FieldValues) => {
    if (data.type === 'single') {
      // @ts-expect-error no error. Just because discriminatedUnion in createUserSchema.
      createUser.mutate(data)
    } else {
      importUsers.mutate(data)
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <Tabs
          value={type}
          className='w-full'
          onValueChange={(value) =>
            form.setValue('type', value as 'single' | 'sheet')
          }
        >
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger
              value='single'
              className='flex items-center gap-2'
              type='button'
            >
              <UserIcon className='h-4 w-4' />
              مستخدم واحد
            </TabsTrigger>
            <TabsTrigger
              value='sheet'
              className='flex items-center gap-2'
              type='button'
            >
              <UsersIcon className='h-4 w-4' />
              من اكسل (للطلاب)
            </TabsTrigger>
          </TabsList>
          <TabsContent value='single' className='space-y-4'>
            <SingleUserFormFields form={form} cycles={cycles} />
          </TabsContent>
          <TabsContent value='sheet' className='space-y-4'>
            <SheetUsersFormFields form={form} cycles={cycles} />
          </TabsContent>
        </Tabs>
        <div>
          <Button loading={createUser.isPending || importUsers.isPending}>
            إضافة
          </Button>
        </div>
      </form>
    </Form>
  )
}
