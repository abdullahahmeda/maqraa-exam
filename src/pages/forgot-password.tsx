import Head from 'next/head'
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
  FormControl,
  FormLabel,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import WebsiteLayout from '~/components/layout'
import { useForm } from 'react-hook-form'
import { forgotPasswordSchema } from '~/validation/forgotPasswordSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '~/utils/api'
import { useToast } from '~/components/ui/use-toast'
import { useState } from 'react'
import { CheckCircle } from 'lucide-react'

type FieldValues = {
  email: string
}

const ForgotPasswordPage = () => {
  const form = useForm<FieldValues>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const [isSuccess, setIsSuccess] = useState(false)

  const { toast } = useToast()

  const passwordResetRequest = api.user.forgotPassword.useMutation()

  const onSubmit = (data: FieldValues) => {
    passwordResetRequest
      .mutateAsync(data)
      .then(() => {
        setIsSuccess(true)
      })
      .catch((error) => {
        toast({ title: (error as any).message, variant: 'destructive' })
      })
  }

  return (
    <>
      <Head>
        <title>حفاظ الوحيين | استعادة كلمة السر</title>
      </Head>
      <WebsiteLayout>
        <div className='mx-auto mt-20 max-w-[360px] rounded-md bg-white p-4 shadow'>
          {isSuccess ? (
            <div className='flex flex-col items-center space-y-3'>
              <CheckCircle className='h-12 w-12' />
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
                      سيتم ارسال رابط لإعادة تعيين كلمة المرور على البريد
                      الإلكتروني الخاص بك.
                    </p>
                    <Button loading={passwordResetRequest.isLoading}>
                      أرسل
                    </Button>
                  </div>
                </form>
              </Form>
            </>
          )}
        </div>
      </WebsiteLayout>
    </>
  )
}

export default ForgotPasswordPage
