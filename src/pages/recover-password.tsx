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
import { recoverPasswordSchema } from '~/validation/recoverPasswordSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '~/utils/api'
import { useToast } from '~/components/ui/use-toast'

type FieldValues = {
  email: string
}

const RecoverPasswordPage = () => {
  const form = useForm<FieldValues>({
    resolver: zodResolver(recoverPasswordSchema),
  })

  const { toast } = useToast()

  const passwordRecover = api.recoverPassword.useMutation()

  const onSubmit = (data: FieldValues) => {
    passwordRecover
      .mutateAsync(data)
      .then((data) => {
        console.log('Success')
      })
      .catch((error) => {
        toast({ title: (error as any).message })
      })
  }

  return (
    <>
      <Head>
        <title>حفاظ الوحيين | استعادة كلمة السر</title>
      </Head>
      <WebsiteLayout>
        <div className='mx-auto mt-20 max-w-[360px] rounded-md bg-white p-4 shadow'>
          <h1 className='mb-4 text-center text-2xl font-bold text-neutral-800'>
            استعادة كلمة السر
          </h1>
          <p className='mb-2 text-sm text-gray-700'>
            سيتم ارسال رابط لإعادة تعيين كلمة المرور على البريد الإلكتروني الخاص
            بك.
          </p>
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
                <Button loading={false}>أرسل</Button>
              </div>
            </form>
          </Form>
        </div>
      </WebsiteLayout>
    </>
  )
}

export default RecoverPasswordPage
