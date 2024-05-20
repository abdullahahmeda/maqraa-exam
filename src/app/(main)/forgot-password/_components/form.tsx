'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircleIcon } from 'lucide-react'
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
import { forgotPasswordSchema } from '~/validation/forgotPasswordSchema'

type FieldValues = {
  email: string
}

export const ForgotPasswordForm = () => {
  const form = useForm<FieldValues>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const mutation = api.user.forgotPassword.useMutation({
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onSubmit = (data: FieldValues) => {
    mutation.mutate(data)
  }

  return (
    <div className='mx-auto mt-20 max-w-[360px] rounded-md bg-white p-4 border'>
      {mutation.isSuccess ? (
        <div className='flex flex-col items-center space-y-3'>
          <CheckCircleIcon className='h-12 w-12' />
          <p>تم إرسال رسالة للبريد االإلكتروني الخاص بك</p>
        </div>
      ) : (
        <>
          <h1 className='mb-4 text-center text-2xl font-bold text-neutral-800'>
            استعادة كلمة السر
          </h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className='space-y-3'>
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>البريد الإلكتروني</FormLabel>
                      <FormControl>
                        <Input type='email' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <p className='mb-2 text-sm text-gray-700'>
                  سيتم ارسال رابط لإعادة تعيين كلمة المرور على البريد الإلكتروني
                  الخاص بك.
                </p>
                <Button loading={mutation.isPending}>أرسل</Button>
              </div>
            </form>
          </Form>
        </>
      )}
    </div>
  )
}
