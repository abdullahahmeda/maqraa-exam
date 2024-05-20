'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { SettingKey } from '~/kysely/enums'
import { api } from '~/trpc/react'
import { updateSettingsSchema } from '~/validation/backend/mutations/setting/update'

type FieldValues = {
  [SettingKey.SITE_NAME]: string
}

export const SettingsForm = ({ siteName }: { siteName: string }) => {
  const utils = api.useUtils()

  const form = useForm<FieldValues>({
    defaultValues: {
      [SettingKey.SITE_NAME]: siteName,
    },
    resolver: zodResolver(updateSettingsSchema),
  })

  const settingsUpdate = api.setting.update.useMutation({
    onSuccess: () => {
      toast.success('تم حفظ الإعدادات بنجاح')
      void utils.setting.invalidate()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onSubmit = async (data: FieldValues) => {
    settingsUpdate.mutate(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name={SettingKey.SITE_NAME}
          render={({ field }) => (
            <FormItem>
              <FormLabel>اسم الموقع</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button loading={settingsUpdate.isPending}>حفظ</Button>
      </form>
    </Form>
  )
}
