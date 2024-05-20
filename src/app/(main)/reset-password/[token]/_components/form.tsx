'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
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
import { api } from '~/trpc/react'
import { resetPasswordSchema } from '~/validation/resetPasswordSchema'

type FieldValues = {
  token: string
  password: string
  confirmPassword: string
}

export const ResetPasswordForm = ({ token }: { token: string }) => {
  const form = useForm<FieldValues>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const router = useRouter()

  const mutation = api.user.resetPassword.useMutation({
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: () => {
      toast.success('تم تغيير كلمة المرور، قم بتسجيل الدخول')
      router.replace('/')
    },
  })

  const onSubmit = (data: FieldValues) => {
    mutation.mutate(data)
  }

  return (
    <div className='mx-auto mt-20 max-w-[360px] rounded-md bg-white p-4 border'>
      <h1 className='mb-4 text-center text-2xl font-bold text-neutral-800'>
        إعادة تعيين كلمة المرور
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <input type='hidden' {...form.register('token')} value={token} />
          <div className='space-y-3'>
            <FormField
              control={form.control}
              name='password'
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
              name='confirmPassword'
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
            <Button loading={mutation.isPending}>تأكيد</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
