import Head from 'next/head'
import DashboardLayout from '~/components/dashboard/layout'
import { api } from '~/utils/api'

import { useForm } from 'react-hook-form'
import { Button } from '~/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { getServerAuthSession } from '~/server/auth'

type FieldValues = Record<
  string,
  // SettingKey,
  string | number
>

const SettingsPage = () => {
  const form = useForm<FieldValues>({})

  // const settingsUpdate = api.settings.update.useMutation()

  // useEffect(() => {
  //   if (settings) {
  //     const settingsObj = settings.reduce(
  //       (obj, s) => ({ ...obj, [s.key]: s.value }),
  //       {}
  //     )
  //     form.reset(settingsObj)
  //   }
  // }, [settings])

  const onSubmit = async (data: FieldValues) => {
    // settingsUpdate
    //   .mutateAsync(data as any)
    //   .then(() => {
    //     toast.success('تم حفظ الإعدادات بنجاح')
    //   })
    //   .catch((error) => {
    //     if (error.message) toast.error(error.message)
    //     else toast.error('حدث خطأ غير متوقع')
    //   })
  }

  return (
    <>
      <Head>
        <title>الإعدادات</title>
      </Head>

      <h2 className='text-center text-xl font-semibold'>الإعدادات</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <h3>القائمة</h3>

          <Button type='submit' loading={false}>
            حفظ
          </Button>
        </form>
      </Form>
    </>
  )
}

SettingsPage.getLayout = (page: any) => (
  <DashboardLayout>{page}</DashboardLayout>
)

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getServerAuthSession({ req: ctx.req, res: ctx.res })

  if (session?.user.role !== 'ADMIN') return { notFound: true }
  return {
    props: {
      session,
    },
  }
}

export default SettingsPage
