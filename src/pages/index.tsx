import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { loginSchema } from '../validation/loginSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import WebsiteLayout from '../components/layout'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { Button, buttonVariants } from '~/components/ui/button'
import { GetServerSideProps } from 'next'
import { getServerAuthSession } from '~/server/auth'
import { useState } from 'react'
import { cn } from '~/lib/utils'

type FieldValues = {
  email: string
  password: string
}

export default function LoginPage() {
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FieldValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (data: FieldValues) => {
    setIsLoading(true)
    signIn('credentials', { ...data, redirect: false })
      .then((response) => {
        if (response?.error === 'CredentialsSignin') {
          form.setError('root.serverError', {
            message: 'هذه البيانات غير صحيحة',
          })
        }
        if (response?.ok) {
          router.push('/')
        }
      })
      .catch(() => {
        form.setError('root.serverError', {
          message: 'حدث خطأ غير متوقع، تأكد من اتصال الإنترنت لديك',
        })
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <>
      <Head>
        <title>حفاظ الوحيين | تسجيل الدخول</title>
      </Head>
      <Form {...form}>
        <form
          className='mx-auto max-w-[360px] pt-20'
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className='mb-4 text-center'>
            <Link href='https://mqraa.alwahyaen.com/' className='inline-block'>
              <Image
                src='/maqraa_app.png'
                alt='Logo'
                width='230'
                height='150'
                className='inline-block'
              />
            </Link>
          </div>
          {router.query.callbackUrl && (
            <div className='bg-orange-500 p-2 text-neutral-50'>
              قم بتسجيل الدخول للمتابعة
            </div>
          )}
          <div className='rounded-md bg-white p-4 shadow'>
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
              <FormMessage>
                {form.formState.errors.root?.serverError?.message}
              </FormMessage>
              <div>
                <Link
                  href='forgot-password'
                  className={cn(buttonVariants({ variant: 'link' }), 'px-0')}
                >
                  نسيت كلمة السر؟
                </Link>
              </div>
              <Button className='mt-2' loading={isLoading}>
                تسجيل الدخول
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession({ req: ctx.req, res: ctx.res })
  if (session?.user)
    return {
      redirect: {
        permanent: false,
        destination: '/dashboard',
      },
    }

  return { props: { session } }
}

LoginPage.getLayout = (page: any) => <WebsiteLayout>{page}</WebsiteLayout>
