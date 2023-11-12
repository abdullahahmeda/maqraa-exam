import WebsiteLayout from '~/components/layout'
import Head from 'next/head'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { GetServerSideProps } from 'next'
import { resetPasswordSchema } from '~/validation/resetPasswordSchema'
import { api } from '~/utils/api'
import { useToast } from '~/components/ui/use-toast'
import { useRouter } from 'next/router'

type FieldValues = {
  token: string
  password: string
  confirmPassword: string
}

export const PasswordTokenPage = ({ token }: { token: string }) => {
  const form = useForm<FieldValues>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const router = useRouter()

  const { toast } = useToast()

  // TODO: fix this
  // const passwordReset = api.resetPassword.useMutation()

  const onSubmit = (data: FieldValues) => {
    // passwordReset
    //   .mutateAsync(data)
    //   .then(() => {
    //     toast({ title: 'تم تغيير كلمة المرور، قم بتسجيل الدخول' })
    //     router.replace('/')
    //   })
    //   .catch((error) => {
    //     toast({ title: (error as any).message, variant: 'destructive' })
    //   })
  }

  return (
    <>
      <Head>
        <title>إعادة تعيين كلمة المرور</title>
      </Head>
      <WebsiteLayout>
        <div className='mx-auto mt-20 max-w-[360px] rounded-md bg-white p-4 shadow'>
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
                <Button loading={false}>تأكيد</Button>
              </div>
            </form>
          </Form>
        </div>
      </WebsiteLayout>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const token = ctx.params!.token as string
  // const passwordToken = await prisma.resetPasswordToken.findFirst({
  //   where: { token, expires: { gt: new Date() } },
  // })
  // if (!passwordToken)
  //   return {
  //     notFound: true,
  //   }

  return { props: { token } }
}

export default PasswordTokenPage
