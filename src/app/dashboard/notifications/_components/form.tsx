'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { Checkbox } from '~/components/ui/checkbox'
import { Combobox } from '~/components/ui/combobox'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import MultipleSelector, { type Option } from '~/components/ui/multi-select'
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group'
import { Textarea } from '~/components/ui/textarea'
import { type UserRole } from '~/kysely/enums'
import { api } from '~/trpc/react'
import { populateFormWithErrors } from '~/utils/errors'
import { userRoleMapping } from '~/utils/users'
import { createNotificationSchema } from '~/validation/backend/mutations/notification/create'

type FieldValues = {
  body: string
  url: string
  to:
    | {
        base: 'all'
      }
    | {
        base: 'allExcept'
        allExcept: Option[]
      }
    | {
        base: 'selected'
        selected: Option[]
      }
    | {
        base: 'custom'
        custom: {
          role: UserRole[]
          cycle: string
        }
      }
}

export const CreateNotificationForm = () => {
  const utils = api.useUtils()
  const form = useForm<FieldValues>({
    resolver: zodResolver(createNotificationSchema),
    defaultValues: {
      to: {
        custom: {
          cycle: 'all',
          role: [],
        },
      },
    },
  })

  const createNotification = api.notification.create.useMutation({
    onError(error) {
      toast.error(error.message ?? 'حدث خطأ غير متوقع')
      populateFormWithErrors(form, error)
    },
    onSuccess() {
      toast.success('تم إضافة الإشعار بنجاح')
      void utils.notification.invalidate()
    },
  })

  const toBase = useWatch({
    control: form.control,
    name: 'to.base',
  })

  const onSubmit = (data: FieldValues) => {
    createNotification.mutate(data)
  }

  const { data: users } = api.user.list.useQuery(undefined, {
    enabled: ['allExcept', 'selected'].includes(toBase),
  })

  const { data: cycles, isLoading: cyclesLoading } = api.cycle.getList.useQuery(
    undefined,
    {
      enabled: toBase === 'custom',
    },
  )

  return (
    <Form {...form}>
      <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name='body'
          render={({ field }) => (
            <FormItem>
              <FormLabel>نص الإشعار</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='url'
          render={({ field }) => (
            <FormItem>
              <FormLabel>رابط بعد الضغط (إختياري)</FormLabel>
              <FormControl>
                <Input type='url' {...field} />
              </FormControl>
              <FormDescription>
                رابط يتم فتحه عند الضغط على الإشعار
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='to.base'
          render={({ field }) => (
            <FormItem>
              <FormLabel>إرسال إلى</FormLabel>
              <FormControl>
                <RadioGroup value={field.value} onValueChange={field.onChange}>
                  <FormItem className='flex items-center gap-2 space-y-0'>
                    <FormControl>
                      <RadioGroupItem value='all' />
                    </FormControl>
                    <FormLabel>جميع المستخدمين</FormLabel>
                  </FormItem>
                  <div className='space-y-2'>
                    <FormItem className='flex items-center gap-2 space-y-0'>
                      <FormControl>
                        <RadioGroupItem value='allExcept' />
                      </FormControl>
                      <FormLabel>جميع المستخدمين ما عدا..</FormLabel>
                    </FormItem>
                    {toBase === 'allExcept' && (
                      <FormField
                        control={form.control}
                        name='to.allExcept'
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <MultipleSelector
                                value={field.value}
                                onChange={field.onChange}
                                options={
                                  users?.data.map((u) => ({
                                    label: u.email,
                                    value: u.id,
                                  })) ?? []
                                }
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                  <div className='space-y-2'>
                    <FormItem className='flex items-center gap-2 space-y-0'>
                      <FormControl>
                        <RadioGroupItem value='selected' />
                      </FormControl>
                      <FormLabel>المستخدمين الذين سيتم تحديدهم</FormLabel>
                    </FormItem>
                    {toBase === 'selected' && (
                      <FormField
                        control={form.control}
                        name='to.selected'
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <MultipleSelector
                                value={field.value}
                                onChange={field.onChange}
                                options={
                                  users?.data.map((u) => ({
                                    label: u.email,
                                    value: u.id,
                                  })) ?? []
                                }
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                  <div className='space-y-2'>
                    <FormItem className='flex items-center gap-2 space-y-0'>
                      <FormControl>
                        <RadioGroupItem value='custom' />
                      </FormControl>
                      <FormLabel>مخصص</FormLabel>
                    </FormItem>
                    {toBase === 'custom' && (
                      <div className='space-y-4'>
                        <FormField
                          control={form.control}
                          name='to.custom.role'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>الصلاحيات</FormLabel>
                              <div className='flex gap-4'>
                                {Object.entries(userRoleMapping).map(
                                  ([label, value]) => (
                                    <FormItem
                                      className='flex gap-2 items-center space-y-0'
                                      key={value}
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={
                                            !!field.value?.includes(value)
                                          }
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([
                                                  ...field.value,
                                                  value,
                                                ])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (v) => v !== value,
                                                  ),
                                                )
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel>{label}</FormLabel>
                                    </FormItem>
                                  ),
                                )}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name='to.custom.cycle'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>الدورة</FormLabel>
                              <FormControl>
                                <Combobox
                                  value={field.value}
                                  onSelect={field.onChange}
                                  items={
                                    cycles
                                      ? [
                                          { name: 'الكل', id: 'all' },
                                          ...cycles,
                                        ]
                                      : []
                                  }
                                  labelKey='name'
                                  valueKey='id'
                                  triggerText='اختر'
                                  triggerClassName='w-full'
                                  loading={cyclesLoading}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button loading={createNotification.isPending}>إنشاء</Button>
      </form>
    </Form>
  )
}
