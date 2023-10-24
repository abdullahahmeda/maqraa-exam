import Head from 'next/head'
import DashboardLayout from '~/components/dashboard/layout'
// import { NextPageWithLayout } from '~/pages/_app'
import { GetServerSideProps } from 'next'
import { getServerAuthSession } from '~/server/auth'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { prisma as _prisma } from '~/server/db'
import { enhance } from '@zenstackhq/runtime'
import { Input } from '~/components/ui/input'
import { useEffect } from 'react'
import { Button } from '~/components/ui/button'
import { api } from '~/utils/api'
import { updateProfileSchema } from '~/validation/updateProfileSchema'
import { Switch } from '~/components/ui/switch'
import { useSession } from 'next-auth/react'
import { useToast } from '~/components/ui/use-toast'
import { TRPCClientError } from '@trpc/client'

type FieldValues = {
  name: string
  phone: string
  changePassword: boolean
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}

type Props = {
  user: { name: string; phone: string | null }
}

const ReportsPage = ({ user }: Props) => {
  const form = useForm<FieldValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { changePassword: false },
  })

  const { update } = useSession()
  const { toast } = useToast()

  const changePassword = useWatch({
    control: form.control,
    name: 'changePassword',
  })

  const profileUpdate = api.updateUserProfile.useMutation()

  useEffect(() => {
    form.reset(user as any)
  }, [form, user])

  const onSubmit = (data: FieldValues) => {
    profileUpdate
      .mutateAsync(data)
      .then((newData) => {
        toast({
          title:
            'تم تعديل البيانات بنجاح. قد تحتاج لتسجيل الخروج لملاحظة التعديلات',
        })
        update({ name: newData?.name, phone: newData?.phone })
      })
      .catch((error) => {
        toast({
          title:
            error instanceof TRPCClientError
              ? error.message
              : 'حدث خطأ أثناء حفظ البيانات',
        })
      })
  }

  return (
    <>
      <Head>
        <title>تعديل البيانات</title>
      </Head>
      <div className='rounded-md bg-white p-4 shadow'>
        <h2 className='mb-4 text-xl font-bold'>تعديل البيانات</h2>
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
            <Button loading={profileUpdate.isLoading}>حفظ</Button>
          </form>
        </Form>
      </div>
    </>
  )
}

ReportsPage.getLayout = (page: any) => <DashboardLayout>{page}</DashboardLayout>

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession({ req: ctx.req, res: ctx.res })
  if (!session?.user) return { notFound: true }

  const prisma = enhance(_prisma, { user: session?.user })

  const examsCountByType = await prisma.quiz.groupBy({
    by: ['type'],
    where: { systemExamId: null },
    _count: true,
  })
  const examsCount = await prisma.quiz.count({ where: { systemExamId: null } })

  // const gradesAverageByType = await prisma.quiz.groupBy({
  //   by: ['type'],
  //   where: { systemExamId: null },
  //   _avg: { percentage: true },
  // })
  // const gradesAverage = await prisma.quiz.aggregate({
  //   _avg: { percentage: true },
  // })

  return {
    props: {
      session,
    },
  }
}

export default ReportsPage
