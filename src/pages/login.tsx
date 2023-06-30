import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { FaEnvelope } from 'react-icons/fa'
import { useForm } from 'react-hook-form'
import { loginSchema } from '../validation/loginSchema'
import { zodResolver } from '@hookform/resolvers/zod'
// import Button from '../components/button'
import { customErrorMap } from '../validation/customErrorMap'
import { getProviders, signIn } from 'next-auth/react'
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import WebsiteLayout from '../components/layout'
import { getServerAuthSession } from '../server/auth'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'

type FieldValues = {
  email: string
}

const defaultValues: FieldValues = {
  email: '',
}

export default function LoginPage({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter()
  const form = useForm<FieldValues>({
    defaultValues,
    resolver: zodResolver(loginSchema, {
      errorMap: customErrorMap,
    }),
  })

  const onSubmit = (data: FieldValues) => {
    signIn('email', { email: data.email, redirect: false })
      .then((response) => {
        if (response?.error === 'AccessDenied') {
          form.setError('root.serverError', {
            message: 'هذا الإيميل غير مسجل، قم بالتسجيل أولاً',
          })
          return
        }
        if (response?.ok) {
          router.push('/verify-request')
        }
      })
      .catch(() => {
        form.setError('root.serverError', {
          message: 'حدث خطأ غير متوقع',
        })
      })
  }

  return (
    <>
      <style global jsx>{`
        body {
          background: linear-gradient(
              to bottom,
              rgba(92, 77, 66, 0.9) 0%,
              rgba(92, 77, 66, 0.9) 100%
            ),
            url(/bg.jpg);
          background-position: center;
          background-repeat: no-repeat;
          background-attachment: scroll;
          background-size: cover;
          height: 100vh;
        }
      `}</style>
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
          <div className='bg-white p-5 shadow'>
            <h1 className='mb-4 text-center text-2xl font-bold text-neutral-800'>
              تسجيل الدخول
            </h1>
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
            <Button className='mt-2'>أرسل الرابط</Button>
          </div>
        </form>
      </Form>
    </>
  )
}
LoginPage.getLayout = (page: any) => <WebsiteLayout>{page}</WebsiteLayout>

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req, res } = context
  const session = await getServerAuthSession({ req, res })

  if (session) {
    return { redirect: { destination: '/' } }
  }

  const providers = await getProviders()

  return {
    props: { providers: providers ?? [] },
  }
}
