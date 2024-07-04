'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import { useForm, useWatch } from 'react-hook-form'
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
import { Switch } from '~/components/ui/switch'
import { api } from '~/trpc/react'
import { updateProfileSchema } from '~/validation/updateProfileSchema'

type FieldValues = {
  name: string
  phone: string
  changePassword: boolean
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}

export const ProfileForm = ({
  user,
}: {
  user: { name: string; phone: string | null }
}) => {
  const form = useForm<FieldValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { changePassword: false, ...user, phone: user.phone ?? '' },
  })

  const { update } = useSession()

  const changePassword = useWatch({
    control: form.control,
    name: 'changePassword',
  })

  const mutation = api.user.updateProfile.useMutation({
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: (newData) => {
      // toast.success(
      //   'تم تعديل البيانات بنجاح. قد تحتاج لتسجيل الخروج لملاحظة التعديلات',
      // )
      // void update({ name: newData?.name, phone: newData?.phone })
    },
  })

  const onSubmit = (data: FieldValues) => {
    mutation.mutate(data)
  }

  return (
    <Form {...form}>
      <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>الاسم</FormLabel>
              <FormControl>
                <Input type='text' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='phone'
          render={({ field }) => (
            <FormItem>
              <FormLabel>رقم الهاتف</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='changePassword'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className='flex items-center gap-2'>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <FormLabel>تغيير كلمة المرور</FormLabel>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {changePassword && (
          <>
            <FormField
              control={form.control}
              name='currentPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>كلمة المرور الحالية</FormLabel>
                  <FormControl>
                    <Input type='password' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='newPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>كلمة المرور الجديدة</FormLabel>
                  <FormControl>
                    <Input type='password' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='confirmNewPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>تأكيد كلمة المرور الجديدة</FormLabel>
                  <FormControl>
                    <Input type='password' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        <Button loading={mutation.isPending}>حفظ</Button>
      </form>
    </Form>
  )
}
