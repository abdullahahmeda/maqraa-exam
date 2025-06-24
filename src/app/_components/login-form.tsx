'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
// import { useRouter } from 'next/navigation'
// import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button, buttonVariants } from '~/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { cn } from '~/lib/utils'
import { loginSchema } from '~/validation/loginSchema'

type FieldValues = {
  email: string
  password: string
}

export function LoginForm() {
  // const router = useRouter()
  // const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FieldValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (data: FieldValues) => {
    // setIsLoading(true)
    return signIn('credentials', { ...data, redirect: true })
      // .then((response) => {
      //   console.log(response)
      //   if (!response?.ok) {
      //     if (response?.error === 'CredentialsSignin') {
      //       form.setError('root.serverError', {
      //         message: 'هذه البيانات غير صحيحة',
      //       })
      //     } else {
      //       form.setError('root.serverError', {
      //         message: 'حدث خطأ أثناء تسجيل الدخول، يرجى إعادة المحاولة',
      //       })
      //     }
      //     return
      //   }
      //   router.push('/dashboard')
      // })
      // .catch(() => {
      //   form.setError('root.serverError', {
      //     message: 'حدث خطأ غير متوقع، تأكد من اتصال الإنترنت لديك',
      //   })
      // })
      // .finally(() => {
      //   setIsLoading(false)
      // })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className='rounded-md bg-white p-4 border'>
          <h1 className='mb-4 text-center text-2xl font-bold text-neutral-800'>
            تسجيل الدخول
          </h1>
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
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>كلمة المرور</FormLabel>
                  <FormControl>
                    <Input type='password' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <p className='text-sm font-medium text-destructive'>
              {form.formState.errors.root?.serverError?.message}
            </p>
            <div>
              <Link
                href='forgot-password'
                className={cn(buttonVariants({ variant: 'link' }), 'px-0')}
              >
                نسيت كلمة السر؟
              </Link>
            </div>
            <Button className='mt-2'>
              تسجيل الدخول
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}
